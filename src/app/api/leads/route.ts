import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const leadSchema = z.object({
  botId: z.string(),
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
      botId: bot.id,
      name: data.name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      pageUrl: data.pageUrl,
    },
  });

  return NextResponse.json({ id: lead.id });
}

/** GET all leads for the current user's bots (auth required) */
export async function GET(_req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bots = await prisma.bot.findMany({
    where: { userId: session.user.id },
    select: { id: true, name: true },
  });
  const botIds = bots.map((b) => b.id);
  const botMap = Object.fromEntries(bots.map((b) => [b.id, b.name]));

  const leads = await prisma.lead.findMany({
    where: { botId: { in: botIds } },
    orderBy: { createdAt: "desc" },
  });

  const leadsWithBot = leads.map((l) => ({
    ...l,
    botName: botMap[l.botId] ?? "Unknown",
  }));

  return NextResponse.json(leadsWithBot);
}
