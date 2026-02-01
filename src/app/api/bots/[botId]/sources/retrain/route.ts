import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotForUser } from "@/lib/team";
import { getPlanUsage } from "@/lib/plan-usage";
import { canManualRefresh } from "@/lib/plans-config";

/** Set a source to pending and delete its chunks so it can be re-trained. Growth+ only (Starter cannot manual refresh). */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planUsage = await getPlanUsage(session.user.id);
  const planName = planUsage?.planName ?? "Starter";
  if (!canManualRefresh(planName)) {
    return NextResponse.json(
      { error: "Manual refresh is not available on your plan. Upgrade to retrain sources." },
      { status: 403 }
    );
  }

  const { botId } = await params;
  const body = await req.json().catch(() => ({}));
  const sourceId = body.sourceId as string;

  if (!sourceId) {
    return NextResponse.json({ error: "sourceId required" }, { status: 400 });
  }

  const bot = await getBotForUser(session.user.id, botId);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const source = await prisma.source.findFirst({
    where: { id: sourceId, botId },
  });

  if (!source) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  const chunks = await prisma.chunk.findMany({
    where: { sourceId },
    select: { id: true },
  });
  const chunkIds = chunks.map((c) => c.id);

  await prisma.embedding.deleteMany({ where: { chunkId: { in: chunkIds } } });
  await prisma.chunk.deleteMany({ where: { sourceId } });
  await prisma.source.update({
    where: { id: sourceId },
    data: { status: "pending", error: null },
  });

  return NextResponse.json({ success: true });
}
