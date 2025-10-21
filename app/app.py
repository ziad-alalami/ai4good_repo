from flask import Flask, request, jsonify, abort
import json
import os
from dotenv import load_dotenv
from pathlib import Path
from uuid import uuid4, UUID
from flask_cors import CORS
from utils.text_sampler.text_sampler import sample_text_phoneme
from utils.storage.storage import save_data, save_audio, get_audio_path, save_audio_wav
from utils.speech_rate.speech_rate import get_speech_rate, get_phoneme_rate
# from model.bert.inference import predict
from model.agent.main_agent import get_agent_response
from model.agent.chatbot import respond

app = Flask(__name__)
CORS(app)

load_dotenv(override= True)
question_path = Path(os.environ.get("QUESTIONS_PATH", "./data/background/questions.json"))
question_json = json.loads(question_path.read_text(encoding= "utf-8"))


text_path = Path(os.environ.get("USER_TEXT_FILE", "./data/background/questions.json"))
text_json = json.loads(text_path.read_text(encoding="utf-8"))


request_id = len(os.listdir("./data/audio/"))

@app.route("/questions", methods = ['GET'])
def get_questions():

    return jsonify({"data": question_json})



@app.route("/request_text", methods = ['GET'])
def request_text():

    """REQUEST URL: ADRESS:PORT/request_text?lang=<LANGUAGE HERE>"""

    lang = request.args.get('lang', 'en')
    
    if lang not in ["en", "ar"]:
        abort(404, description = f"Language {lang} not in ('en', 'ar')")
    
    return jsonify(sample_text_phoneme(lang = lang))



@app.route('/upload', methods=['POST'])
def upload():

    """"""
    # questions_path = Path(os.environ.get("BACKGROUND_ANSWER_STORAGE_DIR", "./data/background/background/")) / "questions.json"
    lang = request.args.get('lang', 'en')
    
    if lang not in ["en", "ar"]:
        abort(400, description = f"Language {lang} not in ('en', 'ar')")

    wav_file = request.files.get('audio_file')
    print(type(wav_file), "_____")
    response = request.form.get('data')

    if response is None:
        abort(400, description="Missing 'data' in form")
    
    if wav_file is None:
        abort(400, description= "Missing 'audio_file' wav file")
        
    response_json = json.loads(response)
    data = response_json.get('data')
    text = response_json.get('text')
    phonemes = response_json.get('phonemes')
    gender = data.get('0')

    if gender.lower() not in ('male', 'female', 'm', 'f','أنثى','ذكر'):

        abort(400, description = f"Gender provided {gender} not in ('male', 'female', 'm', 'f')")

    
    request_id = uuid4()

    save_data(uuid = request_id, data = data)
    save_audio_wav(uuid = request_id, audio_wav = wav_file)

    speech_rate = get_speech_rate(wav_file_path= get_audio_path(request_id), text= text)
    phoneme_rate = get_phoneme_rate(wav_file_path= get_audio_path(request_id), phonemes= phonemes)

    if speech_rate == 0:
        abort(400, description = "Text not attached with request")
    
    if phoneme_rate == 0:
        abort(400, description = "Could not extract phonemes from provided text.") 
    
    #dysarthria_prob = predict(get_audio_path(request_id), gender= gender)
    dysarthria_prob = 0.0431

    data['speech_rate'] = speech_rate
    data['phoneme_rate'] = phoneme_rate
    data['dysarthria_prob'] = dysarthria_prob
    
    questions = question_json
    for key in questions:
        questions[key]["answer"] = data[key]
    
    agent_response = get_agent_response(uuid = request_id, data = data)
    response = {
        "data":
        {
            "id": str(request_id),
            "agent_response" : agent_response,
            "speech_rate" : data['speech_rate'],
            "phoneme_rate": data['phoneme_rate'],
            "dysarthria_prob": data['dysarthria_prob']
        }
    }
    
    return jsonify(response)

@app.route('/chatbot', methods=['POST'])
def chatbot():
    try:
        data = request.get_json()

        if not data or 'uuid' not in data or 'message' not in data:
            return jsonify({"data": "Missing 'uuid' or 'message' in request body"}), 400

        uuid = data['uuid']
        user_query = data['message']

        response = respond(uuid=UUID(uuid), user_text=user_query)

        return jsonify({"data": response}), 200

    except Exception as e:
        return jsonify({"data": str(e)}), 500

    


if __name__ == "__main__":

    app.run(port= 5000, debug= True)
