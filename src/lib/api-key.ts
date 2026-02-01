import { createHash, randomBytes } from "crypto";

const PREFIX = "sk_live_";

/** Generate a new API key. Returns { rawKey, prefix, hash }. Store hash and prefix; show rawKey to user once. */
export function generateApiKey(): { rawKey: string; prefix: string; hash: string } {
  const secret = randomBytes(24).toString("base64url");
  const rawKey = `${PREFIX}${secret}`;
  const prefix = `${PREFIX}${secret.slice(0, 8)}`;
  const hash = createHash("sha256").update(rawKey).digest("hex");
  return { rawKey, prefix, hash };
}

/** Hash an API key for lookup. */
export function hashApiKey(key: string): string {
  return createHash("sha256").update(key.trim()).digest("hex");
}

/** Check if a string looks like our API key format. */
export function isApiKeyFormat(value: string): boolean {
  return value.startsWith(PREFIX) && value.length > PREFIX.length + 8;
}
