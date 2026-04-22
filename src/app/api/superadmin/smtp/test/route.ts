import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/superadmin";
import { unseal } from "@/lib/crypto-seal";

export const runtime = "nodejs";

const schema = z.object({
  to: z.string().email(),
});

export async function POST(req: Request) {
  const gate = await requireSuperadmin();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const cfg = await prisma.smtpConfig.findUnique({ where: { name: "default" } });
  if (!cfg) {
    return NextResponse.json({ error: "SMTP is not configured" }, { status: 400 });
  }

  const pass = cfg.passwordEnc ? unseal(cfg.passwordEnc) : null;
  if (cfg.username && !pass) {
    return NextResponse.json({ error: "SMTP password is not set" }, { status: 400 });
  }

  const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    secure: cfg.secure,
    auth: cfg.username ? { user: cfg.username, pass: pass ?? "" } : undefined,
  });

  try {
    await transporter.verify();
  } catch (e) {
    return NextResponse.json(
      { error: "SMTP verify failed", details: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }

  const from = cfg.fromEmail || process.env.EMAIL_FROM || "noreply@sitebotgpt.com";
  try {
    await transporter.sendMail({
      from,
      to: parsed.data.to,
      subject: "SMTP test from Superadmin",
      text: "This is a test email to verify your SMTP settings.",
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json(
      { error: "Send failed", details: e instanceof Error ? e.message : String(e) },
      { status: 400 }
    );
  }
}

