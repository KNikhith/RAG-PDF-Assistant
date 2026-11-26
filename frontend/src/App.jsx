import { useState } from "react";
import FileUpload from "./components/FileUpload";
import Chat from "./components/Chat";

export default function App() {
  const [activeDoc, setActiveDoc] = useState(null);

  return (
    <div className="flex min-h-screen flex-col bg-[#FAF9F6] text-zinc-900 antialiased selection:bg-zinc-900 selection:text-white lg:h-screen lg:flex-row lg:overflow-hidden">
      {/* LEFT RAIL: Obsidian Sidebar */}
      <aside className="relative flex w-full shrink-0 flex-col justify-between border-b border-zinc-800/90 bg-[#0C0C0E] px-6 py-6 text-zinc-100 lg:w-[390px] lg:border-r lg:border-b-0 xl:w-[420px]">
        <div className="pointer-events-none absolute -top-24 -left-24 h-64 w-64 rounded-full bg-indigo-500/15 blur-3xl" />

        <div className="relative z-10 flex flex-col">
          {/* Brand Mark */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-b from-zinc-700 to-zinc-900 p-[1px] shadow-lg shadow-black/50">
                <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-[#121215]">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4 text-indigo-400"
                  >
                    <path d="M12 3v18" />
                    <path d="m19 9-7 7-7-7" />
                  </svg>
                </div>
              </div>

              <div>
                <span className="text-sm font-semibold tracking-tight text-white">
                  Aether<span className="text-zinc-500">.rag</span>
                </span>
                <p className="text-[11px] text-zinc-500">
                  Neural Document Engine
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 rounded-full border border-zinc-800 bg-zinc-900/90 px-2.5 py-1 text-[11px] font-medium text-zinc-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              Groq LPU
            </span>
          </div>

          {/* Section Title */}
          <div className="mt-8 mb-5">
            <h1 className="text-2xl font-medium tracking-tight text-white">
              Knowledge Base
            </h1>
            <p className="mt-1.5 text-xs leading-relaxed text-zinc-400">
              Index a PDF into local vector memory to synthesize answers with
              grounded retrieval.
            </p>
          </div>

          {/* Dark FileUpload */}
          <FileUpload activeDoc={activeDoc} onUploaded={setActiveDoc} />
        </div>

        {/* Bottom Metadata */}
        <div className="relative z-10 mt-8 hidden border-t border-zinc-800/80 pt-4 lg:block">
          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
            <div className="rounded-xl border border-zinc-800/80 bg-[#121215] px-3 py-2">
              <span className="block text-zinc-500">Embeddings</span>
              <span className="mt-0.5 block font-medium text-zinc-300">
                Local Vector Store
              </span>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-[#121215] px-3 py-2">
              <span className="block text-zinc-500">Inference</span>
              <span className="mt-0.5 block font-medium text-zinc-300">
                LangChain × Groq
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* RIGHT CANVAS: Editorial Workspace */}
      <main className="relative flex min-h-0 min-w-0 flex-1 flex-col bg-[#FAF9F6]">
        {/* Top Session Bar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-zinc-200/80 bg-[#FAF9F6]/85 px-6 backdrop-blur-md lg:px-10">
          <div className="flex min-w-0 items-center gap-3">
            <span className="text-[11px] font-semibold uppercase tracking-widest text-zinc-400">
              Session
            </span>
            <span className="text-zinc-300">/</span>

            {activeDoc ? (
              <div className="flex min-w-0 items-center gap-2">
                <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-500" />
                <span className="truncate text-sm font-medium text-zinc-900">
                  {activeDoc.fileName}
                </span>
                {typeof activeDoc.chunkCount === "number" && (
                  <span className="hidden rounded-md border border-zinc-200 bg-white px-2 py-0.5 font-mono text-[11px] text-zinc-500 sm:inline-block">
                    {activeDoc.chunkCount} chunks
                  </span>
                )}
              </div>
            ) : (
              <span className="text-sm text-zinc-400">
                No document attached
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {activeDoc && (
              <button
                type="button"
                onClick={() => setActiveDoc(null)}
                className="rounded-lg border border-zinc-200 bg-white px-2.5 py-1 text-xs font-medium text-zinc-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                Clear
              </button>
            )}
            <span className="hidden rounded-md border border-zinc-200/90 bg-white px-2 py-1 font-mono text-[11px] text-zinc-500 shadow-2xs sm:inline-block">
              RAG v2.0
            </span>
          </div>
        </header>

        {/* Seamless Chat Canvas */}
        <div className="flex min-h-0 flex-1 flex-col">
          <Chat hasDocument={Boolean(activeDoc)} />
        </div>
      </main>
    </div>
  );
}
