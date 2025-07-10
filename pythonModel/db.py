import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()  # Load variables from .env

PSWD = os.getenv("MONGO_PSWD")
DB_NAME = os.getenv("MONGO_DB_NAME", "chat_db")

MONGODB_URI = f"mongodb+srv://mouli:{PSWD}@cluster0.steajln.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]
chat_collection = db.chat_history
