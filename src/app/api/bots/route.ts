import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateBotPublicKey } from "@/lib/utils";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  websiteUrl: z
    .string()
    .optional()
    .transform((v) =>
      v?.trim()
        ? v.startsWith("http")
          ? v
          : `https://${v}`
        : undefined
    ),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const bots = await prisma.bot.findMany({
    where: { userId: session.user.id },
    include: {
      _count: {
        select: { chunks: true, sources: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(bots);
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, websiteUrl } = createSchema.parse(body);

    const bot = await prisma.bot.create({
      data: {
        name,
        userId: session.user.id,
        publicKey: generateBotPublicKey(),
      },
    });

    if (websiteUrl) {
      const normalizedUrl = websiteUrl.startsWith("http")
        ? websiteUrl
        : `https://${websiteUrl}`;
      await prisma.source.create({
        data: {
          botId: bot.id,
          type: "url",
          url: normalizedUrl,
          title: new URL(normalizedUrl).hostname,
          status: "pending",
        },
      });
    }

    const fullBot = await prisma.bot.findUnique({
      where: { id: bot.id },
      include: {
        sources: true,
        _count: { select: { chunks: true } },
      },
    });

    return NextResponse.json(fullBot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    console.error("Create bot error:", error);
    return NextResponse.json(
      { error: "Failed to create bot" },
      { status: 500 }
    );
  }
}
