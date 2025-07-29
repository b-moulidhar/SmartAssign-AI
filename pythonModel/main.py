from fastapi import FastAPI,Path
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from vectorstore import get_vectorstore
from db import chat_collection, company_creds, proje_collection
from datetime import datetime
import json
from starlette.background import BackgroundTask
from langchain_core.documents import Document
import asyncio
from bson import ObjectId
import time
import random

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define model for request
class Query(BaseModel):
    prompt: str
    session_id: str
    user_id: str 
class LoginQuery(BaseModel):
    user: str
    password: str

# Initialize LLM (streaming=True for tokens)
llm = OllamaLLM(model="gemma3", streaming=True)

# Vectorstore cache (singleton)
vectorstore_instance = None
retriever = None

@app.on_event("startup")
async def load_vectorstore_once():
    global vectorstore_instance, retriever
    vectorstore_instance = await get_vectorstore()
    retriever = vectorstore_instance.as_retriever(search_kwargs={"k": 10})
    print("✅ Vectorstore and retriever loaded")


@app.post("/login")
async def login(query: LoginQuery):
    print(f"Received login request for user: {query}")
    result = await company_creds.find_one({"user": query.user, "password": query.password})
    print(f"Login result: {result}")
    if result == None:
        return {"message": "Invalid credentials"}
    else:
        return {"message": "Login successful",
                "session_id": str(random.randint(10000000000000, 99999999999999)),  # Generate a random session ID
                "user": query.user}

@app.get("/projects")
async def get_projects():
    try:
        projects = await proje_collection.find({}, {'_id': 0}).to_list(length=None)
        print(f"Loaded {len(projects)} projects from MongoDB")
        return {"projects": projects}
    except Exception as e:
        print(f"❌ Error fetching projects: {e}")
        return {"error": "Failed to fetch projects"}

@app.post("/chat")
async def chat(query: Query):
    start = time.time()
    docs: list[Document] = await asyncio.to_thread(retriever.get_relevant_documents, query.prompt)
    print("⏱️ Retrieval time:", time.time() - start)
    context = "\n\n".join([doc.page_content for doc in docs])

    template = """
    You are a helpful assistant. Use the context below to answer the question accurately.

    Context:
    {context}

    Question:
    {question}

    Answer:
    """.strip()

    full_prompt = PromptTemplate(input_variables=["context", "question"], template=template).format(
        context=context, question=query.prompt
    )

    full_response = ""

    def generator():
        nonlocal full_response
        start = time.time()
        for chunk in llm.stream(full_prompt):
            full_response += chunk
            yield json.dumps({"response": chunk}) + "\n"
        print("⏱️ LLM response time:", time.time() - start)

    async def save_history():
        try:
            await chat_collection.insert_one({
                "session_id": query.session_id,
                "userid": query.user_id,  # Use session_id as user ID
                "user": query.prompt,
                "bot": full_response,
                "timestamp": datetime.utcnow()
            })
        except Exception as e:
            print(f"❌ Error saving chat history: {e}")

    return StreamingResponse(generator(), media_type="text/plain", background=BackgroundTask(save_history))

@app.get("/chat/history/{userid}")
async def get_chat_history_by_userid(userid: str = Path(..., description="User ID to retrieve chat history")):
    pipeline = [
        {"$match": {"userid": userid}},  # Filter only this user
        {"$sort": {"timestamp": 1}},
        {
            "$group": {
                "_id": "$session_id",  # Group by session ID within the user
                "chats": {
                    "$push": {
                        "_id": "$_id",
                        "user": "$user",
                        "bot": "$bot",
                        "timestamp": "$timestamp"
                    }
                }
            }
        },
        {"$sort": {"_id": 1}}
    ]

    cursor = chat_collection.aggregate(pipeline)
    grouped_data = []

    async for doc in cursor:
        for chat in doc["chats"]:
            if isinstance(chat["_id"], ObjectId):
                chat["_id"] = str(chat["_id"])
        grouped_data.append({
            "session_id": doc["_id"],
            "chats": doc["chats"]
        })

    return {
        "userid": userid,
        "sessions": grouped_data
    }
