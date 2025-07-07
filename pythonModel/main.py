from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from langchain_ollama import OllamaLLM
from langchain_core.prompts import PromptTemplate
from vectorstore import get_vectorstore
import json

app = FastAPI()

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    prompt: str

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
    # Step 1: Retrieve relevant documents
    docs = retriever.get_relevant_documents(query.prompt)
    context = "\n\n".join([doc.page_content for doc in docs])

    # Step 2: Construct prompt manually
    full_prompt = prompt_template.format(context=context, question=query.prompt)

    # Step 3: Stream token-by-token from LLM
    def generator():
        print("🔍 Retrieved Context:\n", context)
        for chunk in llm.stream(full_prompt):
            yield json.dumps({"response": chunk}) + "\n"

    return StreamingResponse(generator(), media_type="text/plain")
