import { NextResponse } from "next/server";
import { z } from "zod";
import * as cheerio from "cheerio";

const schema = z.object({
  url: z.string().min(1, "URL is required"),
  maxPages: z.number().min(1).max(500).optional().default(50)});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid URL" }, { status: 400 });
    }

    const input = parsed.data.url.trim();
    const startUrl = input.startsWith("http") ? input : "https://" + input;
    const base = new URL(startUrl);
    const domain = base.hostname;
    const max = parsed.data.maxPages;

    const visited = new Set<string>();
    const toVisit: string[] = [startUrl];
    const urls: string[] = [];

    while (toVisit.length > 0 && urls.length < max) {
      const url = toVisit.shift()!;
      if (visited.has(url)) continue;
      visited.add(url);
      urls.push(url);

      try {
        const res = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; SitemapGenerator/1.0)" },
          signal: AbortSignal.timeout(8000)});
        if (!res.ok) continue;
        const $ = cheerio.load(await res.text());
        $("a[href]").each((_, el) => {
          const href = $(el).attr("href");
          if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("javascript:")) return;
          try {
            const u = new URL(href, url);
            if (u.hostname === domain && !visited.has(u.href) && !toVisit.includes(u.href)) {
              toVisit.push(u.href);
            }
          } catch {}
        });
      } catch { /* skip */ }
    }

    const today = new Date().toISOString().slice(0, 10);
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    urls.forEach((u) => {
      xml += "  <url>\n    <loc>" + u.replace(/&/g, "&amp;") + "</loc>\n    <lastmod>" + today + "</lastmod>\n  </url>\n";
    });
    xml += "</urlset>";

    return NextResponse.json({
      result: "```xml\n" + xml + "\n```",
      xml,
      urlCount: urls.length});
  } catch (err) {
    console.error("[xml-sitemap-generator]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
