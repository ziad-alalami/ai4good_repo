import requests
import json
import os
from dotenv import load_dotenv
from pathlib import Path

if __name__ == "__main__":

    load_dotenv(override= True)

    url = "http://127.0.0.1:5000/"  
    params = {"lang": "en"}

    wav_path = Path(os.environ.get("WAV_STORAGE_DIR", "./data/audio/")) / "1.wav"
    response_path = Path(os.environ.get("BACKGROUND_ANSWER_STORAGE_DIR", "./data/background/user_responses/")) / "1.json"
    # data to send

    r = requests.get(url + "request_text", params= params)
    print(r.json())
    text = r.json().get("data").get("text")
    phonemes = r.json().get("data").get("phonemes")

    print(response_path.read_text(encoding= "utf-8"))
    response_data = {
        "data": json.loads(response_path.read_text(encoding= "utf-8")),
        "text": text,
        "phonemes": phonemes
    }

    # prepare multipart/form-data
    files = {
        "audio_file": open(wav_path, "rb")
    }
    # server expects form field named 'data' in upload()
    form_data = {
        "data": json.dumps(response_data)
    }

    # make the request
    res = requests.post(url + "upload", params=params, files=files, data=form_data)

    # print the response
    print("Status:", res.status_code)
    try:
        print("Response:", json.dumps(res.json(), indent= 4))
    except Exception:
        # print raw text to help debug non-JSON responses (404 pages, HTML errors, etc.)
        print("Response text:", res.text)