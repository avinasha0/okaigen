const store = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(
  key: string,
  limit: number = 60,
  windowMs: number = 60000
): { success: boolean; remaining: number } {
  const now = Date.now();
  const record = store.get(key);

  if (!record) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  if (now > record.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { success: true, remaining: limit - 1 };
  }

  record.count++;
  if (record.count > limit) {
    return { success: false, remaining: 0 };
  }

  return { success: true, remaining: limit - record.count };
}
