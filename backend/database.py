# database.py
import os
from dotenv import load_dotenv
from motor.motor_asyncio import AsyncIOMotorClient

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")

client = AsyncIOMotorClient(MONGO_URI)
db = client.ai_quiz_db

# MongoDB Collections
users_collection = db.get_collection("users")
quizzes_collection = db.get_collection("quizzes")