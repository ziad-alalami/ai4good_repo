import json
from typing import List, Dict, Any, cast
from pathlib import Path
import os
from dotenv import load_dotenv
from enum import Enum
from openai import OpenAI
from pydantic import BaseModel
from uuid import UUID

from utils.storage.storage import store_response, get_chat

class Response(BaseModel):

    accepted_msg: bool
    response: str



class ChatBotAgent:

    def __init__(self):

        main_prompt_path = os.environ.get("CHATBOT_AGENT_PROMPT")
        if main_prompt_path is None:
            raise ValueError("Environment variable 'CHATBOT_AGENT_PROMPT' is not set.")
        
        path = Path(main_prompt_path)
        assert path.exists(), f"Could not find path to main agent prompt provided in env as {main_prompt_path}"

        self.client = OpenAI()
        self.prompt = path.read_text(encoding= "utf-8")
        model_version = os.environ.get("MODEL_NAME")
        if model_version is None:
            raise ValueError("Environment variable 'MODEL_NAME' is not set.")
        self.model_version: str = model_version




    
    def respond(self, data: Dict | List[Dict]) -> Dict[str, List]:

        
        response = self.client.responses.parse(
        model= self.model_version,
        tools= [
            { "type": "web_search" },
        ],
        input=cast(Any, [
            {
                "role": "system",
                "content": self.prompt
            },
            {"role": "user", "content": json.dumps(data, indent = 4)},
        ]),
        text_format=Response,
        )

        if response.output_parsed is not None:
            return response.output_parsed.model_dump()
        else:
            raise ValueError(f"Failed to parse response: output_parsed is {response.output_parsed}")
    
chatbot = ChatBotAgent()
        
def respond(uuid: UUID, user_text: str) -> Dict:

    chat_history = get_chat(uuid)
    if chat_history == [{}]:

        return {
            "accepted_msg": False,
            "response": "Convo not initiated yet."
        }
    
    chat_history.append({"user": user_text})

    agent_response = chatbot.respond(chat_history)

    store_response(uuid= uuid, is_agent= False, response= user_text)
    store_response(uuid= uuid, is_agent= True, response= agent_response)

    return agent_response


if __name__ == "__main__":

    uuid = UUID("e4546b0e-d469-461f-b35a-4668aca5b9ee")
    text = "لو فيك تساعدني في العربي... هل يمكن يكون السبب سبب نفسي؟"

    print(respond(uuid= uuid, user_text= text))
