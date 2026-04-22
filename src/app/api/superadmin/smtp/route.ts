import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { requireSuperadmin } from "@/lib/superadmin";
import { seal } from "@/lib/crypto-seal";

export const runtime = "nodejs";

const upsertSchema = z.object({
  host: z.string().min(1).max(255),
  port: z.number().int().min(1).max(65535),
  secure: z.boolean(),
  username: z.string().max(255).optional().nullable(),
  password: z.string().optional().nullable(),
  fromEmail: z.string().email().max(255).optional().nullable(),
});

export async function GET() {
  const gate = await requireSuperadmin();
  if (!gate.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cfg = await prisma.smtpConfig.findUnique({
    where: { name: "default" },
    select: {
      host: true,
      port: true,
      secure: true,
      username: true,
      fromEmail: true,
      updatedAt: true,
      passwordEnc: true,
    },
  });

  if (!cfg) {
    return NextResponse.json({
      config: null,
      hasPassword: false,
    });
  }

  return NextResponse.json({
    config: {
      host: cfg.host,
      port: cfg.port,
      secure: cfg.secure,
      username: cfg.username,
      fromEmail: cfg.fromEmail,
      updatedAt: cfg.updatedAt,
    },
    hasPassword: !!cfg.passwordEnc,
  });
}

export async function PUT(req: Request) {
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

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  const { host, port, secure, username, password, fromEmail } = parsed.data;

  const existing = await prisma.smtpConfig.findUnique({ where: { name: "default" }, select: { id: true } });
  const passwordEnc = typeof password === "string" && password.length > 0 ? seal(password) : undefined;

  if (!existing) {
    await prisma.smtpConfig.create({
      data: {
        name: "default",
        host,
        port,
        secure,
        username: username ?? null,
        passwordEnc: passwordEnc ?? null,
        fromEmail: fromEmail ?? null,
      },
    });
  } else {
    await prisma.smtpConfig.update({
      where: { name: "default" },
      data: {
        host,
        port,
        secure,
        username: username ?? null,
        fromEmail: fromEmail ?? null,
        ...(passwordEnc ? { passwordEnc } : {}),
      },
    });
  }

  return NextResponse.json({ ok: true });
}

