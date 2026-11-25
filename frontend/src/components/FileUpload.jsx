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
    <div className="w-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">Your Document</h2>
          <p className="mt-1 text-xs text-slate-500">
            Upload a PDF to start asking questions
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            className="h-5 w-5"
          >
            <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
            <path d="M14 3v5h5M9 13h6m-6 4h6" />
          </svg>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Dropzone */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            if (!uploading) setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => !uploading && inputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-4 py-8 text-center transition ${
            dragging
              ? "border-indigo-500 bg-indigo-50"
              : "border-slate-300 bg-slate-50 hover:border-indigo-400 hover:bg-indigo-50/50"
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

          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-white text-indigo-600 shadow-sm">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              className="h-6 w-6"
            >
              <path d="M12 16V4m0 0L7 9m5-5 5 5" />
              <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
            </svg>
          </div>

          <p className="text-sm font-semibold text-slate-700">
            {dragging ? "Drop your PDF here" : "Click to browse or drag & drop"}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            PDF documents only · Maximum size 10MB
          </p>
        </div>

        {/* Selected file */}
        {file && (
          <div className="flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-red-500">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v5h5" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {file.name}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
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
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white hover:text-red-500"
                aria-label="Remove selected file"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Progress */}
        {uploading && (
          <div>
            <div className="mb-2 flex justify-between text-xs text-slate-500">
              <span>Uploading document...</span>
              <span>{progress}%</span>
            </div>

            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-2 text-xs text-slate-400">
              The server may continue indexing after the file upload finishes.
            </p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={!file || uploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {uploading ? "Processing PDF..." : "Upload & Index PDF"}
        </button>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 px-3 py-2.5 text-xs font-medium text-red-600">
          {error}
        </div>
      )}

      {/* Active document */}
      {activeDoc && (
        <div className="mt-5 border-t border-slate-100 pt-4">
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-emerald-700">
              Currently indexed
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-xl bg-emerald-50/70 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-600">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.7"
                className="h-5 w-5"
              >
                <path d="M7 3h7l5 5v13H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z" />
                <path d="M14 3v5h5" />
              </svg>
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {activeDoc.fileName}
              </p>
              <p className="mt-0.5 text-xs text-slate-500">
                {activeDoc.chunkCount} chunks indexed
              </p>
            </div>

            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              Ready
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
