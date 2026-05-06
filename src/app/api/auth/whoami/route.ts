import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

function redactDbUrl(url: string) {
  try {
    const u = new URL(url);
    if (u.password) u.password = "REDACTED";
    return u.toString();
  } catch {
    return "invalid DATABASE_URL";
  }
}

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false }, { status: 200 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true },
  });

  return NextResponse.json({
    authenticated: true,
    sessionUser: { id: session.user.id, email: session.user.email ?? null },
    dbUser: user ?? null,
    databaseUrl: process.env.DATABASE_URL ? redactDbUrl(process.env.DATABASE_URL) : null,
  });
}

