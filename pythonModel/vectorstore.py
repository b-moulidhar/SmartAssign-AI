import os
import json
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter
from db import company_collection # Import the db module to access MongoDB collections
import asyncio;

CHROMA_DIR = "chroma-store"

async def get_vectorstore():
    # Reuse if already persisted
    if os.path.exists(CHROMA_DIR):
        return Chroma(persist_directory=CHROMA_DIR, embedding_function=OllamaEmbeddings(model="nomic-embed-text"))

    # Load your JSON data
    raw_data = await company_collection.find({}, {'_id': 0}).to_list(length=None)
    print(f"Loaded {len(raw_data)} employee records from MongoDB")

    documents = []
    for item in raw_data:
        name = item.get("name", "Unknown")
        status = item.get("current_status", "Unknown")
        skills = item.get("skills", "")
        domain = item.get("domain_expertise", "")
        projects = item.get("past_projects", "")
        certifications = item.get("certifications", "")

        content = (
            f"Name: {name}\n"
            f"Status: {status}\n"
            f"Skills: {skills}\n"
            f"Domain Expertise: {domain}\n"
            f"Certifications: {certifications}\n"
            f"Projects: {projects}"
        )
        documents.append(Document(page_content=content))
        # documents.append(Document(page_content= json.dumps(item)))  

    # Chunk the data
    splitter = RecursiveCharacterTextSplitter(chunk_size=512, chunk_overlap=50)
    chunks = splitter.split_documents(documents)

    # Create embeddings
    embeddings = OllamaEmbeddings(model="nomic-embed-text")
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_DIR
    )
    print(f"Created vector store with {documents}")
    vectorstore.persist()
    print("✅ Vector store created and persisted")
    return vectorstore

if __name__ == "__main__":
    asyncio.run(get_vectorstore())
