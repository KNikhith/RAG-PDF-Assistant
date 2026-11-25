import express from "express";
import { askPDFQuestion } from "../controllers/aiController.js";

const router = express.Router();
router.post("/ask", askPDFQuestion);

export default router;
