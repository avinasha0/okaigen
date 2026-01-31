import {
  estimateTokenCount,
  TARGET_CHUNK_TOKENS,
  MIN_CHUNK_TOKENS,
  MAX_CHUNK_TOKENS,
} from "./tokenizer";

export interface ChunkMetadata {
  sourceUrl?: string;
  pageTitle?: string;
  documentName?: string;
}

export interface TextChunk {
  content: string;
  metadata: ChunkMetadata;
  tokenCount: number;
}

function splitIntoSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function chunkText(
  text: string,
  metadata: ChunkMetadata = {}
): TextChunk[] {
  const chunks: TextChunk[] = [];
  const sentences = splitIntoSentences(text);

  let currentChunk = "";
  let currentTokens = 0;

  for (const sentence of sentences) {
    const sentenceTokens = estimateTokenCount(sentence);
    const potentialTokens = currentTokens + sentenceTokens;

    if (
      currentChunk &&
      (potentialTokens > MAX_CHUNK_TOKENS ||
        (currentTokens >= MIN_CHUNK_TOKENS && potentialTokens > TARGET_CHUNK_TOKENS))
    ) {
      chunks.push({
        content: currentChunk.trim(),
        metadata,
        tokenCount: currentTokens,
      });
      currentChunk = sentence + " ";
      currentTokens = sentenceTokens;
    } else {
      currentChunk += sentence + " ";
      currentTokens = potentialTokens;
    }
  }

  if (currentChunk.trim()) {
    chunks.push({
      content: currentChunk.trim(),
      metadata,
      tokenCount: currentTokens,
    });
  }

  return chunks;
}
