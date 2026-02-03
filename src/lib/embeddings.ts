import { openai, EMBEDDING_MODEL } from "./openai";
import { embeddingCache, normalizeCacheKey } from "./cache";

export async function generateEmbedding(text: string): Promise<number[]> {
  // Optimization: Cache embeddings (same query = same embedding)
  const cacheKey = normalizeCacheKey(text);
  const cached = embeddingCache.get(cacheKey);
  if (cached) {
    return cached;
  }

  // Optimization: Add timeout and error handling for faster failure
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: text.slice(0, 8000), // API limit
  }, {
    timeout: 20000, // 20 second timeout
  });
  
  const embedding = response.data[0].embedding;
  embeddingCache.set(cacheKey, embedding);
  return embedding;
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  if (texts.length === 0) return [];
  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts.map((t) => t.slice(0, 8000))});
  return response.data.sort((a, b) => a.index - b.index).map((d) => d.embedding);
}
