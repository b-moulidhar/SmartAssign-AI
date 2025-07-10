from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from vectorstore import get_vectorstore
from db import chat_collection  # ✅ Import Mongo collection
from datetime import datetime
import json
from starlette.background import BackgroundTask
from langchain_core.documents import Document
import asyncio

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Include session_id in request body
class Query(BaseModel):
    prompt: str
    session_id: str

# LLM + Retriever setup
llm = OllamaLLM(model="gemma3", streaming=True)
retriever = get_vectorstore().as_retriever(search_kwargs={"k": 10})

# Prompt template
template = """
You are a helpful assistant. Use the context below to answer the question accurately.

Context:
{context}

Question:
{question}

Answer:
""".strip()

prompt_template = PromptTemplate(
    input_variables=["context", "question"],
    template=template
)

@app.post("/chat")
async def chat(query: Query):
    docs: list[Document] = await asyncio.to_thread(retriever.get_relevant_documents, query.prompt)
    # docs = retriever.get_relevant_documents(query.prompt)
    context = "\n\n".join([doc.page_content for doc in docs])
    full_prompt = prompt_template.format(context=context, question=query.prompt)

    full_response = ""  # ✅ Collect the full response

    def generator():
        nonlocal full_response
        # print("🔍 Retrieved Context:\n", context)
        for chunk in llm.stream(full_prompt):
            full_response += chunk
            yield json.dumps({"response": chunk}) + "\n"

    async def save_history():
        try:
            await chat_collection.insert_one({
                "session_id": query.session_id,
                "user": query.prompt,
                "bot": full_response,
                "timestamp": datetime.utcnow()
            })
        except Exception as e:
            print(f"❌ Error saving chat history: {e}")

    return StreamingResponse(generator(), media_type="text/plain", background=BackgroundTask(save_history))
