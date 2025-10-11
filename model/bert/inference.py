from .bert import SpectrogramBERTClassifier
import torch
import numpy as np
import librosa
import os
from dotenv import load_dotenv


class Classifier:
    def __init__(self, model_path):
        self.model = load_model(model_path)
    
    def predict(self, wav_file, gender):
        self.model.eval()
        y, sr = librosa.load(wav_file, sr=None)
        mel_spectrogram = librosa.feature.melspectrogram(y=y, sr=sr, n_mels=80)
        mel_spectrogram_db = librosa.power_to_db(mel_spectrogram, ref=np.max)
        mel_spectrogram_db = np.expand_dims(mel_spectrogram_db, axis=0)  # Add channel dimension
        mel_spectrogram_tensor = torch.tensor(mel_spectrogram_db, dtype=torch.float32).unsqueeze(0)  # [1, 1, n_mels, T]
        gender_tensor = torch.tensor([gender], dtype=torch.float32)  # [1]
        with torch.no_grad():
            logits = self.model(mel_spectrogram_tensor, gender=gender_tensor)
        predicted_class = torch.argmax(logits, dim=1).item()
        return predicted_class

def load_model(model_path, n_mels=80, num_classes=1):
    model = SpectrogramBERTClassifier(n_mels=n_mels, num_classes=num_classes)
    model.load_state_dict(torch.load(model_path, map_location=torch.device('cpu')))
    model.eval()
    return model


load_dotenv(override= True)
model_path = os.environ.get("BERT_MODEL_FILE", "./data/models/best_model.pt")
classifier = Classifier(model_path)

def predict(wav_path: str , gender: str) -> float:

    is_male = int(gender.lower() in ('male', 'm','ذكر'))
    return classifier.predict(wav_file= wav_path, gender= is_male)