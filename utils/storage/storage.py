from pathlib import Path
from dotenv import load_dotenv
import os
import json
from typing import Dict, List
from werkzeug.datastructures import FileStorage 
from uuid import UUID, uuid4


load_dotenv(override= True)

audio_path = Path(os.environ.get("WAV_STORAGE_DIR", "./data/audio"))
data_path = Path(os.environ.get("BACKGROUND_ANSWER_STORAGE_DIR", "./data/background/user_responses"))
convo_path = Path(os.environ.get("AGENT_CONVO_DIR", "./data/agent_convo"))

audio_path.mkdir(parents=True, exist_ok=True)
data_path.mkdir(parents=True, exist_ok=True)
convo_path.mkdir(parents=True, exist_ok=True)

def save_audio(uuid: UUID, audio_wav: FileStorage) -> bool:

    try:
        audio_file = audio_path / f"{uuid}.wav"
        audio_file.write_bytes(audio_wav.read())
        audio_wav.seek(0)
        return True
    
    except Exception as e:
        print(f"Exception in saving audio file: {e}")
        return False
    
def save_data(uuid: UUID, data: Dict[str, str]) -> bool:

    try:

        data_file = data_path / f"{str(uuid)}.json"
        data_file.write_text(json.dumps(data, indent= 4), encoding= "utf-8")
        return True
    
    except Exception as e:
        print(f"Exception in saving response data JSON: {e}")
        return False
    
def get_audio_path(uuid: UUID) -> str:

    return str(audio_path / f"{str(uuid)}.wav")

def get_data_path(uuid: UUID) -> str:

    return str(data_path / f"{str(uuid)}.json")

def get_data(uuid: UUID) -> Dict[str, str]:

    file = data_path / f"{str(uuid)}.json"
    return json.loads(file.read_text(encoding= "utf-8"))


def store_response(uuid: UUID, is_agent: bool, response: Dict[str, List] | str) -> bool:

    try:
        file = convo_path / f"{str(uuid)}.json"

        if file.exists():
            convo = json.loads(file.read_text())
        
        else:
            convo = []
        
        message = None
        if is_agent:
            message = {"agent": response}
        
        else:
            message = {"user": response}
        convo.append(message)

        file.write_text(json.dumps(convo, indent= 4), encoding="utf-8")

        return True
    
    except Exception as e:
        print(f"Error while storing message in convo file: {e}")
        return False
    
def get_chat(uuid: UUID) -> List[Dict]:

    file = convo_path / f"{str(uuid)}.json"

    if not file.exists():
        return [{}]
    
    return json.loads(file.read_text())
    





if __name__ == "__main__":

    print(uuid4())
    print(type(uuid4()))


