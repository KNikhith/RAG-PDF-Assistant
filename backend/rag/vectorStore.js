import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { createEmbeddings } from "./embeddings.js";

let activeVectorStore = null;
let embeddingsInstance = null;

export async function indexDocuments(splitDocs) {
  if (!embeddingsInstance) {
    embeddingsInstance = await createEmbeddings();
  }

  activeVectorStore = await MemoryVectorStore.fromDocuments(
    splitDocs,
    embeddingsInstance,
  );

  return activeVectorStore;
}

export async function retrieveRelevantContext(question, topK = 3) {
  if (!activeVectorStore) {
    throw new Error("No document indexed yet. Please upload a PDF first.");
  }

  const retriever = activeVectorStore.asRetriever(topK);
  const docs = await retriever.invoke(question);

  return docs.map((doc) => doc.pageContent).join("\n\n---\n\n");
}
