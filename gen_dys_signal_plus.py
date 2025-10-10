import os, argparse, random, hashlib
from pathlib import Path
import numpy as np
import pandas as pd
import soundfile as sf
from tqdm import tqdm

# Core audio libs
import torch
import torchaudio

# For speed/tempo + pitch jitter
try:
    import librosa
except Exception:
    librosa = None

SR = 16000
SEED = 13
random.seed(SEED); np.random.seed(SEED); torch.manual_seed(SEED)

# ---- Dysarthria severities from the paper (Table 2) ---- :contentReference[oaicite:1]{index=1}
SEVERITIES = {
    "S1": {"R1": 1.2, "R2": 0.8},
    "S2": {"R1": 1.4, "R2": 0.8},
    "S3": {"R1": 1.8, "R2": 0.4},
    "S4": {"R1": 2.0, "R2": 0.4},
}
SEV_WEIGHTS = {"S1": 0.35, "S2": 0.30, "S3": 0.20, "S4": 0.15}

def choose_severity():
    labs = list(SEVERITIES.keys())
    w = [SEV_WEIGHTS[s] for s in labs]
    return random.choices(labs, weights=w, k=1)[0]

def ensure_dir(p: Path): p.mkdir(parents=True, exist_ok=True)
def short_hash(s: str, n=10) -> str: return hashlib.md5(s.encode("utf-8")).hexdigest()[:n]

# ---------- Signal stage (paper): speed -> tempo ----------
def librosa_speed_tempo(infile: str, R1: float, R2: float):
    if librosa is None:
        raise RuntimeError("librosa is required for speed/tempo. pip install librosa")
    y, sr = librosa.load(infile, sr=None, mono=True)
    # "speed R1": resample to sr*R1 then back to SR (pitch & spectral change)
    sr_speed = int(round(sr * R1))
    sr_speed = max(8000, min(48000, sr_speed))
    y = librosa.resample(y, orig_sr=sr, target_sr=sr_speed, res_type="kaiser_fast")
    y = librosa.resample(y, orig_sr=sr_speed, target_sr=SR, res_type="kaiser_fast")
    # "tempo R2": time-stretch without pitch change (R2<1 slows down)
    y = librosa.effects.time_stretch(y, rate=R2)
    return y.astype(np.float32)

# ---------- Extra impairments ("plus" mode) ----------
def lowpass_muffle(y: np.ndarray, cutoff=3200.0):
    t = torch.from_numpy(y).unsqueeze(0)
    t = torchaudio.functional.lowpass_biquad(t, SR, cutoff_freq=float(cutoff))
    return t.squeeze(0).numpy()

def add_breathy_noise(y: np.ndarray, snr_db=25.0, hp_cut=3000.0):
    n = np.random.randn(len(y)).astype(np.float32)
    tn = torch.from_numpy(n).unsqueeze(0)
    tn = torchaudio.functional.highpass_biquad(tn, SR, cutoff_freq=float(hp_cut))
    n = tn.squeeze(0).numpy()
    sig_pow = np.mean(y**2) + 1e-9
    noise_target = sig_pow / (10.0**(snr_db/10.0))
    cur_pow = np.mean(n**2) + 1e-9
    n *= np.sqrt(noise_target / cur_pow)
    out = y + n
    mx = float(np.max(np.abs(out))) + 1e-9
    if mx > 0.999: out = out / mx * 0.999
    return out

def insert_micro_pauses(y: np.ndarray, n_pauses=2, dur_ms=(60,120)):
    out = y.copy()
    for _ in range(n_pauses):
        if len(out) < SR: break
        pos = np.random.randint(int(0.1*len(out)), int(0.9*len(out)))
        dur = int(np.random.uniform(dur_ms[0], dur_ms[1]) * SR / 1000.0)
        # 5 ms fade to avoid clicks
        fade = int(0.005 * SR)
        L, R = max(0, pos - fade), min(len(out), pos + fade)
        if R > L:
            w = np.linspace(1, 0, R-L, dtype=np.float32)
            out[L:R] *= w
        out = np.concatenate([out[:pos], np.zeros(dur, dtype=np.float32), out[pos:]], axis=0)
    return out

def pitch_jitter_chunks(y: np.ndarray, chunk_ms=250, semitone=0.35):
    if librosa is None: return y
    L = len(y); chunk = int(chunk_ms * SR / 1000.0)
    if chunk < SR//100: return y
    segs = []
    for s in range(0, L, chunk):
        e = min(L, s+chunk); seg = y[s:e]
        cents = np.random.uniform(-semitone, semitone)
        if abs(cents) > 1e-3 and len(seg) > SR//50:
            try: seg = librosa.effects.pitch_shift(seg, sr=SR, n_steps=cents)
            except Exception: pass
        segs.append(seg.astype(np.float32))
    out = segs[0]; xf = int(0.005 * SR)
    for nxt in segs[1:]:
        k = min(xf, len(out), len(nxt))
        if k > 1:
            fo = np.linspace(1,0,k, dtype=np.float32); fi = 1.0 - fo
            cross = out[-k:]*fo + nxt[:k]*fi
            out = np.concatenate([out[:-k], cross, nxt[k:]], axis=0)
        else:
            out = np.concatenate([out, nxt], axis=0)
    return out

def dys_basic(infile: str, R1: float, R2: float):
    return librosa_speed_tempo(infile, R1, R2)

def dys_plus(infile: str, R1: float, R2: float):
    y = librosa_speed_tempo(infile, R1, R2)
    if np.random.rand() < 0.9:  y = lowpass_muffle(y, cutoff=np.random.uniform(2600,3400))
    if np.random.rand() < 0.7:  y = add_breathy_noise(y, snr_db=np.random.uniform(22,28), hp_cut=np.random.uniform(2500,4000))
    if np.random.rand() < 0.6:  y = insert_micro_pauses(y, n_pauses=np.random.randint(1,4), dur_ms=(60,140))
    if np.random.rand() < 0.6:  y = pitch_jitter_chunks(y, chunk_ms=np.random.randint(180,320), semitone=0.35)
    return y

# ---------- Generation per split ----------
def gen_split(manifest_csv: Path, out_root: Path, balance: float, mode: str):
    df = pd.read_csv(manifest_csv)
    assert {"path","duration","speaker"}.issubset(df.columns), "Manifest must include path,duration,speaker"
    split = manifest_csv.stem.split("_")[-1]  # train/valid/test
    healthy_sec = float(df["duration"].sum())
    target_pos_sec = healthy_sec * float(balance)

    out_wav_dir = out_root / "wavs" / split / "dys"
    out_man_dir = out_root / "manifests"
    ensure_dir(out_wav_dir); ensure_dir(out_man_dir)

    # Shuffle rows so we spread over speakers/content
    df = df.sample(frac=1.0, random_state=SEED).reset_index(drop=True)

    pos_rows, cum_sec, fails = [], 0.0, 0

    for _, r in tqdm(df.iterrows(), total=len(df), desc=f"[{split}] generating ({mode})"):
        if cum_sec >= target_pos_sec: break
        inpath = str(r["path"])
        sev = choose_severity()
        R1, R2 = SEVERITIES[sev]["R1"], SEVERITIES[sev]["R2"]

        try:
            y = dys_basic(inpath, R1, R2) if mode == "basic" else dys_plus(inpath, R1, R2)
        except Exception:
            fails += 1
            continue

        dur = len(y) / SR
        if dur < 0.5:  # discard too short
            continue

        # Short Windows-safe filename
        spk = str(r.get("speaker", "spk"))
        base = Path(inpath).stem
        fname = f"{short_hash(spk,6)}_{short_hash(base,10)}_{sev}.wav"
        outpath = out_wav_dir / fname

        try:
            sf.write(outpath.as_posix(), y, SR, subtype="PCM_16")
        except Exception:
            fails += 1
            continue

        pos_rows.append({
            "path": outpath.as_posix(),
            "duration": float(dur),
            "text": r.get("text",""),
            "speaker": spk,
            "split": split,
            "sr": SR,
            "label": 1,
            "severity": sev,
            "mode": mode,
            "orig_path": inpath
        })
        cum_sec += dur

    pos_df = pd.DataFrame(pos_rows)
    neg_df = df.assign(label=0, severity="NA", mode="healthy")  # keep healthy as negatives
    cls_df = pd.concat([neg_df, pos_df], ignore_index=True).sample(frac=1.0, random_state=SEED).reset_index(drop=True)

    if not pos_df.empty:
        pos_df.to_csv(out_man_dir / f"cv_ar16k_{split}_dys_only.csv", index=False)
    cls_df.to_csv(out_man_dir / f"cv_ar16k_{split}_cls.csv", index=False)

    def h(sec): return round(sec/3600.0, 2)
    pos_sec = float(pos_df["duration"].sum()) if not pos_df.empty else 0.0
    print(f"[{split}] healthy hrs={h(healthy_sec)} | positive hrs={h(pos_sec)} | total cls hrs={h(healthy_sec+pos_sec)} | failures={fails}")
    print("Wrote:", (out_man_dir / f"cv_ar16k_{split}_cls.csv").as_posix())

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--in_dir", type=str, required=True,
                    help="Folder with cv_ar16k_train/valid/test.csv (healthy manifests)")
    ap.add_argument("--out_dir", type=str, default="C:/dys_out",
                    help="Short output root (Windows-safe)")
    ap.add_argument("--balance", type=float, default=1.0,
                    help="Positive hours = balance * healthy hours (per split)")
    ap.add_argument("--mode", choices=["basic","plus"], default="plus",
                    help="basic = speed+tempo; plus = adds muffling/breathy/pauses/pitch jitter")
    args = ap.parse_args()

    in_dir = Path(args.in_dir); out_dir = Path(args.out_dir)
    ensure_dir(out_dir)

    for split in ["train","valid","test"]:
        man = in_dir / f"cv_ar16k_{split}.csv"
        if not man.exists():
            print(f"Missing manifest: {man} (skipping)")
            continue
        gen_split(man, out_dir, balance=args.balance, mode=args.mode)

if __name__ == "__main__":
    main()
