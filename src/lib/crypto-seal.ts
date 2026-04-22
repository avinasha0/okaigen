import crypto from "node:crypto";

type SealedPayload = {
  v: 1;
  alg: "aes-256-gcm";
  iv: string; // base64
  tag: string; // base64
  data: string; // base64
};

function getKey(): Buffer {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET is required to encrypt/decrypt SMTP password");
  }
  return crypto.createHash("sha256").update(secret, "utf8").digest();
}

export function seal(plaintext: string): string {
  const key = getKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const ciphertext = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  const payload: SealedPayload = {
    v: 1,
    alg: "aes-256-gcm",
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: ciphertext.toString("base64"),
  };

  return JSON.stringify(payload);
}

export function unseal(sealedText: string): string {
  const key = getKey();
  const parsed = JSON.parse(sealedText) as Partial<SealedPayload>;
  if (parsed.v !== 1 || parsed.alg !== "aes-256-gcm" || !parsed.iv || !parsed.tag || !parsed.data) {
    throw new Error("Invalid sealed payload");
  }

  const iv = Buffer.from(parsed.iv, "base64");
  const tag = Buffer.from(parsed.tag, "base64");
  const data = Buffer.from(parsed.data, "base64");

  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const plaintext = Buffer.concat([decipher.update(data), decipher.final()]);
  return plaintext.toString("utf8");
}

