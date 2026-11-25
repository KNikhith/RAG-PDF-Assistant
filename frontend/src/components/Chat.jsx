import { useEffect, useRef, useState } from "react";
import axios from "axios";
import Message from "./Message";

const API_BASE = "http://localhost:5000/api";

export default function Chat({ hasDocument }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  const handleSend = async (e) => {
    e.preventDefault();

    if (!input.trim() || loading || !hasDocument) return;

    const question = input.trim();

    setMessages((prev) => [...prev, { sender: "user", text: question }]);

    setInput("");
    setLoading(true);

    try {
      const res = await axios.post(`${API_BASE}/ai/ask`, {
        question,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: res.data.answer,
        },
      ]);
    } catch (err) {
      const errorMessage =
        err.response?.data?.error || "Something went wrong. Please try again.";

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: errorMessage,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["Summarize this document", "What are the key points?"];

  return (
    <div className="flex h-[600px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-900">PDF Assistant</h2>
            <p className="text-xs text-slate-500">
              Ask anything about your document
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
            hasDocument
              ? "bg-emerald-50 text-emerald-700"
              : "bg-amber-50 text-amber-700"
          }`}
        >
          <span
            className={`h-2 w-2 rounded-full ${
              hasDocument ? "bg-emerald-500" : "bg-amber-500"
            }`}
          />
          {hasDocument ? "Document ready" : "No document"}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 px-4 py-6 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                className="h-8 w-8"
              >
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v5h5M9 13h6m-6 4h6" />
              </svg>
            </div>

            <h3 className="text-lg font-semibold text-slate-800">
              Let's explore your PDF
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
              {hasDocument
                ? "Your document is ready. Ask a question and I'll find the relevant information."
                : "Upload a PDF to get started. I'll help you understand its contents."}
            </p>

            <div className="mt-6 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={!hasDocument || loading}
                  onClick={() => setInput(suggestion)}
                  className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {messages.map((msg, idx) => (
              <Message key={idx} sender={msg.sender} text={msg.text} />
            ))}

            {loading && (
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-xs font-bold text-white">
                  AI
                </div>

                <div className="flex items-center gap-2 rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:150ms]" />
                  <span className="h-2 w-2 animate-bounce rounded-full bg-indigo-500 [animation-delay:300ms]" />
                  <span className="ml-1 text-xs text-slate-500">
                    Thinking...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-100 bg-white p-4 sm:px-5">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-2 transition focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasDocument
                ? "Ask something about your PDF..."
                : "Upload a PDF to start chatting..."
            }
            disabled={!hasDocument || loading}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-slate-700 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!hasDocument || !input.trim() || loading}
            aria-label="Send message"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>

        <p className="mt-2 text-center text-[11px] text-slate-400">
          AI responses are generated using your uploaded PDF.
        </p>
      </div>
    </div>
  );
}
