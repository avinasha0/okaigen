import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  greetingMessage: z.string().optional(),
  tone: z.enum(["formal", "friendly", "casual"]).optional(),
  confidenceThreshold: z.number().min(0).max(1).optional(),
  leadCaptureTrigger: z.enum(["uncertain", "always", "never"]).optional(),
  humanFallbackMessage: z.string().optional(),
  quickPrompts: z.string().optional().nullable(),
});

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { botId } = await params;

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: session.user.id },
    include: {
      sources: true,
      _count: { select: { chunks: true, chats: true, leads: true } },
    },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  return NextResponse.json(bot);
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

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data = updateSchema.parse(body);

    const updated = await prisma.bot.update({
      where: { id: botId },
      data,
    });

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

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  await prisma.bot.delete({
    where: { id: botId },
  });

  return NextResponse.json({ success: true });
}
