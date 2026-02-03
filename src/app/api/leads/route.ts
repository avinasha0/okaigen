import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generateId } from "@/lib/utils";
import { z } from "zod";

const leadSchema = z.object({
  botId: z.string(),
  chatId: z.string().optional(),
  name: z.string().optional(),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().optional(),
  pageUrl: z.string().url().optional(),
});

/** POST: Submit lead from chat widget (public) */
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const parsed = leadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
  const data = parsed.data;

  const bot = await prisma.bot.findFirst({
    where: data.botId.startsWith("atlas_")
      ? { publicKey: data.botId }
      : { id: data.botId },
  });
  if (!bot) {
    return NextResponse.json(
      { error: "Bot not found. Use the embed code from Dashboard → your bot → Embed code." },
      { status: 400 }
    );
  }

  const lead = await prisma.lead.create({
    data: {
      id: generateId(),
      botId: bot.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      pageUrl: data.pageUrl,
    },
  });

  if (data.chatId && (data.name || data.email)) {
    await prisma.chat.updateMany({
      where: { id: data.chatId, botId: bot.id },
      data: {
        visitorName: data.name ?? undefined,
        visitorEmail: data.email,
      },
    });
  }

  const { triggerWebhooks } = await import("@/lib/webhooks");
  triggerWebhooks(bot.userId, "lead.captured", {
    botId: bot.id,
    lead: {
      id: lead.id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      message: lead.message,
      pageUrl: lead.pageUrl,
      status: lead.status,
      createdAt: lead.createdAt,
    },
  }).catch(() => {});

  return NextResponse.json({ id: lead.id });
}

/** GET leads for the current user's bots (auth required). Paginated. Starter plan: returns empty. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { getPlanUsage } = await import("@/lib/plan-usage");
  const { canViewLeads } = await import("@/lib/plans-config");
  const { getEffectiveOwnerId } = await import("@/lib/team");
  const planUsage = await getPlanUsage(session.user.id);
  if (!planUsage || !canViewLeads(planUsage.planName)) {
    return NextResponse.json({ leads: [], total: 0, page: 1, limit: 50, totalPages: 0 });
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const bots = await prisma.bot.findMany({
    where: { userId: ownerId },
    select: { id: true, name: true },
  });
  const botIds = bots.map((b) => b.id);
  const botMap = Object.fromEntries(bots.map((b) => [b.id, b.name]));

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(Math.max(1, parseInt(searchParams.get("limit") || "50", 10)), 100);
  const skip = (page - 1) * limit;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where: { botId: { in: botIds } },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip,
      select: {
        id: true,
        botId: true,
        name: true,
        email: true,
        phone: true,
        message: true,
        pageUrl: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.count({ where: { botId: { in: botIds } } }),
  ]);

  const leadsWithBot = leads.map((l) => ({
    ...l,
    botName: botMap[l.botId] ?? "Unknown",
  }));

  const res = NextResponse.json({
    leads: leadsWithBot,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
  res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=10");
  return res;
}
