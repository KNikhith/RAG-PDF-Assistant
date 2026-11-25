import { pipeline } from "@xenova/transformers";

let extractor;

export async function createEmbeddings() {
  if (!extractor) {
    extractor = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");
  }

  return {
    async embedDocuments(texts) {
      const results = [];

      for (const text of texts) {
        const output = await extractor(text, {
          pooling: "mean",
          normalize: true,
        });

        results.push(Array.from(output.data));
      }

      return results;
    },

    async embedQuery(text) {
      const output = await extractor(text, {
        pooling: "mean",
        normalize: true,
      });

      return Array.from(output.data);
    },
  };
}
