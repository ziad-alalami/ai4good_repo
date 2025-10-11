import torch
import torch.nn as nn
import torch.nn.functional as F
from transformers import BertModel, BertConfig


class SpectrogramBERTClassifier(nn.Module):
    def __init__(
        self,
        n_mels=80,
        num_classes=2,
        hidden_size=384,
        num_layers=6,
        num_heads=6,
        patch_size=4,
        dropout=0.1,
        max_positions=2048
    ):
        super().__init__()
        self.n_mels = n_mels
        self.patch_size = patch_size

        self.input_proj = nn.Linear(n_mels * patch_size, hidden_size)

        config = BertConfig(
            hidden_size=hidden_size,
            num_hidden_layers=num_layers,
            num_attention_heads=num_heads,
            intermediate_size=hidden_size * 4,
            max_position_embeddings=max_positions + 1,
            hidden_dropout_prob=dropout,
            attention_probs_dropout_prob=dropout,
            add_pooling_layer=True
        )
        self.bert = BertModel(config)
        self.cls = nn.Parameter(torch.randn(1, 1, hidden_size) * 0.02)

        self.classifier = nn.Sequential(
            nn.LayerNorm(hidden_size + 1),
            nn.Dropout(dropout),
            nn.Linear(hidden_size + 1, num_classes)
        )

    def _time_patch(self, mel):
        B, M, T = mel.shape
        assert M == self.n_mels, f"Expected {self.n_mels}, got {M}"
        if T < self.patch_size:
            mel = F.pad(mel, (0, self.patch_size - T))
            T = self.patch_size
        T_prime = T // self.patch_size
        T_use = T_prime * self.patch_size
        mel = mel[:, :, :T_use]
        mel = mel.unfold(2, self.patch_size, self.patch_size)
        mel = mel.permute(0, 2, 1, 3).contiguous().view(B, T_prime, M * self.patch_size)
        return mel

    def forward(self, mel, lengths=None, gender=None):
        device = mel.device
        tokens = self._time_patch(mel)
        tokens = self.input_proj(tokens)

        B, Tprime, H = tokens.shape
        cls = self.cls.expand(B, 1, H)
        tokens = torch.cat([cls, tokens], dim=1)

        attention_mask = None
        if lengths is not None:
            patched_len = (lengths // self.patch_size) + 1
            max_len = tokens.size(1)
            patched_len = torch.clamp(patched_len, 1, max_len)
            attention_mask = torch.zeros(B, max_len, dtype=torch.long, device=device)
            for i, L in enumerate(patched_len):
                attention_mask[i, : int(L.item())] = 1

        out = self.bert(inputs_embeds=tokens, attention_mask=attention_mask)
        pooled = out.pooler_output

        if gender is None:
            raise ValueError("gender tensor required")
        if gender.dim() == 1:
            gender = gender.unsqueeze(1)
        gender = gender.to(pooled.device, dtype=pooled.dtype)
        pooled = torch.cat([pooled, gender], dim=1)
        logits = self.classifier(pooled)
        return logits
