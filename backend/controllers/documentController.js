import multer from "multer";
import fs from "fs";
import path from "path";
import DocumentModel from "../models/Document.js";
import { loadPDFDocuments } from "../rag/documentLoader.js";
import { splitDocuments } from "../rag/textSplitter.js";
import { indexDocuments } from "../rag/vectorStore.js";

const uploadDir = "uploads";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const safeName = file.originalname.replace(/\s+/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const fileFilter = (_req, file, cb) => {
  if (file.mimetype === "application/pdf") {
    cb(null, true);
  } else {
    cb(new Error("Only PDF files are allowed"), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Please upload a PDF file." });
    }

    const filePath = path.resolve(req.file.path);
    const rawDocs = await loadPDFDocuments(filePath);
    const chunks = await splitDocuments(rawDocs);
    await indexDocuments(chunks);

    const savedDoc = await DocumentModel.create({
      fileName: req.file.originalname,
      filePath: req.file.path,
      chunkCount: chunks.length,
    });

    return res.status(201).json({
      message: "PDF processed and indexed successfully",
      document: savedDoc,
    });
  } catch (error) {
    console.error("Upload Error:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to process PDF" });
  }
};
