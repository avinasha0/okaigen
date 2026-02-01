import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/**
 * GET /api/db-test
 * Verifies MySQL/Prisma connection. Use after deploy to confirm DATABASE_URL and schema.
 * Safe to leave in production (returns only { db: "ok" } or 500).
 */
export async function GET() {
  try {
    const result = await prisma.$queryRaw<[{ ok: number }]>`SELECT 1 AS ok`;
    return NextResponse.json({ db: "ok", result });
  } catch (e) {
    console.error("DB test error:", e);
    return new NextResponse("DB error", { status: 500 });
  }
}
