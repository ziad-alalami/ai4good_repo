from torch.utils.data import Dataset
import torch
import librosa
import numpy as np
import torch.nn.functional as F
import random


SR = 16000
N_FFT = 1024
HOP = 256
FMIN = 20.0
def FMAX(sr): return 0.45 * sr  # headroom under Nyquist to avoid empty filters

def load_mel(wav_file, n_mels):
    y, sr = librosa.load(wav_file, sr=SR)  # resample consistently to 16k
    if len(y) < N_FFT:                      # avoid "n_fft too large" warnings
        y = np.pad(y, (0, N_FFT - len(y)))

    mel = librosa.feature.melspectrogram(
        y=y, sr=sr,
        n_mels=n_mels,
        n_fft=N_FFT,
        hop_length=HOP,
        win_length=N_FFT,
        window="hann",
        center=True,
        fmin=FMIN,
        fmax=FMAX(sr),
        power=2.0,
    )
    mel_db = librosa.power_to_db(mel, ref=np.max).astype(np.float32)

    # per-utterance normalize (stabilizes training a lot)
    mel_db = (mel_db - mel_db.mean()) / (mel_db.std() + 1e-6)
    return torch.from_numpy(mel_db)  # [n_mels, T]


def random_crop_or_pad(mel, window_T):
    """Random crop or right-pad to a fixed number of frames (window_T)."""
    T = mel.shape[-1]
    if T == window_T:
        return mel
    if T < window_T:
        return F.pad(mel, (0, window_T - T))
    start = random.randint(0, T - window_T)
    return mel[:, start:start + window_T]


class TrainWindowDataset(Dataset):
    """Outputs fixed-size windows (random crop or pad)."""
    def __init__(self, df, n_mels=80, window_T=1024):
        self.df = df.reset_index(drop=True)
        self.n_mels = n_mels
        self.window_T = window_T

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        label_str, gender_str, wav_file = row.iloc[0], row.iloc[1], row.iloc[2]

        label = 0 if label_str == 'non_dysarthria' else 1
        gender = 0.0 if gender_str == 'female' else 1.0

        mel = load_mel(wav_file, self.n_mels)
        mel = random_crop_or_pad(mel, self.window_T)
        return mel, int(label), float(gender)


class FullClipDataset(Dataset):
    """Emits full mel spectrograms (variable length) for eval/inference."""
    def __init__(self, df, n_mels=80):
        self.df = df.reset_index(drop=True)
        self.n_mels = n_mels

    def __len__(self):
        return len(self.df)

    def __getitem__(self, idx):
        row = self.df.iloc[idx]
        label_str, gender_str, wav_file = row.iloc[0], row.iloc[1], row.iloc[2]

        label = 0 if label_str == 'non_dysarthria' else 1
        gender = 0.0 if gender_str == 'female' else 1.0

        mel = load_mel(wav_file, self.n_mels)
        return mel, int(label), float(gender), wav_file
