from telethon.sync import TelegramClient
from telethon.sessions import StringSession
from dotenv import load_dotenv
import os

load_dotenv()
    
    

API_ID_STR = os.getenv("TELEGRAM_API_ID")
if API_ID_STR is None:
    raise EnvironmentError("Missing TELEGRAM_API_ID environment variable")
API_ID = int(API_ID_STR)
API_HASH = os.getenv("TELEGRAM_API_HASH")
PHONE = os.getenv("TELEGRAM_PHONE")

with TelegramClient(StringSession(), API_ID, API_HASH) as client:
    print("\n--- COPY YOUR SESSION STRING BELOW ---")
    print(client.session.save())
    print("--------------------------------------\n")