from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def translate_to_english(amharic_text: str) -> str:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are a professional translator. Translate the following Amharic news text to English. Return only the translated text, nothing else."
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
        model="llama-3.3-70b-versatile",
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