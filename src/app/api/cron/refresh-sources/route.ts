import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getRefreshSchedule, hasAutoRefresh } from "@/lib/plans-config";

const CRON_SECRET = process.env.CRON_SECRET;

/** Returns interval in milliseconds: weekly = 7 days, daily = 1 day */
function getRefreshIntervalMs(schedule: "weekly" | "daily"): number {
  const days = schedule === "weekly" ? 7 : 1;
  return days * 24 * 60 * 60 * 1000;
}

/**
 * Cron endpoint: find completed sources due for auto-refresh (Scale = weekly, Enterprise = daily),
 * mark them pending, and trigger training. Call with header: x-cron-secret = CRON_SECRET.
 */
export async function POST(req: Request) {
  const headerSecret = req.headers.get("x-cron-secret");
  if (!CRON_SECRET || headerSecret !== CRON_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = Date.now();
  const botIdsToTrain = new Set<string>();

  // Get all bots with owner's plan
  const bots = await prisma.Bot.findMany({
    select: { id: true, userId: true }});

  for (const bot of bots) {
    const userPlan = await prisma.UserPlan.findUnique({
      where: { userId: bot.userId },
      include: { plan: true }});
    const planName = userPlan?.plan.name ?? "Starter";
    if (!hasAutoRefresh(planName)) continue;

    const schedule = getRefreshSchedule(planName);
    if (schedule !== "weekly" && schedule !== "daily") continue;

    const intervalMs = getRefreshIntervalMs(schedule);
    const cutoff = new Date(now - intervalMs);

    // Completed sources due for refresh: lastRefreshedAt (or createdAt if never set) before cutoff
    const sources = await prisma.Source.findMany({
      where: { botId: bot.id, status: "completed" },
      select: { id: true, lastRefreshedAt: true, createdAt: true }});
    const dueSources = sources.filter((s) => {
      const ref = s.lastRefreshedAt ?? s.createdAt;
      return ref < cutoff;
    });

    for (const source of dueSources) {
      const chunks = await prisma.Chunk.findMany({
        where: { sourceId: source.id },
        select: { id: true }});
      const chunkIds = chunks.map((c) => c.id);
      await prisma.Embedding.deleteMany({ where: { chunkId: { in: chunkIds } } });
      await prisma.Chunk.deleteMany({ where: { sourceId: source.id } });
      await prisma.Source.update({
        where: { id: source.id },
        data: { status: "pending", error: null }});
      botIdsToTrain.add(bot.id);
    }
  }

  // Trigger training for each bot that has pending sources
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const results: { botId: string; ok: boolean; status: number }[] = [];

  for (const botId of botIdsToTrain) {
    try {
      const res = await fetch(`${baseUrl.replace(/\/$/, "")}/api/bots/${botId}/train`, {
        method: "POST",
        headers: { "x-cron-secret": CRON_SECRET }});
      results.push({ botId, ok: res.ok, status: res.status });
    } catch (err) {
      results.push({ botId, ok: false, status: 0 });
    }
  }

  return NextResponse.json({
    ok: true,
    botsTriggered: botIdsToTrain.size,
    results});
}
