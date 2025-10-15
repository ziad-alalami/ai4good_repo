from model.bert.bert import SpectrogramBERTClassifier
import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
import librosa


SR = 16000
N_FFT = 1024
HOP = 256
FMIN = 20.0
def FMAX(sr): return 0.45 * sr  # headroom under Nyquist to avoid empty filters

def load_mel_for_inference(wav_file, n_mels=80):
    y, sr = librosa.load(wav_file, sr=SR)
    if len(y) < N_FFT:
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
    mel_db = (mel_db - mel_db.mean()) / (mel_db.std() + 1e-6)
    return torch.from_numpy(mel_db)  # [n_mels, T]


def slide_windows(mel, window_T, hop_T):
    n_mels, T = mel.shape
    if T <= window_T:
        return [mel.unsqueeze(0) if T == window_T else F.pad(mel, (0, window_T - T)).unsqueeze(0)]
    windows = []
    for start in range(0, T, hop_T):
        end = min(start + window_T, T)
        chunk = mel[:, start:end]
        if chunk.shape[-1] < window_T:
            chunk = F.pad(chunk, (0, window_T - chunk.shape[-1]))
        windows.append(chunk.unsqueeze(0))
        if end == T:
            break
    return windows


@torch.no_grad()
def classify_long_clip(model, mel, gender, window_T, hop_T, device, criterion=None, y=None):
    windows = slide_windows(mel, window_T, hop_T)
    probs_list, losses = [], []
    g = torch.tensor([[gender]], dtype=torch.float32, device=device)
    for w in windows:
        X = w.to(device)                                   # [1, n_mels, window_T]
        lengths = torch.tensor([X.shape[-1]], device=device)
        logits = model(X, lengths=lengths, gender=g)       # [1, 2]
        probs = torch.softmax(logits, dim=-1)              # [1, 2]
        probs_list.append(probs)
        if criterion is not None and y is not None:
            losses.append(criterion(logits, torch.tensor([y], device=device)))
    mean_probs = torch.stack(probs_list).mean(0)           # [1, 2]
    mean_loss  = torch.stack(losses).mean().item() if losses else None
    pred = mean_probs.argmax(dim=1).item()
    return pred, mean_loss, mean_probs


class Classifier:
    """
    Example:
        classifier = Classifier("./model/bert/runs/123456/best_model.pt")
        pred = classifier.predict("clip.wav", gender="male")
    """
    def __init__(self, model_path, n_mels=80, window_T=128, hop_T=64):
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
        self.model = load_model(model_path, n_mels=n_mels, num_classes=2).to(self.device)
        self.n_mels = n_mels
        self.window_T = window_T
        self.hop_T = hop_T

    def predict(self, wav_file, gender):
        mel = load_mel_for_inference(wav_file, n_mels=self.n_mels)  # [M, T]
        gender_value = 1.0 if str(gender).lower() in ('male', 'm', 'ذكر') else 0.0

        pred, _, probs = classify_long_clip(
            self.model, mel, gender_value,
            window_T=self.window_T, hop_T=self.hop_T,
            device=self.device
        )
        return float(pred), probs.cpu().numpy().tolist()[0][1] # return prob of class 1 (dysarthria)


def load_model(model_path, n_mels=80, num_classes=2):
    model = SpectrogramBERTClassifier(n_mels=n_mels, num_classes=num_classes)
    state = torch.load(model_path, map_location=torch.device('cpu'))
    model.load_state_dict(state)
    model.eval()
    return model
