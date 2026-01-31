import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET(
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

  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const limit = Math.min(parseInt(searchParams.get("limit") || "50", 10), 100);

  const chats = await prisma.chat.findMany({
    where: {
      botId,
      ...(search
        ? {
            messages: {
              some: {
                content: { contains: search },
              },
            },
          }
        : {}),
    },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  });

  return NextResponse.json(chats);
}
