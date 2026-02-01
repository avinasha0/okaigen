import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlanUsage } from "@/lib/plan-usage";
import { canViewAnalytics } from "@/lib/plans-config";
import { getBotForUser } from "@/lib/team";
import { startOfDay, subDays } from "date-fns";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const planUsage = await getPlanUsage(session.user.id);
  if (!planUsage || !canViewAnalytics(planUsage.planName)) {
    return NextResponse.json(
      { error: "Analytics not available on your plan. Upgrade to view analytics." },
      { status: 403 }
    );
  }

  const { botId } = await params;

  const bot = await getBotForUser(session.user.id, botId);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const { searchParams } = new URL(req.url);
  const days = Math.min(parseInt(searchParams.get("days") || "30", 10), 90);
  const since = subDays(new Date(), days);

  const [
    totalChats,
    totalLeads,
    usageLogs,
    topQuestions,
    sourceStats,
  ] = await Promise.all([
    prisma.chat.count({
      where: { botId, createdAt: { gte: since } },
    }),
    prisma.lead.count({
      where: { botId, createdAt: { gte: since } },
    }),
    prisma.usageLog.findMany({
      where: {
        botId,
        type: "message",
        createdAt: { gte: since },
      },
      select: { createdAt: true, count: true },
    }),
    prisma.chatMessage.findMany({
      where: {
        chat: { botId },
        role: "user",
        createdAt: { gte: since },
      },
      select: { content: true },
      take: 200,
    }),
    prisma.chunk.groupBy({
      by: ["sourceId"],
      where: { botId },
      _count: true,
    }),
  ]);

  const dailyMap: Record<string, number> = {};
  for (let i = 0; i < days; i++) {
    const d = startOfDay(subDays(new Date(), i));
    dailyMap[d.toISOString().split("T")[0]] = 0;
  }
  for (const u of usageLogs) {
    const key = startOfDay(u.createdAt).toISOString().split("T")[0];
    dailyMap[key] = (dailyMap[key] || 0) + u.count;
  }

  const questionCounts: Record<string, number> = {};
  for (const q of topQuestions) {
    const normalized = q.content.trim().slice(0, 100);
    questionCounts[normalized] = (questionCounts[normalized] || 0) + 1;
  }

  const topQ = Object.entries(questionCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([question, count]) => ({ question, count }));

  const sourceIds = sourceStats.map((s) => s.sourceId);
  const sources = await prisma.source.findMany({
    where: { id: { in: sourceIds } },
    select: { id: true, title: true, url: true },
  });
  const sourceMap = Object.fromEntries(sources.map((s) => [s.id, s]));

  const sourcesUsed = sourceStats.map((s) => ({
    ...sourceMap[s.sourceId],
    chunkCount: s._count,
  }));

  return NextResponse.json({
    totalChats,
    totalLeads,
    dailyUsage: Object.entries(dailyMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([date, count]) => ({ date, count })),
    topQuestions: topQ,
    sourcesUsed,
  });
}
