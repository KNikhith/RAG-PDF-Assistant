import { useState } from "react";
import FileUpload from "./components/FileUpload";
import Chat from "./components/Chat";

export default function App() {
  const [activeDoc, setActiveDoc] = useState(null);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-900">
      {/* Background decoration */}
      <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full bg-indigo-200/30 blur-3xl" />
      <div className="pointer-events-none absolute top-80 -right-40 h-96 w-96 rounded-full bg-violet-200/30 blur-3xl" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-200/70 bg-white/75 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="23"
                height="23"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <path d="M14 2v6h6" />
                <path d="M8 13h8" />
                <path d="M8 17h6" />
              </svg>
            </div>

            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                RAG AI Assistant
              </h1>
              <p className="text-xs text-slate-500">
                Your documents, understood.
              </p>
            </div>
          </div>

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
              ● Groq AI
            </span>
            <span className="rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
              Local Embeddings
            </span>
          </div>
        </div>
      </header>

      {/* Main workspace */}
      <main className="relative z-10 mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Page introduction */}
        <section className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-3 py-1.5 text-xs font-semibold text-indigo-700 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-indigo-500" />
            AI-powered document workspace
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Chat with your{" "}
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              PDFs.
            </span>
          </h2>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Upload a document, ask questions, and get answers based on its
            content. Your personal AI-powered reading assistant.
          </p>
        </section>

        {/* Workspace cards */}
        <section className="grid grid-cols-1 items-stretch gap-6 lg:grid-cols-12">
          {/* Upload panel */}
          <div className="min-w-0 lg:col-span-4">
            <div className="h-full rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)] sm:p-5">
              <div className="mb-5">
                <p className="text-xs font-bold uppercase tracking-[0.15em] text-indigo-600">
                  Step 01
                </p>
                <h3 className="mt-1 text-lg font-bold text-slate-900">
                  Your document
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  Upload a PDF to get started.
                </p>
              </div>

              <FileUpload activeDoc={activeDoc} onUploaded={setActiveDoc} />
            </div>
          </div>

          {/* Chat panel */}
          <div className="min-w-0 lg:col-span-8">
            <div className="flex h-full min-h-[600px] flex-col rounded-3xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_8px_30px_rgba(15,23,42,0.04)] backdrop-blur-sm transition-shadow duration-300 hover:shadow-[0_12px_35px_rgba(15,23,42,0.07)] sm:p-5">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600">
                    Step 02
                  </p>
                  <h3 className="mt-1 text-lg font-bold text-slate-900">
                    Ask anything
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    Have a conversation with your document.
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="21"
                    height="21"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
                    <path d="M8 10h8" />
                    <path d="M8 14h5" />
                  </svg>
                </div>
              </div>

              <div className="min-h-0 flex-1">
                <Chat hasDocument={Boolean(activeDoc)} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-xs text-slate-400 sm:flex-row">
          <p>Built with React, Node.js, LangChain and Groq.</p>
          <p>AI-powered document question answering.</p>
        </footer>
      </main>
    </div>
  );
}
