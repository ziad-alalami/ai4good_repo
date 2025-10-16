import json
import os
from dotenv import load_dotenv
from pathlib import Path
from typing import Dict
from random import randint

load_dotenv(override= True)
text_path = Path(os.environ.get("USER_TEXT_FILE", "./data/text/user_text.json"))
text_json = json.loads(text_path.read_text(encoding="utf-8"))
NO_SENTENCES = int(os.environ.get("NO_SENTENCES", 4))

def sample_text_phoneme(lang: str) -> Dict[str, str]:

    if lang not in ["en", "ar"]:
        return {"data": f"LANGUAGE {lang} NOT SUPPORTED. CHOOSE BETWEEN en AND ar"}
    

    if lang == "en":
        
        sentences = text_json["english_sentences"]
        rand_key = str(randint(1, len(sentences.keys())))
        init_sentence = sentences[rand_key]
        for i in range(NO_SENTENCES - 1):
            sentences = text_json["english_sentences"]
            rand_key = str(randint(1, len(sentences.keys())))
            init_sentence['text'] +=  '. ' + sentences[rand_key]['text']
            init_sentence['phonemes'] += '. ' + sentences[rand_key]['phonemes']
    
        return {"data": init_sentence}
    
    sentences = text_json["arabic_sentences"]
    rand_key = str(randint(1, len(sentences.keys())))
    init_sentence = sentences[rand_key]
    for i in range(NO_SENTENCES - 1):
        sentences = text_json["arabic_sentences"]
        rand_key = str(randint(1, len(sentences.keys())))
        init_sentence['text'] +=  sentences[rand_key]['text']
        init_sentence['phonemes'] += sentences[rand_key]['phonemes']

    return {"data": init_sentence}
