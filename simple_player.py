#!/usr/bin/env python3
"""
Simple Audio Player
==================

A lightweight script to play random audio samples from the Arabic datasets.
This version uses the existing imports from the other scripts in the workspace.

Usage:
    python simple_player.py
"""

import os
import random
import pandas as pd
import soundfile as sf
from pathlib import Path
import numpy as np

# Try to import sounddevice for audio playback
try:
    import sounddevice as sd
    AUDIO_PLAYBACK_AVAILABLE = True
except ImportError:
    print("⚠️  sounddevice not available. Audio playback disabled.")
    print("   Install with: pip install sounddevice")
    AUDIO_PLAYBACK_AVAILABLE = False

def find_audio_files():
    """Find all available audio files in the workspace"""
    workspace_root = Path(__file__).parent
    audio_files = []
    
    # Search for WAV files in the data directory
    data_dir = workspace_root / "data"
    if data_dir.exists():
        wav_files = list(data_dir.rglob("*.wav"))
        audio_files.extend(wav_files)
    
    return audio_files

def load_manifest_data():
    """Load data from CSV manifests"""
    workspace_root = Path(__file__).parent
    manifests = []
    
    # Look for CSV files in manifests directories
    for csv_file in workspace_root.rglob("*.csv"):
        if "manifest" in str(csv_file).lower():
            try:
                df = pd.read_csv(csv_file)
                # Add source file info
                df['manifest_file'] = csv_file.name
                df['manifest_path'] = str(csv_file)
                manifests.append(df)
                print(f"📄 Loaded manifest: {csv_file.name} ({len(df)} samples)")
            except Exception as e:
                print(f"⚠️  Could not read {csv_file}: {e}")
    
    if manifests:
        return pd.concat(manifests, ignore_index=True)
    else:
        return pd.DataFrame()

def get_sample_info(file_path):
    """Get information about an audio sample"""
    try:
        # Get basic file info
        file_path = Path(file_path)
        
        # Try to read audio to get duration and sample rate
        try:
            data, sr = sf.read(str(file_path))
            duration = len(data) / sr
            shape = data.shape
        except Exception:
            duration = "Unknown"
            sr = "Unknown"
            shape = "Unknown"
        
        return {
            'file': file_path.name,
            'path': str(file_path),
            'duration': duration,
            'sample_rate': sr,
            'shape': shape,
            'size_mb': file_path.stat().st_size / (1024 * 1024) if file_path.exists() else 0
        }
    except Exception as e:
        return {'file': str(file_path), 'error': str(e)}

def play_audio(file_path):
    """Play an audio file"""
    if not AUDIO_PLAYBACK_AVAILABLE:
        print("❌ Audio playback not available. Please install sounddevice:")
        print("   pip install sounddevice")
        return False
    
    try:
        print(f"🎵 Loading audio file: {Path(file_path).name}")
        
        # Read the audio file
        data, sr = sf.read(str(file_path))
        
        print(f"▶️  Playing audio (Duration: {len(data)/sr:.2f}s, SR: {sr}Hz)")
        print("   Press Ctrl+C to stop playback early...")
        
        # Play the audio
        sd.play(data, samplerate=sr)
        sd.wait()  # Wait until the audio finishes playing
        
        print("✅ Playback finished!")
        return True
        
    except KeyboardInterrupt:
        print("\n⏹️  Playback stopped by user")
        sd.stop()
        return False
    except Exception as e:
        print(f"❌ Error playing audio: {e}")
        return False

def main():
    """Main function"""
    print("🎵 Simple Arabic Audio Player")
    print("=" * 40)
    
    # Find audio files
    print("🔍 Searching for audio files...")
    audio_files = find_audio_files()
    
    if not audio_files:
        print("❌ No audio files found in the workspace!")
        return
    
    print(f"✅ Found {len(audio_files)} audio files")
    
    # Load manifest data (if available)
    print("\n📚 Loading manifest data...")
    manifest_df = load_manifest_data()
    
    # Select a random audio file
    random_file = random.choice(audio_files)
    print(f"\n🎲 Selected random file: {random_file.name}")
    
    # Get sample information
    print("\n📊 Sample Information:")
    print("-" * 30)
    sample_info = get_sample_info(random_file)
    
    for key, value in sample_info.items():
        if key != 'path':  # Don't print the full path twice
            print(f"   {key}: {value}")
    
    # Try to find matching info in manifest
    if not manifest_df.empty and 'path' in manifest_df.columns:
        # Look for this file in the manifests
        file_matches = manifest_df[manifest_df['path'].str.contains(random_file.stem, na=False)]
        if not file_matches.empty:
            match = file_matches.iloc[0]
            print(f"\n📝 Manifest Information:")
            print("-" * 30)
            for col in ['text', 'speaker', 'duration', 'split']:
                if col in match:
                    print(f"   {col}: {match[col]}")
    
    # Play the audio
    print("\n" + "=" * 40)
    if AUDIO_PLAYBACK_AVAILABLE:
        try:
            play_audio(random_file)
        except KeyboardInterrupt:
            print("\n👋 Goodbye!")
    else:
        print("🔇 Audio playback not available.")
        print(f"   You can manually play: {random_file}")

if __name__ == "__main__":
    main()