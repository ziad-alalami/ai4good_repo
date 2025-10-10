from flask import Flask, request, jsonify, abort
import json
import os
from dotenv import load_dotenv
from pathlib import Path
from utils.text_sampler.text_sampler import sample_text_phoneme

app = Flask(__name__)

load_dotenv(override= True)
question_path = Path(os.environ.get("QUESTIONS_PATH", "./data/background/questions.json"))
question_json = json.loads(question_path.read_text(encoding= "utf-8"))


text_path = Path(os.environ.get("USER_TEXT_FILE", "./data/background/user_text.json"))
text_json = json.loads(text_path.read_text(encoding="utf-8"))

@app.route("/questions", methods = ['GET'])
def get_questions():

    return jsonify(question_json)

@app.route("/request_text", methods = ['GET'])
def request_text():

    lang = request.args.get('lang', 'en')
    
    if lang not in ["en", "ar"]:
        abort(404)
    
    return sample_text_phoneme(lang = lang)


if __name__ == "__main__":

    app.run(port= 5000, debug= True)
