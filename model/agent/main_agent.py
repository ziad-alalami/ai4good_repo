import json
from typing import List, Dict, Any, cast
from pathlib import Path
import os
from dotenv import load_dotenv
from enum import Enum
from openai import OpenAI
from pydantic import BaseModel, field_serializer, Field
from uuid import UUID

from utils.storage.storage import store_response


load_dotenv(override= True)
    
class Disorder(BaseModel):

    disorder_name : str
    disorder_symptoms: List[str]
    disorder_pointers: List[str]
    disorder_lying_causes: List[str]


class SpeechRateSeverity(str, Enum):

    low = "Low (Needs Improvement)"
    mild_low = "Mildly Low (Needs Slight Improvement)"
    normal = "Normal (Good)"
    high = "Higher than average (Good)"

class SpeechRateSeverity_AR(str, Enum):
    low = "منخفض (يحتاج لتحسين)"
    mild_low = "منخفض قليلا (يحتاج لتحسين بسيط)"
    normal = "طبيعي (جيد)"
    high = "أعلى من المتوسط (ممتاز)"

class RootCause(BaseModel):

    cause: str
    explanation: str

class Priority(str, Enum):

    top = "Top"
    normal = "Normal"
    low = "Low"

class Priority_AR(str, Enum):

    top = "عالي"
    normal = "عادي"
    low = "منخفض"


class Recommendation(BaseModel):

    recommendation : str
    priority : Priority
    tips: List[str]
    resources_or_links: List[str] = Field(default_factory=list)

    @field_serializer("priority", mode="plain")
    def _ser_priority(self, v):
        return v.value if v is not None else v

class Recommendation_AR(BaseModel):

    recommendation : str
    priority : Priority_AR
    tips: List[str]
    resources_or_links: List[str] = Field(default_factory=list)

    @field_serializer("priority", mode="plain")
    def _ser_priority(self, v):
        return v.value if v is not None else v


class Response(BaseModel):
    overview_en : str
    overview_ar : str

    avg_class_wpm : float

    speech_rate_comparison_en: str
    speech_rate_comparison_ar: str

    speech_rate_severity: SpeechRateSeverity
    speech_rate_severity_ar: SpeechRateSeverity_AR

    disorders_en: List[Disorder]
    disorders_ar: List[Disorder]

    root_causes_en: List[RootCause]
    root_causes_ar: List[RootCause]

    recommendations_en : List[Recommendation]
    recommendations_ar : List[Recommendation_AR]


    references_and_resources_links: List[str]



    @field_serializer("speech_rate_severity", mode="plain")
    def _ser_speech_rate_sev(self, v):
        return v.value if v is not None else v
    
    @field_serializer("speech_rate_severity_ar", mode="plain")
    def _ser_speech_rate_sev(self, v):
        return v.value if v is not None else v



    


class GPTAgent:

    def __init__(self):

        main_prompt_path = os.environ.get("MAIN_AGENT_PROMPT")
        if main_prompt_path is None:
            raise ValueError("Environment variable 'MAIN_PROMPT' is not set.")
        
        path = Path(main_prompt_path)
        assert path.exists(), f"Could not find path to main agent prompt provided in env as {main_prompt_path}"

        self.client = OpenAI()
        self.prompt = path.read_text(encoding= "utf-8")
        model_version = os.environ.get("MODEL_NAME")
        if model_version is None:
            raise ValueError("Environment variable 'MODEL_NAME' is not set.")
        self.model_version: str = model_version




    
    def analyze_data(self, data: Dict) -> Dict[str, List]:

        
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
        

analyzer_agent = GPTAgent()


def get_agent_response(uuid: UUID, data: Dict):

    response =  analyzer_agent.analyze_data(data)
    store_response(uuid= uuid, is_agent= True, response= response)
    return response




if __name__ == "__main__":
    load_dotenv(override= True)
    response = (Path(os.environ.get("BACKGROUND_ANSWER_STORAGE_DIR", "./data/background/user_responses/")) / "1.json").read_text(encoding= "utf-8")
    agent = GPTAgent()
    print(json.dumps(agent.analyze_data(json.loads(response)), indent = 4))