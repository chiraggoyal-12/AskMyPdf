# AskMyPDF 🧠📄

AskMyPDF is a full-stack AI-powered web application that allows users to upload PDF files and ask questions about their content. It uses local inference via Ollama and the `nomic-embed-text` model for embedding generation and retrieval-based question answering (RAG).

---

## 🚀 Features

* 📄 Upload and store PDF documents securely
* 🤖 Ask questions about the uploaded PDF using natural language
* 🧠 Uses local LLMs with Ollama (`llama3` for generation and `nomic-embed-text` for embeddings)
* 🔍 Retrieves relevant chunks using cosine similarity
* 🛠️ Built with Node.js, Express, MongoDB, EJS, and Bootstrap
* 💻 100% local — no OpenAI or external API required

---

## 🛠️ Tech Stack

* **Frontend**: EJS, HTML, CSS, JavaScript
* **Backend**: Node.js, Express
* **Database**: MongoDB
* **LLM & Embeddings**: Ollama (`llama3`, `nomic-embed-text`)
* **PDF Parsing**: `pdf-parse`
* **Embeddings**: Cosine similarity-based chunk matching

---

## 📦 Installation

### Prerequisites:

* Node.js & npm
* MongoDB installed and running locally or via Atlas
* [Ollama](https://ollama.com/) installed (version ≥ 0.9.0)
* Pull the required models:

```bash
ollama pull nomic-embed-text
ollama pull llama3
```

### Setup:

```bash
git clone https://github.com/your-username/askmypdf.git
cd askmypdf
npm install
```

### Environment variables:

Create a `.env` file and add:

```env
MONGODB_URI=mongodb://localhost:27017/askmypdf
PORT=3000
```

### Run the App:

```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 🤖 How It Works

1. User uploads a PDF.
2. The PDF is chunked and converted to text.
3. Embeddings are generated locally using `nomic-embed-text` via Ollama.
4. User asks a question.
5. Embedding of the question is compared to the stored chunks using cosine similarity.
6. Top-k relevant chunks are passed to `llama3` via Ollama for generating an answer.
7. Answer is returned to the user.

---

## 📁 Project Structure

```
.
├── routes/
├── views/
├── utils/
├── public/
├── models/
├── uploads/
├── app.js
├── .env
```

---

## 🙌 Acknowledgements

* [Ollama](https://ollama.com/) for local model inference
* [`nomic-embed-text`](https://ollama.com/library/nomic-embed-text) and [`llama3`](https://ollama.com/library/llama3) models
* Bootstrap for quick UI

---

## 💡 Future Improvements

* Switch to a vector database (e.g., Pinecone, Chroma)
* User authentication
* Chat history
* Streamed responses
* Deploy with Docker

---

## 🙌 Author

**Chirag Goyal**
[GitHub Profile](https://github.com/chiraggoyal-12)

---

> ⚠️ This project is for educational/demo purposes only.
