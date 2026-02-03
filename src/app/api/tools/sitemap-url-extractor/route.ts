import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  url: z.string().min(1, "Sitemap URL is required")});

async function fetchSitemap(url: string): Promise<string> {
  const full = url.startsWith("http") ? url : `https://${url}`;
  const res = await fetch(full, {
    headers: { "User-Agent": "Mozilla/5.0 (compatible; SitemapExtractor/1.0)" },
    signal: AbortSignal.timeout(15000)});
  if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
  return res.text();
}

function extractUrls(xml: string): string[] {
  const urls: string[] = [];
  const locRegex = /<loc>\s*(.+?)\s*<\/loc>/gi;
  let m;
  while ((m = locRegex.exec(xml)) !== null) {
    urls.push(m[1].trim());
  }
  return urls;
}

function extractSitemapRefs(xml: string, base: string): string[] {
  const refs: string[] = [];
  const locRegex = /<loc>\s*(.+?)\s*<\/loc>/gi;
  let m;
  const baseUrl = new URL(base);
  while ((m = locRegex.exec(xml)) !== null) {
    try {
      const u = new URL(m[1].trim(), baseUrl.origin);
      refs.push(u.href);
    } catch {}
  }
  return refs;
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid URL" }, { status: 400 });
    }

    const input = parsed.data.url.trim();
    const base = input.startsWith("http") ? input : `https://${input}`;
    const baseUrl = new URL(base);

    const xml = await fetchSitemap(base);

    if (xml.includes("<sitemapindex") || xml.includes("<sitemapindex")) {
      const refs = extractSitemapRefs(xml, base);
      const allUrls: string[] = [];
      for (const ref of refs.slice(0, 20)) {
        try {
          const sub = await fetchSitemap(ref);
          allUrls.push(...extractUrls(sub));
        } catch {
          // skip failed
        }
      }
      const unique = [...new Set(allUrls)].sort();
      const text = unique.join("\n");
      return NextResponse.json({
        result: `# Extracted URLs (from sitemap index)\n\nTotal: ${unique.length}\n\n\`\`\`\n${text}\n\`\`\``,
        urls: unique});
    }

    const urls = extractUrls(xml);
    const unique = [...new Set(urls)].sort();
    const text = unique.join("\n");
    return NextResponse.json({
      result: `# Extracted URLs\n\nTotal: ${unique.length}\n\n\`\`\`\n${text}\n\`\`\``,
      urls: unique});
  } catch (err) {
    console.error("[sitemap-url-extractor]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Extraction failed" },
      { status: 500 }
    );
  }
}
