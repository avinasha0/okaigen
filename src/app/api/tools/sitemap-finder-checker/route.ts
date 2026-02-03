import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  url: z.string().min(1, "URL is required")});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid URL" }, { status: 400 });
    }
    const input = parsed.data.url.trim();
    const full = input.startsWith("http") ? input : "https://" + input.replace(/\/$/, "");
    const base = new URL(full).origin;

    const paths = ["/sitemap.xml", "/sitemap_index.xml", "/sitemap-index.xml"];
    const sitemaps: { url: string; status: string }[] = [];

    try {
      const robotsRes = await fetch(base + "/robots.txt", {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SitemapChecker/1.0)" },
        signal: AbortSignal.timeout(8000)});
      if (robotsRes.ok) {
        const text = await robotsRes.text();
        for (const line of text.split(/\n/)) {
          const match = line.match(/Sitemap:\s*(.+)/i);
          if (match) paths.push(match[1].trim());
        }
      }
    } catch { /* ignore */ }

    for (const p of paths) {
      const url = p.startsWith("http") ? p : base + (p.startsWith("/") ? p : "/" + p);
      try {
        const r = await fetch(url, {
          headers: { "User-Agent": "Mozilla/5.0 (compatible; SitemapChecker/1.0)" },
          signal: AbortSignal.timeout(6000)});
        sitemaps.push({ url, status: r.ok ? "OK" : String(r.status) });
      } catch {
        sitemaps.push({ url, status: "Failed" });
      }
    }

    const found = sitemaps.filter((s) => s.status === "OK");
    let report = "# Sitemap Finder & Checker\n\n**Site:** " + base + "\n\n";
    report += "## Found (" + found.length + ")\n\n";
    found.forEach((s) => (report += "- " + s.url + "\n"));
    report += "\n## All Checked\n\n";
    sitemaps.forEach((s) => (report += "- [" + s.status + "] " + s.url + "\n"));

    return NextResponse.json({ result: report });
  } catch (err) {
    console.error("[sitemap-finder-checker]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
