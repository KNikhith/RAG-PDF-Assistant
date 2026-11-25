import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

export async function loadPDFDocuments(filePath) {
  const loader = new PDFLoader(filePath);
  return await loader.load();
}
