from fastapi import FastAPI, Request
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
import json

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    prompt: str

llm = OllamaLLM(model="gemma3", streaming=True)

@app.post("/chat")
async def chat(query: Query):
    def generator():
        for chunk in llm.stream(query.prompt):
            # Yield JSON string
            yield json.dumps({"response": chunk}) + "\n"

    return StreamingResponse(generator(), media_type="text/plain")
