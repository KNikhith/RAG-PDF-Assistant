import express from "express";
import { upload, uploadDocument } from "../controllers/documentController.js";

const router = express.Router();
router.post("/upload", upload.single("file"), uploadDocument);

export default router;
