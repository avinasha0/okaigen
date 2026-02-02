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
      expiresAt: Date.now() + (ttlMs || this.ttl),
    });
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

/**
 * Generate cache key from text (normalized)
 */
export function normalizeCacheKey(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, " ");
}
