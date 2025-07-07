import os
import json
from langchain_community.embeddings import OllamaEmbeddings
from langchain_chroma import Chroma
from langchain_core.documents import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

CHROMA_DIR = "chroma-store"

def get_vectorstore():
    # Reuse if already persisted
    if os.path.exists(CHROMA_DIR):
        return Chroma(persist_directory=CHROMA_DIR, embedding_function=OllamaEmbeddings(model="nomic-embed-text"))

    # Load your JSON data
    with open("./company.json", "r") as f:
        raw_data = json.load(f)

    documents = []
    for item in raw_data:
        content = f"**{item['name']}**\n{item['role']}\nSkills: {', '.join(item['skills'])}\nProjects: {', '.join(item['projects'])}"
        documents.append(Document(page_content=content))

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

    vectorstore.persist()
    print("✅ Vector store created and persisted")
    return vectorstore

if __name__ == "__main__":
    get_vectorstore()
