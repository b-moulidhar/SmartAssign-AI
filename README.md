
---

## ✅ Prerequisites

- Python 3.10 or above
- [Ollama](https://ollama.com/) installed and running (`ollama run llama3`, `gemma3`(used in project), etc.)
- Git (optional but recommended)

---

## 🛠️ Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/SmartAssign-AI.git
cd SmartAssign-AI
```
### 2. Create Virtual Environment

```bash
python -m venv venv
```

### 3. Activate the Virtual Environment

on windows

```bash
venv\Scripts\activate
```
on Linux

```bash
source venv/bin/activate
```
### 4.Install dependencies

```bash
pip install -r requirements.txt
```
If requirements.txt is missing, you can generate it using

```bash
pip freeze > requirements.txt
```

## 🧠 Run a Model with Ollama

```bash
ollama run gemma3
```

## ▶️ Run the Server

```bash
uvicorn main:app --reload
```
API will be available at:
📍 http://127.0.0.1:8000

## 🛠️ Frontend setup instructions

### 1. redirect to smartdash folder from smartassignAI folder
```bash
cd smartdash
```
### 2. Install dependencies
```bash
npm install
```
### 3. ▶️run NextJs Development server
```bash
npm run dev
```
API will be available at:
📍 http://localhost:3000

