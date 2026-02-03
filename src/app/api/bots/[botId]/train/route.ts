import { NextResponse } from "next/server";
import { chunkText } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractTextFromHtml } from "@/lib/scraper";
// parseDocument imported dynamically only when processing documents (avoids pdf-parse browser API issues)
import { estimateTokenCount } from "@/lib/tokenizer";
import { suggestQuickPromptsFromContent } from "@/lib/suggest-prompts";
import { getBotForUser } from "@/lib/team";
import { getPlanUsage } from "@/lib/plan-usage";
import { getPageLimit } from "@/lib/plans-config";
import { generateId } from "@/lib/utils";

/** Force dynamic so this route is never statically optimized (avoids 405 on POST on Vercel). */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 300; // 5 minutes for long training jobs

/** Allow cron to trigger training without session when x-cron-secret matches CRON_SECRET */
function isCronRequest(req: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const header = req.headers.get("x-cron-secret");
  return header === secret;
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

/** GET not supported; return 405 so clients and logs can see the route is mounted. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const { botId } = await params;
  console.log("[train] GET received (method not allowed) botId=", botId);
  return NextResponse.json(
    { error: "Method not allowed", message: "Use POST to train the bot." },
    { status: 405 }
  );
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  const method = req.method;
  console.log("[train] request method=", method, "url=", req.url);
  if (method !== "POST") {
    return NextResponse.json(
      { error: "Method not allowed", message: "Use POST to train the bot." },
      { status: 405 }
    );
  }
  try {
    let streamResponse = false;
    try {
      const body = await req.json();
      streamResponse = !!(body && typeof body === "object" && (body as { stream?: boolean }).stream);
    } catch {
      // no body or invalid JSON – use normal JSON response
    }
    const { auth } = await import("@/lib/auth");
    const { prisma } = await import("@/lib/db");
    const { botId } = await params;
    console.log("[train] POST botId=", botId, "stream=", streamResponse);
    const cronAuth = isCronRequest(req);
    let resolvedBotId: string;

    if (cronAuth) {
      console.log("[train] Using cron auth, botId=", botId);
      resolvedBotId = botId;
    } else {
      const session = await auth();
      if (!session?.user?.id) {
        console.error("[train] Unauthorized: no session or user.id, botId=", botId);
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      console.log("[train] Authenticated user:", session.user.id, "botId=", botId);
      const { requireEmailVerificationForApi } = await import("@/lib/email-verification");
      const emailCheck = requireEmailVerificationForApi(session);
      if (emailCheck) {
        console.error("[train] Email verification required for user:", session.user.id);
        return emailCheck;
      }
      const botRef = await getBotForUser(session.user.id, botId);
      if (!botRef) {
        console.error("[train] Bot not found or access denied. userId=", session.user.id, "botId=", botId);
        return NextResponse.json({ error: "Bot not found" }, { status: 404 });
      }
      resolvedBotId = botRef.id;
      console.log("[train] Resolved botId:", resolvedBotId, "for user:", session.user.id);
    }

    const botWithSources = await prisma.bot.findUnique({
      where: { id: resolvedBotId },
      include: { source: true }});
    if (!botWithSources) {
      console.error("[train] Bot not found in DB. resolvedBotId=", resolvedBotId);
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }
    const bot = botWithSources;
    const planUsage = cronAuth ? null : await getPlanUsage(bot.userId);
    const pageLimit = planUsage ? getPageLimit(planUsage.planName) : 50;
    console.log("[train] Bot found. sources count:", bot.source.length, "pending:", bot.source.filter(s => s.status === "pending").length, "pageLimit:", pageLimit);

    let pendingSources = bot.source.filter((s) => s.status === "pending");

    if (pendingSources.length === 0) {
      const failedSources = bot.source.filter((s) => s.status === "failed");
      if (failedSources.length > 0) {
        await prisma.source.updateMany({
          where: { id: { in: failedSources.map((s) => s.id) } },
          data: { status: "pending", error: null }});
        pendingSources = failedSources;
      } else {
        return NextResponse.json(
          { error: "No pending sources to train" },
          { status: 400 }
        );
      }
    }

    let totalChunks = 0;
    let totalPages = 0;
    let trainEmit: ((ev: object) => void) | undefined;

    const runTraining = async () => {
    for (const source of pendingSources) {
    try {
      await prisma.source.update({
        where: { id: source.id },
        data: { status: "processing" }});

      if (source.type === "url" && source.url) {
        const url = source.url.startsWith("http")
          ? source.url
          : `https://${source.url}`;

        const appOrigin = (process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000").replace(/\/$/, "");
        const urlOrigin = new URL(url).origin;
        const isOwnApp = urlOrigin === appOrigin || urlOrigin === "http://localhost:3000" || urlOrigin === "http://127.0.0.1:3000";

        let pages: { url: string; title: string; content: string }[];

        if (isOwnApp) {
          try {
            const res = await fetch(`${urlOrigin}/atlas-training-content`, { signal: AbortSignal.timeout(10000) });
            const text = await res.text();
            if (res.ok && text.trim().length > 100) {
              pages = [{ url: `${urlOrigin}/`, title: "SiteBotGPT", content: text }];
            } else {
              pages = await crawlWebsite(url, pageLimit);
            }
          } catch {
            pages = await crawlWebsite(url, pageLimit);
          }
        } else {
          pages = await crawlWebsite(url, pageLimit);
        }

        totalPages += pages.length;
        if (pages.length === 0) {
          throw new Error(
            `Could not crawl ${url}. The site may block crawlers, require JavaScript, or be unreachable. Try adding documents instead.`
          );
        }

        trainEmit?.({ type: "pages_discovered", count: pages.length, pages: pages.map((p) => ({ url: p.url, title: p.title })) });
        let completedCount = 0;
        for (const page of pages) {
          trainEmit?.({ type: "page", url: page.url, title: page.title, status: "in_progress", considered: pages.length, completed: completedCount, inProgress: 1, pending: pages.length - completedCount - 1 });
          const textChunks = chunkText(page.content, {
            sourceUrl: page.url,
            pageTitle: page.title});

          for (const tc of textChunks) {
            const chunk = await prisma.chunk.create({
              data: {botId: resolvedBotId,
                sourceId: source.id,
                content: tc.content,
                metadata: tc.metadata ? JSON.stringify(tc.metadata) : null,
                tokenCount: tc.tokenCount}});

            const [embedding] = await generateEmbeddings([tc.content]);
            await prisma.embedding.create({
              data: {chunkId: chunk.id,
                botId: resolvedBotId,
                vector: JSON.stringify(embedding)}});
            totalChunks++;
          }
          completedCount++;
          trainEmit?.({ type: "page", url: page.url, title: page.title, status: "completed", considered: pages.length, completed: completedCount, inProgress: 0, pending: pages.length - completedCount });
        }
      } else if (source.type === "document" && source.documentUrl) {
        trainEmit?.({ type: "pages_discovered", count: 1, pages: [{ url: source.documentUrl, title: source.title || "document" }] });
        trainEmit?.({ type: "page", url: source.documentUrl, title: source.title || "document", status: "in_progress", considered: 1, completed: 0, inProgress: 1, pending: 0 });
        // Dynamically import parseDocument only when processing documents
        // This avoids loading pdf-parse (which uses browser APIs) for URL training
        const { parseDocument } = await import("@/lib/document-parser");
        const response = await fetch(source.documentUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        const parsed = await parseDocument(
          buffer,
          source.title || "document",
          response.headers.get("content-type") || "application/octet-stream"
        );

        const textChunks = chunkText(parsed.content, {
          documentName: parsed.metadata.documentName});

        for (const tc of textChunks) {
          const chunk = await prisma.chunk.create({
            data: {botId: resolvedBotId,
              sourceId: source.id,
              content: tc.content,
              metadata: tc.metadata ? JSON.stringify(tc.metadata) : null,
              tokenCount: estimateTokenCount(tc.content)}});

          const [embedding] = await generateEmbeddings([tc.content]);
          await prisma.embedding.create({
            data: {chunkId: chunk.id,
              botId: resolvedBotId,
              vector: JSON.stringify(embedding)}});
          totalChunks++;
        }
        totalPages = 1;
        trainEmit?.({ type: "page", url: source.documentUrl, title: source.title || "document", status: "completed", considered: 1, completed: 1, inProgress: 0, pending: 0 });
      }

      await prisma.source.update({
        where: { id: source.id },
        data: {
          status: "completed",
          pageCount: totalPages,
          error: null,
          lastRefreshedAt: new Date()}});

      await prisma.usageLog.create({
        data: {botId: resolvedBotId,
          type: "embed",
          count: totalChunks}});
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Unknown error";
      const errorStack = error instanceof Error ? error.stack : undefined;
      console.error("[train] Training error for source:", source.id, "type:", source.type, "url:", source.url || source.documentUrl);
      console.error("[train] Error message:", errorMsg);
      if (errorStack) console.error("[train] Error stack:", errorStack);
      // Check for pdf-parse specific errors
      if (errorMsg.includes("DOMMatrix") || errorMsg.includes("pdf-parse")) {
        console.error("[train] PDF parsing error detected. This may be a serverless environment compatibility issue.");
      }
      try {
        await prisma.source.update({
          where: { id: source.id },
          data: {
            status: "failed",
            error: errorMsg}});
      } catch (dbError) {
        console.error("[train] Failed to update source status in DB:", dbError);
      }
      throw new Error(errorMsg);
    }
    }
    return { totalChunks, totalPages };
    };

    if (streamResponse) {
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          trainEmit = (ev: object) => {
            try {
              controller.enqueue(encoder.encode(JSON.stringify(ev) + "\n"));
            } catch (_) {}
          };
          try {
            trainEmit({ type: "init", message: "Starting training..." });
            const result = await runTraining();
            if (result.totalChunks > 0) {
              const currentBot = await prisma.bot.findUnique({
                where: { id: resolvedBotId },
                select: { quickPrompts: true }});
              if (!currentBot?.quickPrompts) {
                try {
                  const prompts = await suggestQuickPromptsFromContent(resolvedBotId);
                  await prisma.bot.update({
                    where: { id: resolvedBotId },
                    data: { quickPrompts: JSON.stringify(prompts) }});
                } catch {
                  /* ignore */
                }
              }
            }
            trainEmit({ type: "done", chunksCreated: result.totalChunks, pagesIndexed: result.totalPages });
          } catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            trainEmit({ type: "error", error: "Training failed", detail: msg });
          } finally {
            controller.close();
          }
        }});
      return new Response(stream, {
        headers: { "Content-Type": "application/x-ndjson" }});
    }

    let result: { totalChunks: number; totalPages: number };
    try {
      result = await runTraining();
    } catch (trainErr) {
      const detail = trainErr instanceof Error ? trainErr.message : "Unknown error";
      return NextResponse.json(
        { error: "Training failed", detail },
        { status: 500 }
      );
    }

    // Auto-generate quick prompts from content if bot has none
    if (result.totalChunks > 0) {
      const currentBot = await prisma.bot.findUnique({
        where: { id: resolvedBotId },
        select: { quickPrompts: true }});
      if (!currentBot?.quickPrompts) {
        try {
          const prompts = await suggestQuickPromptsFromContent(resolvedBotId);
          await prisma.bot.update({
            where: { id: resolvedBotId },
            data: { quickPrompts: JSON.stringify(prompts) }});
        } catch {
          // ignore; defaults will be used
        }
      }
    }

    return NextResponse.json({
      success: true,
      chunksCreated: result.totalChunks,
      pagesIndexed: result.totalPages});
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("[train] Top-level route error. This should not happen if module loaded correctly.");
    console.error("[train] Error message:", errorMsg);
    if (errorStack) console.error("[train] Error stack:", errorStack);
    console.error("[train] Error type:", error?.constructor?.name || typeof error);
    return NextResponse.json(
      {
        error: "Training failed",
        detail: errorMsg},
      { status: 500 }
    );
  }
}

async function isAllowedByRobotsTxt(url: string): Promise<boolean> {
  try {
    const base = new URL(url);
    const robotsUrl = `${base.origin}/robots.txt`;
    const res = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return true;
    const text = await res.text();
    const lines = text.split("\n");
    let inUserAgent = false;
    for (const line of lines) {
      const lower = line.trim().toLowerCase();
      if (lower.startsWith("user-agent:")) {
        const ua = line.slice(11).trim();
        inUserAgent = ua === "*" || ua.toLowerCase().includes("atlas") || ua.toLowerCase().includes("bot");
      } else if (inUserAgent && lower.startsWith("disallow:")) {
        const path = line.slice(9).trim();
        if (path === "/") return false;
        if (path && new URL(url).pathname.startsWith(path)) return false;
      } else if (lower.startsWith("user-agent:")) {
        inUserAgent = false;
      }
    }
    return true;
  } catch {
    return true;
  }
}

async function discoverUrlsFromSitemap(origin: string): Promise<string[]> {
  const urls: string[] = [];
  try {
    const res = await fetch(`${origin}/sitemap.xml`, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return urls;
    const xml = await res.text();
    const locMatches = xml.matchAll(/<loc>([^<]+)<\/loc>/gi);
    for (const m of locMatches) {
      const u = m[1]?.trim();
      if (u && new URL(u).origin === origin) urls.push(u);
    }
  } catch {
    // No sitemap or parse error
  }
  return urls;
}

async function crawlWebsite(
  startUrl: string,
  maxPages: number = 50
): Promise<{ url: string; title: string; content: string }[]> {
  const origin = new URL(startUrl).origin;
  const visited = new Set<string>();
  let toVisit: string[] = [startUrl];

  // Try sitemap first to discover all URLs under the domain
  const sitemapUrls = await discoverUrlsFromSitemap(origin);
  if (sitemapUrls.length > 0) {
    toVisit = [...new Set([startUrl, ...sitemapUrls])];
  }

  const results: { url: string; title: string; content: string }[] = [];

  if (!(await isAllowedByRobotsTxt(startUrl))) return results;

  while (toVisit.length > 0 && results.length < maxPages) {
    const url = toVisit.shift()!;
    if (visited.has(url)) continue;
    visited.add(url);

    if (!(await isAllowedByRobotsTxt(url))) continue;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          "User-Agent": "SiteBotGPT/1.0 (Website Indexer; +https://sitebotgpt.com)"}});
      clearTimeout(timeout);

      if (!response.ok || !response.headers.get("content-type")?.includes("text/html")) {
        continue;
      }

      const html = await response.text();
      const baseUrl = response.url || url;
      const scraped = extractTextFromHtml(html, baseUrl);

      if (scraped.content.trim().length > 100) {
        results.push({
          url: scraped.url,
          title: scraped.title,
          content: scraped.content});
      }

      for (const link of scraped.links) {
        try {
          const normalized = new URL(link, baseUrl).href;
          const normOrigin = new URL(normalized).origin;
          if (normOrigin === origin && !visited.has(normalized) && !toVisit.includes(normalized)) {
            toVisit.push(normalized);
          }
        } catch {
          // skip invalid URLs
        }
      }
    } catch {
      // Skip failed fetches
    }
  }

  return results;
}
