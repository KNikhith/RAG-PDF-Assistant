import { generateRAGAnswer } from "../rag/ragChain.js";

export const askPDFQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question is required." });
    }

    const answer = await generateRAGAnswer(question.trim());
    return res.status(200).json({ answer });
  } catch (error) {
    console.error("AI Query Error:", error);
    const status = error.message.includes("No document indexed") ? 400 : 500;
    return res
      .status(status)
      .json({ error: error.message || "Failed to generate answer" });
  }
};
