import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const botId = searchParams.get("botId");

  if (!botId) {
    return NextResponse.json({ error: "botId required" }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: botId.startsWith("atlas_")
      ? { publicKey: botId }
      : { id: botId },
    select: { greetingMessage: true, quickPrompts: true, removeBranding: true },
  });

  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  let prompts: string[] = [
    "What do you offer?",
    "How can I contact you?",
    "Tell me about your services",
    "What are your hours?",
  ];
  if (bot.quickPrompts) {
    try {
      const custom = JSON.parse(bot.quickPrompts) as unknown;
      if (Array.isArray(custom) && custom.length > 0) {
        prompts = custom.filter((p): p is string => typeof p === "string").slice(0, 6);
      }
    } catch {
      // use defaults
    }
  }

  return NextResponse.json({
    greeting: bot.greetingMessage,
    quickPrompts: prompts,
    hideBranding: bot.removeBranding === true,
  });
}
