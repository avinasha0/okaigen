import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotForUser } from "@/lib/team";
import { suggestQuickPromptsFromContent } from "@/lib/suggest-prompts";

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

  const prompts = await suggestQuickPromptsFromContent(botId);
  return NextResponse.json({ prompts });
}
