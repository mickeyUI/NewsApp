from telethon import TelegramClient, events
from telethon.tl.types import MessageMediaPhoto, MessageMediaDocument
from firebase_client import save_post
from translator import translate_to_english, translate_to_amharic
from langdetect import detect
from datetime import datetime, timezone
import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

API_ID_STR = os.getenv("TELEGRAM_API_ID")
if API_ID_STR is None:
    raise EnvironmentError("Missing TELEGRAM_API_ID environment variable")
API_ID = int(API_ID_STR)
API_HASH = os.getenv("TELEGRAM_API_HASH")
PHONE = os.getenv("TELEGRAM_PHONE")

# Add the @usernames of the Ethiopian news channels you want to scrape
TARGET_CHANNELS = [
    "ETNewsOn" # add more here
]

client = TelegramClient("ethio_news_session", API_ID, API_HASH)

#this is for the summurization
import os
from groq import Groq

import os
from groq import Groq

def summarization(txt: str) -> str:
    client = Groq(
        api_key=os.environ.get("GROQ_API_KEY"),
    )

    # 1. Base Prompt Engineering Configuration
    messages = [
        {
            "role": "system",
            "content": (
                "You are an ultra-concise news editor. Your ONLY job is to write a punchy headline "
                "based on the text. Your output must be an absolute maximum of 10 words. "
                "Fewer words (5-8 words) is preferred. Do not use punctuation, quotes, or pre-text."
            )
        },
        {
            "role": "user",
            "content": f"Text to summarize:\n\"\"\"\n{txt}\n\"\"\""
        }
    ]

   
    for attempt in range(3):
        completion = client.chat.completions.create(
            messages=messages,
            model="llama-3.3-70b-versatile",
            temperature=0.0,  
        )
        
        headline = completion.choices[0].message.content.strip().replace('"', '')
        word_count = len(headline.split())

        
        if word_count <= 10:
            return headline

        
        print(f"Attempt {attempt + 1} failed. LLM generated {word_count} words: '{headline}'")
        
        messages.append({"role": "assistant", "content": headline})
        messages.append({
            "role": "user", 
            "content": f"That headline was {word_count} words. Too long! Rewrite it to be 8 words or less strictly."
        })

    return " ".join(headline.split()[:10])



def detect_language(text: str) -> str:
    try:
        lang = detect(text)
        return "am" if lang == "am" else "en"
    except:
        return "en"  

def get_media_info(message):
    if isinstance(message.media, MessageMediaPhoto):
        return "photo"
    elif isinstance(message.media, MessageMediaDocument):
        return "document"
    return None

@client.on(events.NewMessage(chats=TARGET_CHANNELS))
async def handler(event):
    message = event.message

    if not message.text or message.text.strip() == "":
        print("⏭️ Skipped empty message")
        return

    raw_text = message.text.strip()
    original_language = detect_language(raw_text)

    print(f"📨 New post from {event.chat.username} | lang: {original_language}")

    if original_language == "am":
        text_am = raw_text
        text_en = translate_to_english(raw_text)
    else:
        text_en = raw_text
        text_am = translate_to_amharic(raw_text)

    media_type = get_media_info(message)

    summrization_text = summarization(raw_text)

    post_data = {
        "channelSource": event.chat.title,
        "channelUsername": event.chat.username,
        "summarizedText": summrization_text,
        "originalText": raw_text,
        "originalLanguage": original_language,
        "textAm": text_am,
        "textEn": text_en,
        "postedAt": message.date.replace(tzinfo=timezone.utc).isoformat(),
        "scrapedAt": datetime.now(timezone.utc).isoformat(),
        "status": "published",
        "mediaUrl": None,
        "mediaType": media_type,
        "commentCount": 0,
    }

    save_post(post_data)

async def main():
    await client.start(phone=PHONE)
    print("Scraper is running...")
    print(f" Watching channels: {TARGET_CHANNELS}")
    await client.run_until_disconnected()

with client:
    client.loop.run_until_complete(main())