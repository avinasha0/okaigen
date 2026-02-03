import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotForUser } from "@/lib/team";

/** GET a single chat with all messages (for detail view). */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ botId: string; chatId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { botId, chatId } = await params;

  const bot = await getBotForUser(session.user.id, botId);
  if (!bot) {
    return NextResponse.json({ error: "Bot not found" }, { status: 404 });
  }

  const chat = await prisma.chat.findFirst({
    where: { id: chatId, botId },
    select: {
      id: true,
      visitorId: true,
      visitorEmail: true,
      visitorName: true,
      pageUrl: true,
      createdAt: true,
      updatedAt: true,
      chatmessage: {
        orderBy: { createdAt: "asc" },
        select: { id: true, role: true, content: true, createdAt: true },
      },
    },
  });

  if (!chat) {
    return NextResponse.json({ error: "Chat not found" }, { status: 404 });
  }

  return NextResponse.json(chat);
}
