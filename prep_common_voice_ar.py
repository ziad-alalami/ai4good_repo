import os, re, unicodedata, random, hashlib
from pathlib import Path
import pandas as pd
from tqdm import tqdm
import numpy as np
import soundfile as sf
import librosa
from datasets import load_dataset, Audio

# ---------- Config ----------
LANG = "ar"
HF_DS = "mozilla-foundation/common_voice_17_0"  # fallback to 16_1 if needed
OUT_DIR = Path("data/cv_ar_16k")
WAV_DIR = OUT_DIR / "wavs"
MAN_DIR = OUT_DIR / "manifests"

SR = 16_000
MIN_DUR, MAX_DUR = 1.0, 10.0      # seconds
TARGET_HOURS = 10                  # set None to keep all
SEED = 13
SPLITS = ["train", "validation", "test"]
# ----------------------------

random.seed(SEED)
np.random.seed(SEED)
WAV_DIR.mkdir(parents=True, exist_ok=True)
MAN_DIR.mkdir(parents=True, exist_ok=True)

# -------- Arabic normalization --------
AR_DIACRITICS = re.compile(r"[\u0610-\u061A\u064B-\u065F\u06D6-\u06ED]")
PUNCT = re.compile(r"[^\w\s\u0600-\u06FF]")  # keep Arabic letters/digits
SPC = re.compile(r"\s+")
ALEF_MAP = {"\u0622":"\u0627","\u0623":"\u0627","\u0625":"\u0627","\u0671":"\u0627"}
YA_MAP = {"\u0649":"\u064A"}
TA_MARBUTA = {"\u0629":"\u0647"}  # comment out if you prefer keeping ة

def norm_ar(text: str) -> str:
    if not text: return ""
    t = unicodedata.normalize("NFKC", text)
    t = AR_DIACRITICS.sub("", t)
    t = "".join(ALEF_MAP.get(ch, ch) for ch in t)
    t = "".join(YA_MAP.get(ch, ch) for ch in t)
    t = "".join(TA_MARBUTA.get(ch, ch) for ch in t)
    t = PUNCT.sub(" ", t)
    t = SPC.sub(" ", t).strip()
    return t

def seconds(num_samples: int, sr: int) -> float:
    return num_samples / float(sr)

print("Loading Common Voice Arabic…")
hf = {}
for split in SPLITS:
    d = load_dataset(HF_DS, LANG, split=split, trust_remote_code=True)
    d = d.cast_column("audio", Audio(sampling_rate=SR))  # ensures audio["array"] at SR
    hf[split] = d

# Pass 1: collect metadata (duration, speaker, normalized text, cached path)
examples = []
skipped_noaudio = 0
for split in SPLITS:
    d = hf[split]
    for ex in tqdm(d, desc=f"Scanning {split}"):
        audio = ex.get("audio")
        if not audio:
            skipped_noaudio += 1
            continue

        arr = audio.get("array", None)
        if arr is None:
            skipped_noaudio += 1
            continue

        dur = seconds(len(arr), SR)
        if dur < MIN_DUR or dur > MAX_DUR:
            continue

        text_raw = ex.get("sentence") or ex.get("text") or ""
        text = norm_ar(text_raw)
        if len(text) < 3:
            continue

        spk = ex.get("client_id")
        if spk is None:
            # fallback speaker if missing
            base = ex.get("path") or audio.get("path") or str(hash(text))
            spk = "spk_" + hashlib.md5(base.encode()).hexdigest()[:8]
        else:
            spk = str(spk)

        # path to original audio in HF cache (may be None rarely)
        cache_path = audio.get("path", None)

        examples.append({
            "orig_split": split,
            "speaker": spk,
            "text": text,
            "duration": float(dur),
            "cache_path": cache_path,
        })

print(f"Kept {len(examples)} clips. Skipped (no audio): {skipped_noaudio}")

meta = pd.DataFrame(examples)

# Speaker-held-out split (80/10/10 by speaker)
speakers = meta["speaker"].unique().tolist()
random.shuffle(speakers)
n = len(speakers)
train_spk = set(speakers[: int(0.8*n)])
valid_spk = set(speakers[int(0.8*n): int(0.9*n)])
test_spk  = set(speakers[int(0.9*n):])

def assign_split(spk):
    if spk in train_spk: return "train"
    if spk in valid_spk: return "valid"
    return "test"

meta["split"] = meta["speaker"].map(assign_split)

# Optional hour capping per split
def cap_hours(df, hours):
    if hours is None: return df
    target_sec = hours * 3600.0
    df = df.sample(frac=1.0, random_state=SEED)  # shuffle
    kept, tot = [], 0.0
    for _, r in df.iterrows():
        if tot >= target_sec: break
        kept.append(r)
        tot += r["duration"]
    return pd.DataFrame(kept)

train_hours = 0.8*TARGET_HOURS if TARGET_HOURS else None
valid_hours = 0.1*TARGET_HOURS if TARGET_HOURS else None
test_hours  = 0.1*TARGET_HOURS if TARGET_HOURS else None

train_df = cap_hours(meta[meta.split=="train"], train_hours)
valid_df = cap_hours(meta[meta.split=="valid"], valid_hours)
test_df  = cap_hours(meta[meta.split=="test"],  test_hours)
final_df = pd.concat([train_df, valid_df, test_df], ignore_index=True)

# Pass 2: write 16k WAVs and manifests
rows = []
for i, r in tqdm(final_df.iterrows(), total=len(final_df), desc="Writing WAVs"):
    spk = r["speaker"]
    text = r["text"]
    split = r["split"]
    path = r["cache_path"]

    # Read & resample using librosa from original cache path (handles various formats)
    try:
        if path and os.path.exists(path):
            y, sr = librosa.load(path, sr=SR, mono=True)
        else:
            # very rare fallback: skip if no path
            continue
    except Exception:
        # corrupted sample -> skip
        continue

    dur = seconds(len(y), SR)
    if dur < MIN_DUR or dur > MAX_DUR:
        continue

    # Write out
    out_dir = WAV_DIR / spk
    out_dir.mkdir(parents=True, exist_ok=True)
    fname = f"{spk}_{i:07d}.wav"
    out_path = out_dir / fname
    sf.write(out_path, y.astype(np.float32), SR, subtype="PCM_16")

    rows.append({
        "path": out_path.as_posix(),
        "duration": float(dur),
        "text": text,
        "speaker": spk,
        "split": split,
        "sr": SR
    })

manifest = pd.DataFrame(rows)
for split in ["train","valid","test"]:
    manifest[manifest.split==split].to_csv(MAN_DIR / f"cv_ar16k_{split}.csv", index=False)

# Report
def h(sec): return round(sec/3600.0, 2)
hrs = manifest.groupby("split")["duration"].sum().apply(h).to_dict()
spk_ct = manifest.groupby("split")["speaker"].nunique().to_dict()
print("Hours by split:", hrs)
print("Speakers by split:", spk_ct)
print("Wrote manifests:", [str((MAN_DIR / f'cv_ar16k_{s}.csv').as_posix()) for s in ['train','valid','test']])
