import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import asyncio

load_dotenv()  # Load variables from .env

PSWD = os.getenv("MONGO_PSWD")
DATA_PSWD = os.getenv("MONGO_DATA_PSWD")
DB_NAME = os.getenv("MONGO_DB_NAME", "gyan-k")
DB_DATA_NAME = os.getenv("MONGO_DB_DATA_NAME", "SmartAssignDB")

MONGODB_URI = f"mongodb+srv://mouli:{PSWD}@cluster0.steajln.mongodb.net/?retryWrites=true&w=majority&appName=cluster0"
MONGODB_URI_DATA = f"mongodb+srv://admin:{DATA_PSWD}@smartassign-mongodbclus.nvencm2.mongodb.net/?retryWrites=true&w=majority&appName=SmartAssign-MongoDBCluster"

client = AsyncIOMotorClient(MONGODB_URI)
db = client[DB_NAME]
chat_collection = db.chat_history

client_data = AsyncIOMotorClient(MONGODB_URI_DATA)
db_data = client_data[DB_DATA_NAME] 
company_collection = db_data.employees


# async def set_db():
#     result = await company_collection.insert_many(sample_company)
#     return print(f"Sample company inserted with ID: {result.inserted_ids}")

# asyncio.run(set_db()) # Run the async function to insert sample data
