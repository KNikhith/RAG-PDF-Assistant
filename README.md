# RAG-PDF-Assistant 📄🤖

**An AI-powered PDF question-answering application built using Retrieval-Augmented Generation (RAG).**

RAG-PDF-Assistant allows users to upload PDF documents and ask questions about their content using natural language. It retrieves relevant information from uploaded documents and uses the Groq API to generate context-aware answers.

The application combines a React frontend, Node.js backend, LangChain, and locally generated embeddings to provide an interactive document question-answering experience.

## ✨ Features

- **PDF Upload:** Upload PDF documents through an interactive interface.
- **Text Extraction:** Extract text from uploaded PDF files.
- **Document Chunking:** Split extracted text into manageable chunks using LangChain.
- **Local Embeddings:** Generate vector embeddings using a Hugging Face embedding model.
- **Semantic Search:** Retrieve relevant document chunks based on user questions.
- **AI-Powered Responses:** Generate context-aware answers using the Groq API.
- **Interactive Chat:** Ask questions and receive answers through a conversational interface.
- **Document-Based Answers:** Generate responses using retrieved PDF context.

## 🛠️ Tech Stack

| Category | Technologies |
|---|---|
| Frontend | React.js, Tailwind CSS, Vite |
| Backend | Node.js, Express.js |
| HTTP Client | Axios |
| RAG Framework | LangChain |
| PDF Processing | PDF parsing |
| Embedding Model | Hugging Face Transformers.js |
| Language Model | Groq API |
| Vector Store | LangChain MemoryVectorStore |

## 🧠 How RAG Works

The application follows a Retrieval-Augmented Generation workflow.

### Document Indexing

1. **PDF Upload:** The user uploads a PDF document.
2. **Text Extraction:** Extract text from the uploaded PDF.
3. **Text Chunking:** Split the extracted text into smaller chunks using `RecursiveCharacterTextSplitter`.
4. **Embedding Generation:** Convert text chunks into vector embeddings using the local `all-MiniLM-L6-v2` model.
5. **Vector Storage:** Store the generated embeddings in LangChain's `MemoryVectorStore`.

### Question Answering

1. **User Query:** The user asks a question about the uploaded document.
2. **Query Embedding:** Convert the question into a vector embedding.
3. **Similarity Search:** Retrieve the most relevant document chunks from the vector store.
4. **Context Preparation:** Combine the retrieved chunks with the user's question.
5. **Answer Generation:** Send the context and question to the Groq API.
6. **Response:** Display the generated answer in the chat interface.

## 🏗️ Project Structure

```text
RAG-PDF-Assistant/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── rag/
│   │   ├── embeddings.js
│   │   ├── textSplitter.js
│   │   ├── vectorStore.js
│   │   └── ragChain.js
│   ├── index.js
│   └── package.json
│
├── .gitignore
└── README.md
```

## ⚙️ Getting Started

### Prerequisites

- Node.js and npm
- Git
- Groq API key

### 1. Clone the Repository

```bash
git clone https://github.com/KNikhith/RAG-PDF-Assistant.git

cd RAG-PDF-Assistant
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
npm install
```

Create a `.env` file inside the backend directory:

```env
PORT=5000
GROQ_API_KEY=your_groq_api_key
```

Start the backend development server:

```bash
npm run dev
```

The backend will run at:

```text
http://localhost:5000
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file inside the frontend directory:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

Open the application at:

```text
http://localhost:5173
```

## 🔗 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/documents/upload` | Upload and process a PDF document |
| POST | `/api/ai/ask` | Ask a question about the uploaded PDF |

## 🚀 Deployment

The application can be deployed using Render.

| Component | Render Service | Build / Publish Configuration |
|---|---|---|
| Frontend | Static Site | `npm install && npm run build` / `dist` |
| Backend | Web Service | `npm install` / `npm start` |

Configure the following environment variables:

**Backend:**

```env
GROQ_API_KEY=your_groq_api_key
FRONTEND_URL=your_frontend_url
```

**Frontend:**

```env
VITE_API_URL=your_backend_url/api
```

Replace the example values with your actual deployment URLs and API key.

## ⚠️ Current Limitations

- The vector store currently uses in-memory storage. Indexed documents are lost when the backend restarts.
- The local embedding model requires an initial download and uses server resources.
- The current implementation is designed around an uploaded PDF document at a time.
- Answer quality depends on the relevance of retrieved document chunks and the information available in the PDF.

## 🔮 Future Improvements

- Persistent vector database integration.
- Support for multiple PDF documents.
- Document and conversation history.
- Source citations with page references.
- Streaming AI responses.
- User authentication and document management.

## 👨‍💻 Author

**Nikhith K**

- GitHub: [@KNikhith](https://github.com/KNikhith)
- Project Repository: [RAG-PDF-Assistant](https://github.com/KNikhith/RAG-PDF-Assistant)

---

If you find this project interesting, consider giving it a ⭐ on GitHub!