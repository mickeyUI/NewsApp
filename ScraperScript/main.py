from telethon import TelegramClient, events
from telethon.tl.types import MessageMediaPhoto, MessageMediaDocument
from firebase_client import save_post
from translator import translate_to_english, translate_to_amharic, classify_post
from langdetect import detect
from datetime import datetime, timezone
import re
import os
from dotenv import load_dotenv
from groq import Groq
from supabase import create_client

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

        if lang == "en":
            return "En"
        elif lang == "am":
            return "Amh"
        else:
            return "Amh"

    except Exception:
        return "Amh"

import re

def clean_text(text: str, lang: str) -> str:
    text = re.sub(r"read more.*", "", text, flags=re.IGNORECASE | re.DOTALL)

    # Remove 3 or more consecutive stars
    text = re.sub(r"\*{3,}", " ", text)

    # Remove mentions completely (@word -> "")
    text = re.sub(r"@\w+", "", text)

    # Remove remaining single stars
    text = text.replace("*", "")

    # Remove https links
    text = re.sub(r"https?://\S+", "", text)

    # Normalize spaces
    text = re.sub(r"\s+", " ", text).strip()

    if lang == "En":
    # Remove hashtag symbol only (#word -> word)
        text = re.sub(r"#(?=\w+)", "", text)
        count = 0
        def replacedot(match):
            nonlocal count
            count += 1
            return "።\n\n" if count % 2 == 0 else "."
        
        # FIXED: Escape the dot so it targets literal periods only
        text = re.sub(r"\.", replacedot, text)
        
    if lang == "Amh":
        # Remove hashtags completely (#word -> "")
        text = re.sub(r"#\w+", "", text)
        # Add two newlines after every second Ethiopic full stop (።)
        count = 0
        def replace(match):
            nonlocal count
            count += 1
            return "።\n\n" if count % 2 == 0 else "።"
        text = re.sub(r"።", replace, text)
        
    return text

def deep_clean(text: str) -> str:
    text = re.sub(r"\*{3,}", " ", text)
    text = re.sub(r"[#@]\w+", "", text)
    text = text.replace("*", "")
    text = re.sub(r"\s+", " ", text).strip()
    return text



#supabase connection
url= os.getenv("SUPABASE_URL")
key= os.getenv("SUPABASE_KEY")

supabase= create_client(url, key)

def UploadToSupabase(filepath):
    file_name = os.path.basename(filepath)
    print(file_name)
    with open(filepath, "rb") as f:
        response = (supabase.storage.from_("ETNewsImages").upload(file=f,path=f"IMG/{file_name}", file_options={"upsert": "True"}))
    PublicUrl = (supabase.storage.from_("ETNewsImages").get_public_url(f"IMG/{file_name}"))
    if (PublicUrl):
        return PublicUrl
    return ""

@client.on(events.NewMessage(chats=TARGET_CHANNELS))
async def handler(event):
    message = event.message
    supaUrl: str = ""

    if event.message.photo:
        download_dir = '/home/mickey/Downloads/ETNewsScraperMedia'
        os.makedirs(download_dir, exist_ok=True)
        file_path = await message.download_media(file= download_dir)
        supaUrl = UploadToSupabase(file_path) 
        
        

    if not message.text or message.text.strip() == "":
        print("⏭️ Skipped empty message")
        return

    raw_text = message.text.strip()
    original_language = detect_language(deep_clean(raw_text))
    raw_text= clean_text(raw_text, original_language)
    print(original_language)

    print(f"📨 New post from {event.chat.username} | lang: {original_language}")

    if original_language == "Amh":
        text_am = raw_text
        text_en = translate_to_english(raw_text)
    else:
        text_en = raw_text
        text_am = translate_to_amharic(raw_text)

    summrization_text = summarization(raw_text)
    classifications= classify_post(text_en)

    composer= 'unknown'
    if message.fwd_from:
        channel = await client.get_entity(message.fwd_from.from_id)
        composer = channel.title
        print("Forwarded from:", channel.title)

    post_data = {
        "summarizedText": summrization_text,
        "headerImage": supaUrl,
        "originalText": raw_text,
        "originalLanguage": original_language,
        "textAm": text_am,
        "textEn": text_en,
        "category": classifications["category"],
        "importance": classifications["importance"],
        "isBreaking": classifications["isBreaking"],
        "channelSource": composer,
        "postedAt": message.date.replace(tzinfo=timezone.utc).isoformat(),
        "scrapedAt": datetime.now(timezone.utc).isoformat(),
        "views": 0,
        "read": 0,
        "published": True,
    }

    try:
        save_post(post_data)

        await client.send_message(
            "StatusCheckOk",
            f"✅ Post added successfully\n\n"
        )
    except Exception as e:
        await client.send_message(
            "StatusCheckOk",
            f"❌ Failed to save post\n\nError:\n{str(e)}"
        )

async def main():
    await client.start(phone=PHONE)
    print("Scraper is running...")
    print(f" Watching channels: {TARGET_CHANNELS}")
    await client.run_until_disconnected()

with client:
    client.loop.run_until_complete(main())