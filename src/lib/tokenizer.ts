// Simple token estimation - ~4 chars per token for English
// For production, consider tiktoken (adds significant bundle size)
export function estimateTokenCount(text: string): number {
  return Math.ceil(text.length / 4);
}

export const TARGET_CHUNK_TOKENS = 400;
export const MIN_CHUNK_TOKENS = 300;
export const MAX_CHUNK_TOKENS = 500;
