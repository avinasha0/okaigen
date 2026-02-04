import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);

  const bots = await prisma.bot.findMany({
    where: { userId: ownerId },
    select: { id: true },
  });
  const botIds = bots.map((b) => b.id);

  if (botIds.length === 0) {
    return NextResponse.json({ counts: {} });
  }

  const [chunkGroups, chatGroups, leadGroups] = await Promise.all([
    prisma.chunk.groupBy({
      by: ["botId"],
      where: { botId: { in: botIds } },
      _count: { _all: true },
    }),
    prisma.chat.groupBy({
      by: ["botId"],
      where: { botId: { in: botIds } },
      _count: { _all: true },
    }),
    prisma.lead.groupBy({
      by: ["botId"],
      where: { botId: { in: botIds } },
      _count: { _all: true },
    }),
  ]);

  const counts: Record<string, { chunks: number; chats: number; leads: number }> = {};
  for (const id of botIds) {
    counts[id] = { chunks: 0, chats: 0, leads: 0 };
  }
  for (const g of chunkGroups) counts[g.botId].chunks = g._count._all;
  for (const g of chatGroups) counts[g.botId].chats = g._count._all;
  for (const g of leadGroups) counts[g.botId].leads = g._count._all;

  return NextResponse.json({ counts }, { headers: { "Cache-Control": "private, max-age=15" } });
}
