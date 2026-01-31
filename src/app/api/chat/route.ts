import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResponse } from "@/lib/rag";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const visitorId = req.headers.get("x-visitor-id") || req.headers.get("x-forwarded-for") || "anon";
  const botKey = req.headers.get("x-bot-key") || req.headers.get("x-atlas-key");
  const rlKey = `chat:${botKey || "unknown"}:${visitorId}`;
  const { success } = rateLimit(rlKey, 30, 60000); // 30 req/min per visitor per bot
  if (!success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }
  try {
    const { botId, message, chatId, history } = (await req.json()) as {
      botId?: string;
      message: string;
      chatId?: string;
      history?: { role: "user" | "assistant"; content: string }[];
    };

    const botKey = req.headers.get("x-bot-key") || req.headers.get("x-atlas-key") || botId;

    let bot;
    if (botKey) {
      bot = await prisma.bot.findFirst({
        where: botKey.startsWith("atlas_")
          ? { publicKey: botKey }
          : { id: botKey },
      });
    }

    if (!bot) {
      return NextResponse.json(
        { error: "Bot not found. Use the embed code from Dashboard → your bot → Embed code, or your bot's public key (atlas_...)." },
        { status: 400 }
      );
    }

    const sanitized = String(message).slice(0, 4000).trim();
    if (!sanitized) {
      return NextResponse.json({ error: "Message required" }, { status: 400 });
    }

    let chat;
    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: { id: chatId, botId: bot.id },
      });
    }

    if (!chat) {
      chat = await prisma.chat.create({
        data: {
          botId: bot.id,
          visitorId: req.headers.get("x-visitor-id") || undefined,
          pageUrl: req.headers.get("x-page-url") || undefined,
        },
      });
    }

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "user",
        content: sanitized,
      },
    });

    const msgHistory = history || [];
    const prevMessages = await prisma.chatMessage.findMany({
      where: { chatId: chat.id },
      orderBy: { createdAt: "asc" },
      take: 20,
    });
    const recentHistory = prevMessages
      .filter((m) => m.role !== "user" || m.id !== prevMessages[prevMessages.length - 1]?.id)
      .slice(-10)
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const combinedHistory = recentHistory.length > 0 ? recentHistory : msgHistory;

    const { response, sources, confidence } = await generateResponse(
      bot.id,
      sanitized,
      combinedHistory
    );

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "assistant",
        content: response,
        sources: sources.length ? sources : undefined,
      },
    });

    await prisma.usageLog.create({
      data: { botId: bot.id, type: "message", count: 1 },
    });

    const shouldCaptureLead =
      bot.leadCaptureTrigger === "always" ||
      (bot.leadCaptureTrigger === "uncertain" && confidence < bot.confidenceThreshold);

    return NextResponse.json({
      response,
      sources,
      chatId: chat.id,
      confidence,
      shouldCaptureLead,
    });
  } catch (error: unknown) {
    console.error("Chat API error:", error);
    let message = "Failed to process message";
    if (error instanceof Error) message = error.message;
    else if (typeof (error as { error?: { message?: string } })?.error?.message === "string")
      message = (error as { error: { message: string } }).error.message;
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
