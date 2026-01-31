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

export function searchVectors(
  queryEmbedding: number[],
  chunks: { id: string; content: string; metadata: unknown; vector: number[] }[],
  topK: number = 5
): VectorResult[] {
  const results = chunks
    .map((chunk) => ({
      chunkId: chunk.id,
      content: chunk.content,
      metadata: (chunk.metadata as Record<string, unknown>) || {},
      similarity: cosineSimilarity(queryEmbedding, chunk.vector),
    }))
    .filter((r) => typeof r.similarity === "number" && !Number.isNaN(r.similarity) && r.similarity > 0)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topK);

  return results;
}
