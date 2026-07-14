import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

cred = credentials.Certificate(os.getenv("FIREBASE_CREDENTIALS_PATH"))
firebase_admin.initialize_app(cred)

db = firestore.client()

def save_post(post_data: dict):
    doc_ref = db.collection("posts").document()
    post_data["postId"] = doc_ref.id
    doc_ref.set(post_data)
    print(f"✅ Saved post: {doc_ref.id}")