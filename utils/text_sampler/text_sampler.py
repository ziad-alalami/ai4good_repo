import json
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Dict
from random import randint

load_dotenv(override= True)
text_path = Path(os.environ.get("USER_TEXT_FILE", "./data/background/user_text.json"))
text_json = json.loads(text_path.read_text(encoding="utf-8"))


def sample_text_phoneme(lang: str) -> Dict[str, str]:

    if lang not in ["en", "ar"]:
        return {"data": f"LANGUAGE {lang} NOT SUPPORTED. CHOOSE BETWEEN en AND ar"}
    

    if lang == "en":
        sentences = text_json["english_sentences"]
        rand_key = str(randint(1, len(sentences.keys())))
        return {"data": sentences[rand_key]}
    
    sentences = text_json["arabic_sentences"]
    rand_key = str(randint(1, len(sentences.keys())))
    return {"data": sentences[rand_key]}
