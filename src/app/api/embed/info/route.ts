import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Bot-Key, X-Atlas-Key, X-Visitor-Id, X-Page-Url",
};

function jsonWithCors(body: object, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  Object.entries(CORS_HEADERS).forEach(([k, v]) => res.headers.set(k, v));
  return res;
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const botId = searchParams.get("botId");

  if (!botId) {
    return jsonWithCors({ error: "botId required" }, { status: 400 });
  }

  const bot = await prisma.bot.findFirst({
    where: botId.startsWith("atlas_")
      ? { publicKey: botId }
      : { id: botId },
    select: { greetingMessage: true, quickPrompts: true, removeBranding: true },
  });

  if (!bot) {
    return jsonWithCors({ error: "Bot not found" }, { status: 404 });
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

  return jsonWithCors({
    greeting: bot.greetingMessage,
    quickPrompts: prompts,
    hideBranding: bot.removeBranding === true,
  });
}
