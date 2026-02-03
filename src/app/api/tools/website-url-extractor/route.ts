import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";

const schema = z.object({
  url: z.string().min(1, "URL is required"),
  maxUrls: z.number().min(1).max(500).optional().default(100)});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid URL" }, { status: 400 });
    }

    const input = parsed.data.url.trim();
    const startUrl = input.startsWith("http") ? input : `https://${input}`;
    const base = new URL(startUrl);
    const domain = base.hostname;
    const max = parsed.data.maxUrls;

    const visited = new Set<string>();
    const toVisit: string[] = [startUrl];
    const results: string[] = [];

    while (toVisit.length > 0 && results.length < max) {
      const url = toVisit.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);
      results.push(url);

      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; UrlExtractor/1.0)" },
          signal: AbortSignal.timeout(8000)});
        if (!res.ok) continue;
        const html = await res.text();
        const $ = cheerio.load(html);
        $("a[href]").each((_, el) => {
          const href = $(el).attr("href");
          if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:"))
            return;
          try {
            const u = new URL(href, url);
            if (u.hostname === domain && !visited.has(u.href) && !toVisit.includes(u.href)) {
              toVisit.push(u.href);
            }
          } catch {}
        });
      } catch {
        // skip
      }
    }

    const sorted = [...new Set(results)].sort();
    const text = sorted.join("\n");
    return NextResponse.json({
      result: `# Extracted URLs from ${domain}\n\nTotal: ${sorted.length}\n\n\`\`\`\n${text}\n\`\`\``,
      urls: sorted});
  } catch (err) {
    console.error("[website-url-extractor]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Extraction failed" },
      { status: 500 }
    );
  }
}
