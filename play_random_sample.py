#!/usr/bin/env python3
"""
Audio Sample Player
==================

This script explores the Arabic audio dataset and plays a random sample.
It supports both the main cv_ar_16k dataset and the dysarthric cls_ar_dys dataset.

Dependencies:
- pandas: for reading CSV manifests
- soundfile: for reading audio files
- sounddevice: for playing audio
- pathlib: for path handling
- random: for random selection

Usage:
    python play_random_sample.py
"""

import os
import random
import pandas as pd
import soundfile as sf
import sounddevice as sd
from pathlib import Path
import time
import argparse
from typing import Optional, Tuple

# Configuration
WORKSPACE_ROOT = Path(__file__).parent
DATA_DIR = WORKSPACE_ROOT / "data"
CV_AR_16K_DIR = DATA_DIR / "cv_ar_16k"
CLS_AR_DYS_DIR = DATA_DIR / "cls_ar_dys"

# Available datasets
DATASETS = {
    "cv_ar_16k": {
        "path": CV_AR_16K_DIR,
        "manifests": ["cv_ar16k_train.csv", "cv_ar16k_test.csv", "cv_ar16k_valid.csv"],
        "description": "Common Voice Arabic 16kHz dataset"
    },
    "cls_ar_dys": {
        "path": CLS_AR_DYS_DIR,
        "manifests": ["cv_ar16k_train_cls.csv", "cv_ar16k_test_cls.csv", "cv_ar16k_valid_cls.csv"],
        "description": "Arabic Dysarthric Classification dataset"
    }
}

def explore_dataset_structure():
    """Explore and print the dataset structure"""
    print("🔍 Exploring Dataset Structure")
    print("=" * 50)
    
    for dataset_name, dataset_info in DATASETS.items():
        print(f"\n📁 {dataset_name.upper()}: {dataset_info['description']}")
        dataset_path = dataset_info["path"]
        
        if not dataset_path.exists():
            print(f"   ❌ Directory not found: {dataset_path}")
            continue
            
        # Check manifests
        manifests_dir = dataset_path / "manifests"
        if manifests_dir.exists():
            print(f"   📄 Manifests found:")
            for manifest in dataset_info["manifests"]:
                manifest_path = manifests_dir / manifest
                if manifest_path.exists():
                    # Count lines (samples)
                    try:
                        df = pd.read_csv(manifest_path)
                        print(f"      • {manifest}: {len(df)} samples")
                    except Exception as e:
                        print(f"      • {manifest}: Error reading - {e}")
                else:
                    print(f"      • {manifest}: Not found")
        
        # Check wavs directory
        wavs_dir = dataset_path / "wavs"
        if wavs_dir.exists():
            # Count subdirectories and files
            subdirs = [p for p in wavs_dir.iterdir() if p.is_dir()]
            wav_files = list(wavs_dir.rglob("*.wav"))
            print(f"   🎵 Audio files: {len(wav_files)} WAV files in {len(subdirs)} subdirectories")
        else:
            print(f"   ❌ No wavs directory found")

def load_available_samples() -> pd.DataFrame:
    """Load all available audio samples from manifest files"""
    all_samples = []
    
    for dataset_name, dataset_info in DATASETS.items():
        dataset_path = dataset_info["path"]
        manifests_dir = dataset_path / "manifests"
        
        if not manifests_dir.exists():
            continue
            
        for manifest_file in dataset_info["manifests"]:
            manifest_path = manifests_dir / manifest_file
            
            if not manifest_path.exists():
                continue
                
            try:
                df = pd.read_csv(manifest_path)
                # Add dataset info
                df['dataset'] = dataset_name
                df['manifest'] = manifest_file
                # Convert relative paths to absolute paths
                df['full_path'] = df['path'].apply(lambda x: WORKSPACE_ROOT / x)
                all_samples.append(df)
            except Exception as e:
                print(f"⚠️  Error reading {manifest_path}: {e}")
                continue
    
    if not all_samples:
        return pd.DataFrame()
    
    return pd.concat(all_samples, ignore_index=True)

def get_random_sample(samples_df: pd.DataFrame) -> Optional[Tuple[str, dict]]:
    """Get a random sample from the dataset"""
    if samples_df.empty:
        return None
    
    # Filter to only existing files
    existing_samples = samples_df[samples_df['full_path'].apply(lambda x: Path(x).exists())]
    
    if existing_samples.empty:
        print("❌ No audio files found on disk!")
        return None
    
    # Select random sample
    sample = existing_samples.sample(n=1).iloc[0]
    
    return str(sample['full_path']), sample.to_dict()

def play_audio_file(file_path: str, info: dict):
    """Play an audio file and display information"""
    try:
        # Read audio file
        audio_data, sample_rate = sf.read(file_path)
        
        print(f"\n🎵 Playing Random Audio Sample")
        print("=" * 50)
        print(f"📁 Dataset: {info['dataset']}")
        print(f"📄 Manifest: {info['manifest']}")
        print(f"🎤 Speaker: {info.get('speaker', 'Unknown')}")
        print(f"⏱️  Duration: {info.get('duration', 'Unknown')} seconds")
        print(f"📝 Text: {info.get('text', 'No text available')}")
        print(f"🔊 Sample Rate: {sample_rate} Hz")
        print(f"📊 Shape: {audio_data.shape}")
        print(f"📂 File: {Path(file_path).name}")
        print("-" * 50)
        
        # Play audio
        print("▶️  Playing audio... (Press Ctrl+C to stop)")
        sd.play(audio_data, samplerate=sample_rate)
        
        # Wait for playback to finish
        duration = len(audio_data) / sample_rate
        time.sleep(duration + 0.5)  # Add small buffer
        
        print("✅ Playback finished!")
        
    except Exception as e:
        print(f"❌ Error playing audio: {e}")

def main():
    """Main function"""
    parser = argparse.ArgumentParser(description="Play random audio samples from Arabic datasets")
    parser.add_argument("--explore", action="store_true", help="Explore dataset structure only")
    parser.add_argument("--dataset", choices=list(DATASETS.keys()), 
                       help="Specify which dataset to use")
    args = parser.parse_args()
    
    print("🎵 Arabic Audio Dataset Explorer & Player")
    print("=" * 50)
    
    # Explore dataset structure
    explore_dataset_structure()
    
    if args.explore:
        return
    
    # Load samples
    print(f"\n📚 Loading audio samples...")
    samples_df = load_available_samples()
    
    if samples_df.empty:
        print("❌ No audio samples found in any dataset!")
        return
    
    # Filter by dataset if specified
    if args.dataset:
        samples_df = samples_df[samples_df['dataset'] == args.dataset]
        if samples_df.empty:
            print(f"❌ No samples found in dataset: {args.dataset}")
            return
    
    print(f"✅ Found {len(samples_df)} total audio samples")
    
    # Get and play random sample
    result = get_random_sample(samples_df)
    if result is None:
        print("❌ No playable audio files found!")
        return
    
    file_path, info = result
    play_audio_file(file_path, info)

if __name__ == "__main__":
    main()