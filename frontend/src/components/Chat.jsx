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

  const suggestions = [
    "Summarize this document",
    "What are the key points?",
    "Extract core entities & dates",
  ];

  return (
    <div className="flex h-full min-h-0 w-full flex-col">
      {/* Scrollable Conversation Area */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-10">
        {messages.length === 0 ? (
          <div className="mx-auto flex h-full max-w-2xl flex-col items-center justify-center text-center">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-200/90 bg-white text-zinc-900 shadow-2xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5 text-indigo-600"
              >
                <path d="M12 3v3m0 12v3M3 12h3m12 0h3M5.64 5.64l2.12 2.12m8.48 8.48 2.12 2.12m0-12.72-2.12 2.12m-8.48 8.48-2.12 2.12" />
                <circle cx="12" cy="12" r="4" />
              </svg>
            </div>

            <h2 className="text-2xl font-medium tracking-tight text-zinc-950">
              {hasDocument
                ? "Ask anything about your PDF"
                : "Ready when your PDF is"}
            </h2>

            <p className="mt-2 max-w-md text-sm leading-relaxed text-zinc-500">
              {hasDocument
                ? "Your document is indexed in local vector memory. Query specific sections, summaries, or details."
                : "Upload a PDF in the left sidebar to begin grounded document retrieval."}
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  disabled={!hasDocument || loading}
                  onClick={() => setInput(suggestion)}
                  className="rounded-full border border-zinc-200/90 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 shadow-2xs transition hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950 disabled:cursor-not-allowed disabled:opacity-45"
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
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-zinc-950 text-[11px] font-semibold text-white">
                  AI
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl border border-zinc-200/80 bg-white px-4 py-3 shadow-2xs">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-400 [animation-delay:300ms]" />
                  <span className="ml-1.5 text-xs text-zinc-500">
                    Retrieving context...
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Floating Composer Bar */}
      <div className="shrink-0 bg-gradient-to-t from-[#FAF9F6] via-[#FAF9F6]/95 to-transparent px-4 pt-2 pb-5 sm:px-8 lg:px-10">
        <form
          onSubmit={handleSend}
          className="mx-auto flex max-w-3xl items-center gap-2 rounded-2xl border border-zinc-200/90 bg-white p-2 shadow-[0_8px_30px_-10px_rgba(24,24,27,0.08)] transition focus-within:border-zinc-400 focus-within:ring-4 focus-within:ring-zinc-900/5"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              hasDocument
                ? "Ask a question about your document..."
                : "Upload a PDF to start chatting..."
            }
            disabled={!hasDocument || loading}
            className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 disabled:cursor-not-allowed"
          />

          <button
            type="submit"
            disabled={!hasDocument || !input.trim() || loading}
            aria-label="Send message"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-zinc-950 text-white transition hover:bg-zinc-800 active:scale-95 disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-400"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="m22 2-7 20-4-9-9-4Z" />
              <path d="M22 2 11 13" />
            </svg>
          </button>
        </form>

        <p className="mt-2.5 text-center text-[11px] text-zinc-400">
          Responses are grounded in your indexed PDF chunks.
        </p>
      </div>
    </div>
  );
}
