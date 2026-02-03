import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { generateBotPublicKey, generateId } from "@/lib/utils";
import { getPlanUsage } from "@/lib/plan-usage";
import { getEffectiveOwnerId } from "@/lib/team";
import { requireEmailVerificationForApi } from "@/lib/email-verification";

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
    )});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const emailCheck = requireEmailVerificationForApi(session);
  if (emailCheck) return emailCheck;

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const bots = await prisma.Bot.findMany({
    where: { userId: ownerId },
    select: {
      id: true,
      name: true,
      publicKey: true,
      createdAt: true,
      updatedAt: true,
      _count: { select: { chunk: true, source: true } }},
    orderBy: { createdAt: "desc" }});

  const res = NextResponse.json(bots);
  res.headers.set("Cache-Control", "private, max-age=30, stale-while-revalidate=10");
  return res;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const emailCheck = requireEmailVerificationForApi(session);
  if (emailCheck) return emailCheck;

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const planUsage = await getPlanUsage(session.user.id);
  if (planUsage && planUsage.usedBots >= planUsage.totalBots) {
    return NextResponse.json(
      { 
        error: `Bot limit reached (${planUsage.totalBots} bots). Please upgrade your plan to create more bots.`,
        quotaExceeded: true,
        usedBots: planUsage.usedBots,
        totalBots: planUsage.totalBots},
      { status: 402 }
    );
  }

  try {
    const body = await req.json();
    const { name, websiteUrl } = createSchema.parse(body);

    const now = new Date();
    const bot = await prisma.Bot.create({
      data: {name,
        userId: ownerId,
        publicKey: generateBotPublicKey(),
        updatedAt: now}});

    if (websiteUrl) {
      try {
        const normalizedUrl = websiteUrl.startsWith("http")
          ? websiteUrl
          : `https://${websiteUrl}`;
        
        // Parse URL safely
        let urlTitle: string;
        try {
          const urlObj = new URL(normalizedUrl);
          urlTitle = urlObj.hostname || normalizedUrl;
        } catch (urlError) {
          console.warn("Failed to parse URL, using original URL as title:", urlError);
          urlTitle = normalizedUrl;
        }
        
        await prisma.Source.create({
          data: {botId: bot.id,
            type: "url",
            url: normalizedUrl,
            title: urlTitle,
            status: "pending",
            updatedAt: now}});
      } catch (sourceError) {
        // Log source creation error but don't fail bot creation
        console.error("Failed to create source for bot:", sourceError);
        // Bot is already created, so we continue
      }
    }

    const fullBot = await prisma.Bot.findUnique({
      where: { id: bot.id },
      include: {
        source: true,
        _count: { select: { chunk: true } }}});

    return NextResponse.json(fullBot);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message },
        { status: 400 }
      );
    }
    // Enhanced error logging for debugging
    console.error("Create bot error:", error);
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    // Return more detailed error message in development
    const errorMessage = process.env.NODE_ENV === 'development' && error instanceof Error
      ? `Failed to create bot: ${error.message}`
      : "Failed to create bot";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
