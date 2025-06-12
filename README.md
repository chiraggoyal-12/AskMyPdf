# AskMyPDF

**AskMyPDF** is a full-stack web application that lets users upload PDF documents and chat with an AI assistant that answers questions based on the content of the uploaded PDF.

---

## 🚀 Features

* 📄 Upload a PDF file and extract its content
* 🧠 Embed document text using local LLM-based embeddings
* 💬 Ask questions and receive context-based answers from the document
* 🧾 View chat history and delete documents
* 🔐 Authenticated access for secure usage

---

## 🛠️ Tech Stack

**Frontend:**

* EJS Templating Engine
* Bootstrap CSS

**Backend:**

* Node.js + Express
* MongoDB (Mongoose)
* Multer for file uploads
* Ollama (Local LLM like LLaMA 3 or Mistral)
* Apache Arrow & Faiss for vector storage (via custom utils)

**Authentication:**

* Custom auth middleware with session-based login (extendable)

---

## 📂 Folder Structure

```
AskMyPDF/
├── models/            # Mongoose schemas (Document, ChatHistory)
├── routes/            # Express routes (upload, chat)
├── utils/             # PDF parsing, embeddings, vector DB, Ollama
├── views/             # EJS templates (home, chat, history)
├── uploads/           # Uploaded PDF files
├── public/            # Static files (CSS, JS)
├── app.js             # Entry point
├── package.json       # Project metadata and scripts
```

---

## ⚙️ Setup Instructions

1. **Clone the repo**:

   ```bash
   git clone https://github.com/chiraggoyal-12/AskMyPdf.git
   cd AskMyPdf
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Run MongoDB locally or connect MongoDB Atlas**

4. **Start Ollama with your preferred model (e.g., LLaMA3)**

   ```bash
   ollama run llama3
   ```

5. **Run the server**:

   ```bash
   node app.js
   ```

6. **Visit**: `http://localhost:3000`

---

## 🙌 Author

**Chirag Goyal**
[GitHub Profile](https://github.com/chiraggoyal-12)

---

> ⚠️ This project is for educational/demo purposes only.

