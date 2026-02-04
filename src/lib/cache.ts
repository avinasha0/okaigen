/**
 * Simple in-memory cache for embeddings and responses
 * For production, consider Redis or Vercel KV
 */

interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private ttl: number;

  constructor(ttlMs: number = 3600000) {
    // Default 1 hour TTL
    this.ttl = ttlMs;
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    return entry.value;
  }

  set(key: string, value: T, ttlMs?: number): void {
    this.cache.set(key, {
      value,
      expiresAt: Date.now() + (ttlMs || this.ttl)});
  }

  clear(): void {
    this.cache.clear();
  }

  size(): number {
    return this.cache.size;
  }
}

// Embedding cache: Cache query embeddings (same question = same embedding)
export const embeddingCache = new SimpleCache<number[]>(3600000); // 1 hour

// Response cache: Cache common question responses (5 minutes)
export const responseCache = new SimpleCache<{ response: string; sources: string[]; confidence: number }>(300000);

// Bot cache: Cache bot lookups (15 minutes)
export const botCache = new SimpleCache<any>(900000);

// Chat history cache: Cache recent message history by chatId (5 min) to speed up follow-up messages
export const chatHistoryCache = new SimpleCache<{ role: "user" | "assistant"; content: string }[]>(300000);

// Chunk count cache: Cache chunk counts per bot (10 min) to avoid repeated count queries
export const chunkCountCache = new SimpleCache<number>(600000);

// Request deduplication: Track in-flight requests to prevent duplicate processing
class RequestDeduplicator {
  private inFlight = new Map<string, Promise<any>>();

  async deduplicate<T>(key: string, fn: () => Promise<T>): Promise<T> {
    const existing = this.inFlight.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = fn().finally(() => {
      this.inFlight.delete(key);
    });

    this.inFlight.set(key, promise);
    return promise;
  }
}

export const requestDeduplicator = new RequestDeduplicator();

/**
 * Generate cache key from text (normalized)
 */
export function normalizeCacheKey(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}

// Context cache: Cache RAG context retrieval per query (5 minutes)
export const contextCache = new SimpleCache<{ chunks: { chunkId: string; content: string; metadata: Record<string, unknown>; similarity: number }[]; confidence: number }>(300000);
