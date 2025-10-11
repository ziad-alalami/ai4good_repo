from dotenv import load_dotenv
import os
from pathlib import Path
from typing import List
import wave
#from utils.phonemes.text_to_phoneme import get_phonemes, Language

load_dotenv(override= True)
BUFFER_TIME = float(os.environ.get("SPEECH_BUFFER_TIME", 2))


def get_wav_duration(file_path):
    """
    Calculates the duration of a WAV file in seconds.

    Args:
        file_path (str): The path to the WAV file.

    Returns:
        float: The duration of the WAV file in seconds.
    """
    try:
        with wave.open(file_path, 'rb') as wav_file:
            frames = wav_file.getnframes()
            rate = wav_file.getframerate()
            duration = frames / float(rate)
            return duration
    except wave.Error as e:
        print(f"Error opening or reading WAV file: {e}")
        return None


def get_speech_rate(wav_file_path : str, text : str) -> float:

    text_count = len(text.split(" ")) if text is not None else 0

    if text_count == 0:
        return 0
    
    wav_file = Path(wav_file_path)

    if wav_file.exists():
        wav_time_duration = get_wav_duration(wav_file_path)

        if wav_time_duration is None:
            return 0
        
        return text_count / wav_time_duration * 60
    return 0

def get_phoneme_rate(wav_file_path: str, phonemes: List) -> float:

    if len(phonemes) == 0:
        return 0
    
    wav_file = Path(wav_file_path)

    if wav_file.exists():
        wav_time_duration = get_wav_duration(wav_file_path)

        if wav_time_duration is None:
            return 0
        
        return len(phonemes) / wav_time_duration * 60
    
    return 0


if __name__ == "__main__":
    pass
    # wav_file = str(Path(os.environ.get("WAV_STORAGE_DIR", "./data/audio/")) / "1.wav")
    # text = "I love eating apples and bananas"
    # phonemes = get_phonemes(text= text, language= Language.english)
    # print(f"WAV Duration: {get_wav_duration(wav_file)}")
    # print(f"Speech Rate: {get_speech_rate(wav_file, text)}")
    # print(f"Phoneme Rate: {get_phoneme_rate(wav_file, phonemes)}") # type: ignore