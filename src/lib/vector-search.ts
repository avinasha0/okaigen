export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
  return magnitude === 0 ? 0 : dotProduct / magnitude;
}

export interface VectorResult {
  chunkId: string;
  content: string;
  metadata: Record<string, unknown>;
  similarity: number;
}

/**
 * Adaptive vector search with score windowing.
 * Returns chunks where similarity >= (top_score - 0.1), up to maxChunks.
 * This adapts automatically: if top score is 0.8, includes all chunks >= 0.7.
 * If top score is 0.4, includes all chunks >= 0.3.
 */
export function searchVectors(
  queryEmbedding: number[],
  chunks: { id: string; content: string; metadata: unknown; vector: number[] }[],
  maxChunks: number = 10,
  minSimilarity: number = 0.3 // Hard floor: minimum similarity to consider
): VectorResult[] {
  const results = chunks
    .map((chunk) => ({
      chunkId: chunk.id,
      content: chunk.content,
      metadata: (chunk.metadata as Record<string, unknown>) || {},
      similarity: cosineSimilarity(queryEmbedding, chunk.vector)}))
    .filter((r) => typeof r.similarity === "number" && !Number.isNaN(r.similarity) && r.similarity >= minSimilarity)
    .sort((a, b) => b.similarity - a.similarity);

  if (results.length === 0) return [];

  // Adaptive windowing: take all chunks within 0.1 of top score
  const topScore = results[0].similarity;
  const scoreWindow = Math.max(minSimilarity, topScore - 0.1);

  const windowedResults = results
    .filter((r) => r.similarity >= scoreWindow)
    .slice(0, maxChunks);

  return windowedResults;
}
