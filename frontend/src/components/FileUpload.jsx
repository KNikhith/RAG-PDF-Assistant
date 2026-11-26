import { useRef, useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:5000/api";
const MAX_FILE_SIZE = 10 * 1024 * 1024;

export default function FileUpload({ activeDoc, onUploaded }) {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);

  const inputRef = useRef(null);

  const selectFile = (selectedFile) => {
    setError("");
    setProgress(0);

    if (!selectedFile) return;

    if (
      selectedFile.type !== "application/pdf" &&
      !selectedFile.name.toLowerCase().endsWith(".pdf")
    ) {
      setError("Please select a PDF file.");
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setError("File size must be less than 10MB.");
      return;
    }

    setFile(selectedFile);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || uploading) return;

    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setError("");
    setProgress(0);

    try {
      const res = await axios.post(`${API_BASE}/documents/upload`, formData, {
        onUploadProgress: (event) => {
          if (event.total) {
            setProgress(Math.round((event.loaded * 100) / event.total));
          }
        },
      });

      onUploaded(res.data.document);
      setFile(null);
      setProgress(100);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    } catch (err) {
      setError(
        err.response?.data?.error || "Failed to upload PDF. Please try again.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);

    if (!uploading) {
      selectFile(e.dataTransfer.files?.[0]);
    }
  };

  const formatSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(1)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  return (
    <div className="w-full space-y-4">
      <form onSubmit={handleSubmit} className="space-y-3.5">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`group flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed px-4 py-8 text-center transition-all ${
            dragging
              ? "border-indigo-400 bg-indigo-500/10"
              : "border-zinc-700/90 bg-[#121215] hover:border-zinc-500 hover:bg-[#17171B]"
          } ${uploading ? "cursor-not-allowed opacity-60" : ""}`}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,application/pdf"
            disabled={uploading}
            onChange={(e) => selectFile(e.target.files?.[0])}
            onClick={(e) => e.stopPropagation()}
            className="hidden"
          />

          <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-300 transition-colors group-hover:border-indigo-500/40 group-hover:text-indigo-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-5 w-5"
            >
              <path d="M12 16V4m0 0L7 9m5-5 5 5" />
              <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
          </div>

          <p className="text-sm font-medium text-zinc-200">
            {dragging ? "Drop PDF to stage" : "Click to browse or drop PDF"}
          </p>

          <p className="mt-1 text-[11px] text-zinc-500">PDF only · Max 10MB</p>
        </div>

        {/* Selected File Preview */}
        {file && (
          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#141418] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 text-indigo-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v5h5" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-100">
                {file.name}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {formatSize(file.size)}
              </p>
            </div>

            {!uploading && (
              <button
                type="button"
                onClick={() => {
                  setFile(null);
                  if (inputRef.current) inputRef.current.value = "";
                }}
                className="rounded-lg px-2 py-1 text-xs text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-200"
                aria-label="Remove selected file"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Upload Progress */}
        {uploading && (
          <div className="rounded-xl border border-zinc-800 bg-[#121215] p-3">
            <div className="mb-2 flex justify-between text-[11px] text-zinc-400">
              <span>Uploading & indexing...</span>
              <span className="font-mono text-zinc-200">{progress}%</span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-zinc-800">
              <div
                className="h-full rounded-full bg-indigo-500 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-[11px] text-zinc-500">
              Server chunking may continue briefly after upload completes.
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-semibold text-zinc-950 shadow-sm transition hover:bg-zinc-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500"
        >
          {uploading ? "Processing PDF..." : "Upload & Index PDF"}
        </button>
      </form>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2.5 text-xs font-medium text-rose-300">
          {error}
        </div>
      )}

      {/* Active Indexed Document */}
      {activeDoc && (
        <div className="border-t border-zinc-800/80 pt-4">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              <span className="text-[11px] font-medium uppercase tracking-wider text-zinc-400">
                Active Index
              </span>
            </div>
            <span className="rounded-md border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
              Ready
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl border border-zinc-800 bg-[#121215] p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-4 w-4"
              >
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v5h5" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-zinc-100">
                {activeDoc.fileName}
              </p>
              <p className="mt-0.5 text-[11px] text-zinc-500">
                {activeDoc.chunkCount} chunks indexed
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
