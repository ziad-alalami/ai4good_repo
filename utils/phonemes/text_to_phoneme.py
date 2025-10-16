from phonemizer import phonemize
from enum import Enum
import json
import os
from pathlib import Path
from dotenv import load_dotenv
from phonemizer.backend.espeak.wrapper import EspeakWrapper
from .arabic_phonetiser.phonetise_arabic import phonetise


EspeakWrapper.set_library('C:\Program Files\eSpeak NG\libespeak-ng.dll')



class Language(str, Enum):

    english = "en-us"
    arabic = "ar"

def get_phonemes(text : str , language : Language):

    if language.value == "ar":

        return phonemize(phonetise(text), language= "en-us", backend='espeak', strip=True)


    else:
        return phonemize(text, language= language.value, backend='espeak', strip=True)
    

if __name__ == "__main__":

    load_dotenv(override= True)
    TEXT_FOLDER = Path(os.environ.get("USER_TEXT_FILE", "./data/text/questions.json"))
    text_json = json.loads(TEXT_FOLDER.read_text(encoding= "utf-8"))

    english_sentences = text_json.get("english_sentences")
    arabic_sentences = text_json.get("arabic_sentences")

    for k, v in english_sentences.items():
        english_sentences[k] = {"text": v, "phonemes": get_phonemes(v, language= Language.english)}
    
    for k, v in arabic_sentences.items():
        arabic_sentences[k] = {"text": v, "phonemes": get_phonemes(v, language= Language.arabic)}
    
    print(text_json)
    TEXT_FOLDER.write_text(json.dumps(text_json, indent= 4))



