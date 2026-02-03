import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateResponse } from "@/lib/rag";
import { rateLimit } from "@/lib/rate-limit";
import { getPlanUsage } from "@/lib/plan-usage";
import { getOwnerIdFromApiKey, getApiKeyFromRequest } from "@/lib/api-key-auth";
import { generateId } from "@/lib/utils";

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

export async function POST(req: Request) {
  const body = (await req.json()) as {
    botId?: string;
    message: string;
    chatId?: string;
    history?: { role: "user" | "assistant"; content: string }[];
    stream?: boolean; // New: enable streaming
  };
  const { botId: bodyBotId, message, chatId, history, stream: enableStream = false } = body;

  const apiKeyRaw = getApiKeyFromRequest(req);
  const visitorId = req.headers.get("x-visitor-id") || req.headers.get("x-forwarded-for") || "anon";
  const widgetBotKey = req.headers.get("x-bot-key") || req.headers.get("x-atlas-key");
  const rlKey = apiKeyRaw
    ? `chat:api:${apiKeyRaw.slice(0, 12)}:${visitorId}`
    : `chat:${widgetBotKey || "unknown"}:${visitorId}`;
  const { success } = rateLimit(rlKey, 30, 60000);
  if (!success) {
    return jsonWithCors({ error: "Rate limit exceeded" }, { status: 429 });
  }

  try {
    let bot: { id: string; userId: string; leadCaptureTrigger: string; confidenceThreshold: number } | null = null;

    if (apiKeyRaw) {
      const ownerId = await getOwnerIdFromApiKey(req);
      if (!ownerId) {
        return jsonWithCors(
          { error: "Invalid API key or your plan does not include API access. Upgrade to Scale or Enterprise." },
          { status: 401 }
        );
      }
      const requestedBotId = bodyBotId || widgetBotKey;
      if (!requestedBotId) {
        return jsonWithCors(
          { error: "botId is required when using API key. Send botId in the request body." },
          { status: 400 }
        );
      }
      bot = await prisma.bot.findFirst({
        where: {
          userId: ownerId,
          ...(requestedBotId.startsWith("atlas_") ? { publicKey: requestedBotId } : { id: requestedBotId }),
        },
        include: { user: true },
      }) as { id: string; userId: string; leadCaptureTrigger: string; confidenceThreshold: number } | null;
    } else {
      const botKey = widgetBotKey || bodyBotId;
      if (botKey) {
        bot = await prisma.bot.findFirst({
          where: botKey.startsWith("atlas_")
            ? { publicKey: botKey }
            : { id: botKey },
          include: { user: true },
        }) as { id: string; userId: string; leadCaptureTrigger: string; confidenceThreshold: number } | null;
      }
    }

    if (!bot) {
      return jsonWithCors(
        { error: "Bot not found. Use the embed code from Dashboard → your bot → Embed code, or your bot's public key (atlas_...). With API key, send a botId that belongs to your account." },
        { status: 400 }
      );
    }

    const planUsage = await getPlanUsage(bot.userId);
    if (planUsage && planUsage.usedMessages >= planUsage.totalMessages) {
      return jsonWithCors(
        { 
          error: "Daily message limit reached. Please upgrade your plan to continue.", 
          quotaExceeded: true,
          usedMessages: planUsage.usedMessages,
          totalMessages: planUsage.totalMessages,
        },
        { status: 402 }
      );
    }

    const sanitized = String(message).slice(0, 4000).trim();
    if (!sanitized) {
      return jsonWithCors({ error: "Message required" }, { status: 400 });
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
          id: generateId(),
          botId: bot.id,
          visitorId: req.headers.get("x-visitor-id") || undefined,
          pageUrl: req.headers.get("x-page-url") || undefined,
          updatedAt: new Date(),
        },
      });
    }

    // Optimization: Parallelize message history fetch and user message creation
    // These operations are independent and can run concurrently
    // Also optimize: only fetch last 10 messages (we only use 10 anyway) and use select to reduce data transfer
    const [prevMessagesResult, userMessage] = await Promise.all([
      chatId 
        ? prisma.chatmessage.findMany({
            where: { chatId: chat.id },
            orderBy: { createdAt: "desc" }, // Get most recent first
            take: 10, // Reduced from 20 since we only use 10
            select: {
              id: true,
              role: true,
              content: true,
              createdAt: true,
            },
          })
        : Promise.resolve([]),
      prisma.chatmessage.create({
        data: {
          id: generateId(),
          chatId: chat.id,
          role: "user",
          content: sanitized,
        },
      }),
    ]);

    const msgHistory = history || [];

    // Optimization: Reverse to get chronological order, exclude the just-created user message
    // Since we fetched desc order, reverse and filter out the latest user message if it matches
    const recentHistory = prevMessagesResult
      .reverse() // Convert desc to asc
      .filter((m) => m.id !== userMessage.id) // Exclude the message we just created
      .slice(-10) // Take last 10
      .map((m) => ({ role: m.role as "user" | "assistant", content: m.content }));

    const combinedHistory = recentHistory.length > 0 ? recentHistory : msgHistory;

    // Handle streaming response
    if (enableStream) {
      const { generateResponseStream } = await import("@/lib/rag");
      const encoder = new TextEncoder();
      
      const stream = new ReadableStream({
        async start(controller) {
          try {
            let fullResponse = "";
            const streamGenerator = generateResponseStream(bot.id, sanitized, combinedHistory);
            let finalMetadata: { sources: string[]; confidence: number } | null = null;
            
            // Process streaming chunks - the generator yields strings, then returns metadata
            while (true) {
              const result = await streamGenerator.next();
              if (result.done) {
                // Final return value contains metadata
                finalMetadata = result.value;
                break;
              }
              // Yielded value is a string chunk
              if (typeof result.value === "string") {
                fullResponse += result.value;
                // Send chunk as Server-Sent Event
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ chunk: result.value })}\n\n`));
              }
            }
            
            const { sources, confidence } = finalMetadata || { sources: [], confidence: 0 };
            
            // Save to database
            await Promise.all([
              prisma.chatmessage.create({
                data: {
                  id: generateId(),
                  chatId: chat.id,
                  role: "assistant",
                  content: fullResponse,
                  sources: sources.length ? sources : undefined,
                },
              }),
              prisma.usagelog.create({
                data: { id: generateId(), botId: bot.id, type: "message", count: 1 },
              }),
            ]);

            // Trigger webhooks (fire-and-forget)
            const { triggerWebhooks } = await import("@/lib/webhooks");
            triggerWebhooks(bot.userId, "chat.message", {
              botId: bot.id,
              chatId: chat.id,
              userMessage: sanitized,
              assistantResponse: fullResponse,
              sources: sources.length ? sources : undefined,
              confidence,
            }).catch(() => {});

            const shouldCaptureLead =
              bot.leadCaptureTrigger === "always" ||
              (bot.leadCaptureTrigger === "uncertain" && confidence < bot.confidenceThreshold);

            // Send final metadata
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ 
              done: true, 
              sources, 
              chatId: chat.id,
              confidence, 
              shouldCaptureLead 
            })}\n\n`));
            controller.close();
          } catch (error) {
            console.error("Streaming error:", error);
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: "Streaming failed" })}\n\n`));
            controller.close();
          }
        },
      });

      return new Response(stream, {
        headers: {
          ...CORS_HEADERS,
          "Content-Type": "text/event-stream",
          "Cache-Control": "no-cache",
          "Connection": "keep-alive",
        },
      });
    }

    // Non-streaming response (original behavior)
    const responsePromise = generateResponse(
      bot.id,
      sanitized,
      combinedHistory
    );

    const { response, sources, confidence } = await responsePromise;

    await Promise.all([
      prisma.chatmessage.create({
        data: {
          id: generateId(),
          chatId: chat.id,
          role: "assistant",
          content: response,
          sources: sources.length ? sources : undefined,
        },
      }),
      prisma.usagelog.create({
        data: { botId: bot.id, type: "message", count: 1 },
      }),
    ]);

    const { triggerWebhooks } = await import("@/lib/webhooks");
    triggerWebhooks(bot.userId, "chat.message", {
      botId: bot.id,
      chatId: chat.id,
      userMessage: sanitized,
      assistantResponse: response,
      sources: sources.length ? sources : undefined,
      confidence,
    }).catch(() => {});

    const shouldCaptureLead =
      bot.leadCaptureTrigger === "always" ||
      (bot.leadCaptureTrigger === "uncertain" && confidence < bot.confidenceThreshold);

    return jsonWithCors({
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
    return jsonWithCors(
      { error: message },
      { status: 500 }
    );
  }
}
