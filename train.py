from bert import SpectrogramBERTClassifier
from data import TrainWindowDataset, FullClipDataset
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import DataLoader
from sklearn.model_selection import train_test_split
from tqdm import tqdm
import torch.nn.functional as F
import argparse
import pandas as pd
import matplotlib.pyplot as plt
import time


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



def train():
    parser = argparse.ArgumentParser(description='Train SpectrogramBERT with sliding windows')
    parser.add_argument('--data_csv', type=str, required=True)
    parser.add_argument('--batch_size', type=int, default=16)
    parser.add_argument('--num_epochs', type=int, default=10)
    parser.add_argument('--learning_rate', type=float, default=2e-4)
    parser.add_argument('--n_mels', type=int, default=80)
    parser.add_argument('--patch_size', type=int, default=1)
    parser.add_argument('--window_T', type=int, default=128)
    parser.add_argument('--hop_T', type=int, default=64)
    args = parser.parse_args()

    df = pd.read_csv(args.data_csv)
    train_df, val_df = train_test_split(df, test_size=0.2, stratify=df.iloc[:, 0], random_state=42)

    train_dataset = TrainWindowDataset(train_df, n_mels=args.n_mels, window_T=args.window_T)
    val_dataset = FullClipDataset(val_df, n_mels=args.n_mels)

    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True)
    val_loader = DataLoader(val_dataset, batch_size=1, shuffle=False)

    model = SpectrogramBERTClassifier(
        n_mels=args.n_mels,
        num_classes=2,
        patch_size=args.patch_size,
        max_positions=2048
    )
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    model.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer = optim.AdamW(model.parameters(), lr=args.learning_rate, weight_decay=1e-2)
    best_val_loss = float('inf')

    train_losses = []
    val_losses = []

    for epoch in range(1, args.num_epochs + 1):
        model.train()
        total_loss = 0.0
        for X, y, g in tqdm(train_loader, desc=f"Epoch {epoch}/{args.num_epochs} [train]"):
            X, y = X.to(device), y.to(device)
            g = g.to(device).view(-1, 1)
            lengths = torch.full((X.size(0),), X.size(-1), dtype=torch.long, device=device)

            optimizer.zero_grad(set_to_none=True)
            logits = model(X, lengths=lengths, gender=g)
            loss = criterion(logits, y)
            loss.backward()
            optimizer.step()
            total_loss += loss.item() * X.size(0)

        train_loss = total_loss / len(train_loader.dataset)

        model.eval()
        val_loss, correct, total = 0.0, 0, 0
        with torch.no_grad():
            for mel, y, g, _ in tqdm(val_loader, desc=f"Epoch {epoch}/{args.num_epochs} [val]"):
                mel = mel[0]
                y, g = int(y.item()), float(g.item())
                pred, clip_loss, _ = classify_long_clip(
                    model, mel, g, args.window_T, args.hop_T, device, criterion, y
                )
                val_loss += clip_loss
                correct  += int(pred == y)
                total    += 1
        val_loss /= max(1, total)
        val_acc  = correct / max(1, total)
        print(f"Epoch {epoch}: TrainLoss={train_loss:.4f} | ValLoss={val_loss:.4f} | ValAcc={val_acc:.4f}")
        # torch.save(model.state_dict(), f"models/model_epoch{epoch}_val_loss_{val_loss:.4f}.pt")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), f"runs/{int(time.time())}/best_model.pt")
            print(f"  Saved best model with val_loss {best_val_loss:.4f}")

        train_losses.append(train_loss)
        val_losses.append(val_loss)

        plt.figure(figsize=(10, 5))
        plt.plot(range(1, len(train_losses) + 1), train_losses, label='Train Loss')
        plt.plot(range(1, len(val_losses) + 1), val_losses, label='Validation Loss')
        plt.xlabel('Epoch')
        plt.ylabel('Loss')
        plt.title('Training and Validation Loss over Epochs')
        plt.savefig(f'runs/{int(time.time())}/loss_curve.png')
        plt.close()


if __name__ == "__main__":
    train()
