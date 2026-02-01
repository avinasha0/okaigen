import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";
import { getPlanUsage } from "@/lib/plan-usage";
import { hasApiAccess } from "@/lib/plans-config";
import { generateApiKey } from "@/lib/api-key";
import { z } from "zod";

/** List API keys for the current account (owner). Keys show prefix only, never the secret. */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ownerId = await getEffectiveOwnerId(session.user.id);
  const keys = await prisma.apiKey.findMany({
    where: { userId: ownerId },
    select: { id: true, name: true, keyPrefix: true, lastUsedAt: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ keys });
}

const createSchema = z.object({ name: z.string().min(1).max(255) });

/** Create a new API key. Requires Scale or Enterprise plan. Returns the raw secret only in this response; it is never stored or returned again. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ownerId = await getEffectiveOwnerId(session.user.id);
  const planUsage = await getPlanUsage(ownerId);
  const planName = planUsage?.planName ?? "Starter";
  if (!hasApiAccess(planName)) {
    return NextResponse.json(
      { error: "API access is not included in your plan. Upgrade to Scale or Enterprise." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Name is required (1–255 characters)" }, { status: 400 });
  }

  const { rawKey, prefix, hash } = generateApiKey();
  const key = await prisma.apiKey.create({
    data: { userId: ownerId, name: parsed.data.name, keyPrefix: prefix, keyHash: hash },
    select: { id: true, name: true, keyPrefix: true, createdAt: true },
  });
  return NextResponse.json({
    key: { id: key.id, name: key.name, keyPrefix: key.keyPrefix, createdAt: key.createdAt },
    secret: rawKey, // Returned only once; never stored in DB or returned again (GET returns prefix only).
  });
}
