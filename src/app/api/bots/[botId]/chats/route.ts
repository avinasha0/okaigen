import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotForUser } from "@/lib/team";

const CACHE_MAX_AGE = 30; // 30s for list data

export async function GET(
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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);
  const cursor = searchParams.get("cursor") || undefined;

  // List chats with projection: only last message per chat for preview; cursor-based pagination
  const chats = await prisma.chat.findMany({
    where: {
      botId,
      ...(search
        ? {
            chatmessage: {
              some: {
                content: { contains: search },
              },
            },
          }
        : {}),
    },
    select: {
      id: true,
      visitorId: true,
      visitorEmail: true,
      visitorName: true,
      pageUrl: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { chatmessage: true } },
      chatmessage: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit + 1,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });

  const hasMore = chats.length > limit;
  const list = hasMore ? chats.slice(0, limit) : chats;
  const nextCursor = hasMore ? list[list.length - 1]?.id : null;

  const res = NextResponse.json({
    chats: list,
    nextCursor,
  });
  res.headers.set("Cache-Control", `private, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=10`);
  return res;
}
