import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
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

  const bot = await prisma.bot.findFirst({
    where: { id: botId, userId: session.user.id },
  });

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
    const source = await prisma.source.create({
      data: {
        botId,
        type: "url",
        url: normalizedUrl,
        title,
        status: "pending",
      },
    });
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

    const source = await prisma.source.create({
      data: {
        botId,
        type: "document",
        documentUrl,
        title: file.name,
        status: "pending",
      },
    });

    created.push({ id: source.id, title: file.name });
  }

  return NextResponse.json({ sources: created });
}
