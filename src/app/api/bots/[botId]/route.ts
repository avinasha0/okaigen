import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotForUser, getEffectiveOwnerId } from "@/lib/team";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  greetingMessage: z.string().optional(),
  tone: z.enum(["formal", "friendly", "casual"]).optional(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
  leadCaptureTrigger: z.enum(["uncertain", "always", "never"]).optional(),
  humanFallbackMessage: z.string().optional(),
  quickPrompts: z.string().optional().nullable(),
  removeBranding: z.boolean().optional()});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { botId } = await params;

  const bot = await getBotForUser(session.user.id, botId);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const fullBot = await prisma.Bot.findUnique({
    where: { id: bot.id },
    include: {
      source: true,
      _count: { select: { chunk: true, chat: true, lead: true } }}});
  return NextResponse.json(fullBot);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { botId } = await params;

  const bot = await getBotForUser(session.user.id, botId);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    if (data.removeBranding === true) {
      const ownerId = await getEffectiveOwnerId(session.user.id);
      const owner = await prisma.User.findUnique({
        where: { id: ownerId },
        select: { removeBrandingAddOn: true }});
      if (!owner?.removeBrandingAddOn) {
        return NextResponse.json(
          { error: "Remove SiteBotGPT branding add-on is required. Get this add-on from Pricing or Contact us." },
          { status: 403 }
        );
      }
    }

    const updated = await prisma.Bot.update({
      where: { id: botId },
      data});

    return NextResponse.json(updated);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update bot" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { botId } = await params;

  const bot = await getBotForUser(session.user.id, botId);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  await prisma.Bot.delete({
    where: { id: botId }});

  return NextResponse.json({ success: true });
}
