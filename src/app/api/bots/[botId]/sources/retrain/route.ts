import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** Set a source to pending and delete its chunks so it can be re-trained. */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { botId } = await params;
  const body = await req.json().catch(() => ({}));
  const sourceId = body.sourceId as string;

  if (!sourceId) {
    return NextResponse.json({ error: "sourceId required" }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

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
