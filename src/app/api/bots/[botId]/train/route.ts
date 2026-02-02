import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { chunkText } from "@/lib/chunking";
import { generateEmbeddings } from "@/lib/embeddings";
import { extractTextFromHtml } from "@/lib/scraper";
import { parseDocument } from "@/lib/document-parser";
import { estimateTokenCount } from "@/lib/tokenizer";
import { suggestQuickPromptsFromContent } from "@/lib/suggest-prompts";
import { getBotForUser } from "@/lib/team";

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

export async function POST(
  req: Request,
  { params }: { params: Promise<{ botId: string }> }
) {
  console.log("[train] POST request received");
  try {
    const { botId } = await params;
    console.log("[train] Bot ID:", botId);
    const cronAuth = isCronRequest(req);
    let resolvedBotId: string;

    if (cronAuth) {
      resolvedBotId = botId;
    } else {
      const session = await auth();
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const { requireEmailVerificationForApi } = await import("@/lib/email-verification");
      const emailCheck = requireEmailVerificationForApi(session);
      if (emailCheck) return emailCheck;
      const botRef = await getBotForUser(session.user.id, botId);
      if (!botRef) {
        return NextResponse.json({ error: "Bot not found" }, { status: 404 });
      }
      resolvedBotId = botRef.id;
    }

    const botWithSources = await prisma.bot.findUnique({
      where: { id: resolvedBotId },
      include: { sources: true },
    });
    if (!botWithSources) {
      return NextResponse.json({ error: "Bot not found" }, { status: 404 });
    }
    const bot = botWithSources;

    let pendingSources = bot.sources.filter((s) => s.status === "pending");

    if (pendingSources.length === 0) {
      const failedSources = bot.sources.filter((s) => s.status === "failed");
      if (failedSources.length > 0) {
        await prisma.source.updateMany({
          where: { id: { in: failedSources.map((s) => s.id) } },
          data: { status: "pending", error: null },
        });
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

    for (const source of pendingSources) {
    try {
      await prisma.source.update({
        where: { id: source.id },
        data: { status: "processing" },
      });

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
              pages = await crawlWebsite(url);
            }
          } catch {
            pages = await crawlWebsite(url);
          }
        } else {
          pages = await crawlWebsite(url);
        }

        totalPages += pages.length;
        if (pages.length === 0) {
          throw new Error(
            `Could not crawl ${url}. The site may block crawlers, require JavaScript, or be unreachable. Try adding documents instead.`
          );
        }

        for (const page of pages) {
          const textChunks = chunkText(page.content, {
            sourceUrl: page.url,
            pageTitle: page.title,
          });

          for (const tc of textChunks) {
            const chunk = await prisma.chunk.create({
              data: {
                botId,
                sourceId: source.id,
                content: tc.content,
                metadata: tc.metadata as object,
                tokenCount: tc.tokenCount,
              },
            });

            const [embedding] = await generateEmbeddings([tc.content]);
            await prisma.embedding.create({
              data: {
                chunkId: chunk.id,
                botId,
                vector: embedding,
              },
            });
            totalChunks++;
          }
        }
      } else if (source.type === "document" && source.documentUrl) {
        const response = await fetch(source.documentUrl);
        const buffer = Buffer.from(await response.arrayBuffer());
        const parsed = await parseDocument(
          buffer,
          source.title || "document",
          response.headers.get("content-type") || "application/octet-stream"
        );

        const textChunks = chunkText(parsed.content, {
          documentName: parsed.metadata.documentName,
        });

        for (const tc of textChunks) {
          const chunk = await prisma.chunk.create({
            data: {
              botId,
              sourceId: source.id,
              content: tc.content,
              metadata: tc.metadata as object,
              tokenCount: estimateTokenCount(tc.content),
            },
          });

          const [embedding] = await generateEmbeddings([tc.content]);
          await prisma.embedding.create({
            data: {
              chunkId: chunk.id,
              botId,
              vector: embedding,
            },
          });
          totalChunks++;
        }
        totalPages = 1;
      }

      await prisma.source.update({
        where: { id: source.id },
        data: {
          status: "completed",
          pageCount: totalPages,
          error: null,
          lastRefreshedAt: new Date(),
        },
      });

      await prisma.usageLog.create({
        data: {
          botId,
          type: "embed",
          count: totalChunks,
        },
      });
    } catch (error) {
      console.error("Training error for source:", source.id, error);
      await prisma.source.update({
        where: { id: source.id },
        data: {
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        },
      });
      return NextResponse.json(
        {
          error: "Training failed",
          detail: error instanceof Error ? error.message : "Unknown error",
        },
        { status: 500 }
      );
    }
    }

    // Auto-generate quick prompts from content if bot has none
    if (totalChunks > 0) {
      const currentBot = await prisma.bot.findUnique({
        where: { id: botId },
        select: { quickPrompts: true },
      });
      if (!currentBot?.quickPrompts) {
        try {
          const prompts = await suggestQuickPromptsFromContent(botId);
          await prisma.bot.update({
            where: { id: botId },
            data: { quickPrompts: JSON.stringify(prompts) },
          });
        } catch {
          // ignore; defaults will be used
        }
      }
    }

    return NextResponse.json({
      success: true,
      chunksCreated: totalChunks,
      pagesIndexed: totalPages,
    });
  } catch (error) {
    console.error("Training route error:", error);
    return NextResponse.json(
      {
        error: "Training failed",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
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

async function crawlWebsite(startUrl: string): Promise<{ url: string; title: string; content: string }[]> {
  const origin = new URL(startUrl).origin;
  const visited = new Set<string>();
  let toVisit: string[] = [startUrl];

  // Try sitemap first to discover all URLs under the domain
  const sitemapUrls = await discoverUrlsFromSitemap(origin);
  if (sitemapUrls.length > 0) {
    toVisit = [...new Set([startUrl, ...sitemapUrls])];
  }

  const results: { url: string; title: string; content: string }[] = [];
  const maxPages = 50;

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
          "User-Agent": "SiteBotGPT/1.0 (Website Indexer; +https://sitebotgpt.com)",
        },
      });
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
          content: scraped.content,
        });
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
