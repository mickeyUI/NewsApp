from groq import Groq
import os
import json
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def detect_language(text: str) -> str:
    response= client.chat.completions.create(
    model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a professional translator. the text i provided is either English or amharic language, read through the text and identify the core language used here. if you can't identify most of the text as english then its amharic. your response should be a stirng En if you identify it as engilsh and Amh if you identify it as amharic"
            },
            {
                "role": "user",
                "content": text
            }
        ],
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()

def translate_to_english(amharic_text: str) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a professional translator. Translate the following Amharic news text to English, and add spacing and former formatting where applicable. Return only the translated text, nothing else."
            },
            {
                "role": "user",
                "content": amharic_text
            }
        ],
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()

def translate_to_amharic(english_text: str) -> str:
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": "You are a professional translator. Translate the following English news text to Amharic. Return only the translated text, nothing else."
            },
            {
                "role": "user",
                "content": english_text
            }
        ],
        max_tokens=1000
    )
    return response.choices[0].message.content.strip()


def classify_post(text: str) -> dict:
    # Ask Groq to classify the post into a category and assign an importance score.
    # We ask for JSON so we can parse it reliably without regex hacks.
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {
                "role": "system",
                "content": """You are a news classification assistant. Given a news article, return ONLY a valid JSON object with exactly these fields:
{
  "category": one of ["Politics", "Business", "Sports", "Health", "Entertainment", "International", "Neutral", "technology", "Religion"],
  "importance": one of [1, 2, 3] where 1=minor, 2=normal, 3=major story,
  "isBreaking": true or false
}
Return nothing else. No explanation, no markdown, just the JSON object."""
            },
            {
                "role": "user",
                "content": text
            }
        ],
        max_tokens=100
    )

    raw = response.choices[0].message.content.strip()

    try:
        result = json.loads(raw)
        # Validate fields in case Groq returns unexpected values
        valid_categories = ["Politics", "Business", "Sports", "Health", "Entertainment", "International", "Neutral", "Technology", "Religion"]
        if result.get("category") not in valid_categories:
            result["category"] = "Neutral"  # safe default
        if result.get("importance") not in [1, 2, 3]:
            result["importance"] = 2  # safe default
        if not isinstance(result.get("isBreaking"), bool):
            result["isBreaking"] = False
        return result
    except json.JSONDecodeError:
        # If Groq returns something unparseable, use safe defaults
        return {"category": "Neutral", "importance": 2, "isBreaking": True}
    
