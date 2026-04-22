import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import { unseal } from "@/lib/crypto-seal";

type CachedTransport = {
  transporter: nodemailer.Transporter | null;
  from: string;
  cachedAtMs: number;
};

let cached: CachedTransport | null = null;
const CACHE_TTL_MS = 60_000;

async function getTransport(): Promise<CachedTransport> {
  const now = Date.now();
  if (cached && now - cached.cachedAtMs < CACHE_TTL_MS) return cached;

  // 1) Prefer DB-backed SMTP config (superadmin)
  try {
    const cfg = await prisma.smtpConfig.findUnique({ where: { name: "default" } });
    if (cfg) {
      const pass = cfg.passwordEnc ? unseal(cfg.passwordEnc) : null;
      const transporter = nodemailer.createTransport({
        host: cfg.host,
        port: cfg.port,
        secure: cfg.secure,
        auth: cfg.username ? { user: cfg.username, pass: pass ?? "" } : undefined,
      });
      const from = cfg.fromEmail || process.env.EMAIL_FROM || process.env.CONTACT_EMAIL || "noreply@sitebotgpt.com";
      cached = { transporter, from, cachedAtMs: now };
      return cached;
    }
  } catch {
    // ignore and fallback to env
  }

  // 2) Fallback to legacy EMAIL_SERVER URL (env)
  const url = process.env.EMAIL_SERVER;
  if (!url) {
    cached = { transporter: null, from: process.env.EMAIL_FROM || process.env.CONTACT_EMAIL || "noreply@sitebotgpt.com", cachedAtMs: now };
    return cached;
  }
  try {
    const transporter = nodemailer.createTransport(url);
    const from = process.env.EMAIL_FROM || process.env.CONTACT_EMAIL || "noreply@sitebotgpt.com";
    cached = { transporter, from, cachedAtMs: now };
    return cached;
  } catch {
    cached = { transporter: null, from: process.env.EMAIL_FROM || process.env.CONTACT_EMAIL || "noreply@sitebotgpt.com", cachedAtMs: now };
    return cached;
  }
}

/** Send a plain text email. Returns true if sent, false if EMAIL_SERVER not configured or send failed. */
export async function sendEmail(options: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<boolean> {
  const { transporter, from } = await getTransport();
  if (!transporter) return false;
  try {
    await transporter.sendMail({
      from,
      to: options.to,
      replyTo: options.replyTo,
      subject: options.subject,
      text: options.text});
    return true;
  } catch (e) {
    console.error("sendEmail error:", e);
    return false;
  }
}
