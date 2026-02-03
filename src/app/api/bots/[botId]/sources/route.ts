import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getBotForUser } from "@/lib/team";
import { generateId } from "@/lib/utils";
import { writeFile, mkdir } from "fs/promises";
import path from "path";

export async function POST(
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

  const contentType = req.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    const body = await req.json();
    const url = (body.url as string)?.trim();
    if (!url) {
      return NextResponse.json({ error: "URL required" }, { status: 400 });
    }
    const normalizedUrl = url.startsWith("http") ? url : `https://${url}`;
    try {
      new URL(normalizedUrl);
    } catch {
      return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
    }
    const u = new URL(normalizedUrl);
    const title = u.pathname === "/" || !u.pathname ? u.hostname : u.hostname + u.pathname;
    const now = new Date();
    
    console.log(`[sources] Creating URL source: botId=${botId}, url=${normalizedUrl}, title=${title}`);
    
    const source = await prisma.source.create({
      data: {
        id: generateId(),
        botId,
        type: "url",
        url: normalizedUrl,
        title,
        status: "pending",
        updatedAt: now,
      },
    });
    
    console.log(`[sources] URL source created: sourceId=${source.id}`);
    return NextResponse.json({
      sources: [{ id: source.id, title: source.title }],
    });
  }

  const formData = await req.formData();
  const files = formData.getAll("files") as File[];

  if (!files.length) {
    return NextResponse.json(
      { error: "No files provided" },
      { status: 400 }
    );
  }

  const { getPlanUsage } = await import("@/lib/plan-usage");
  const { canUseDocumentTraining } = await import("@/lib/plans-config");
  const planUsage = await getPlanUsage(session.user.id);
  if (!planUsage || !canUseDocumentTraining(planUsage.planName)) {
    return NextResponse.json(
      { error: "Document training is not available on your plan. Upgrade to add documents." },
      { status: 403 }
    );
  }

  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "text/markdown",
  ];

  const uploadDir = path.join(process.cwd(), "public", "uploads", botId);
  await mkdir(uploadDir, { recursive: true });

  const created: { id: string; title: string }[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (!["pdf", "docx", "doc", "txt", "md"].includes(ext || "")) {
      continue;
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const safeName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
    const filePath = path.join(uploadDir, safeName);
    await writeFile(filePath, buffer);

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const documentUrl = `${baseUrl}/uploads/${botId}/${safeName}`;
    const now = new Date();

    const source = await prisma.source.create({
      data: {
        id: generateId(),
        botId,
        type: "document",
        documentUrl,
        title: file.name,
        status: "pending",
        updatedAt: now,
      },
    });

    created.push({ id: source.id, title: file.name });
  }

  return NextResponse.json({ sources: created });
}
