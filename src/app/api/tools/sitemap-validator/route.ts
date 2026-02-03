import { NextResponse } from "next/server";
import { z } from "zod";

const schema = z.object({
  url: z.string().url().optional(),
  xml: z.string().optional()}).refine((d) => !!d.url || !!d.xml, { message: "Provide sitemap URL or paste XML" });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }

    let xml: string;
    if (parsed.data.url) {
      const res = await fetch(parsed.data.url.trim(), {
        headers: { "User-Agent": "Mozilla/5.0 (compatible; SitemapValidator/1.0)" },
        signal: AbortSignal.timeout(10000)});
      if (!res.ok) throw new Error("Failed to fetch: " + res.status);
      xml = await res.text();
    } else {
      xml = parsed.data.xml || "";
    }

    const issues: string[] = [];
    const locRegex = /<loc>\s*(.+?)\s*<\/loc>/gi;
    let urlCount = 0;
    let m;
    while ((m = locRegex.exec(xml)) !== null) {
      urlCount++;
      try {
        new URL(m[1].trim());
      } catch {
        issues.push("Invalid URL: " + m[1]);
      }
    }

    if (!xml.includes("<?xml")) issues.push("Missing XML declaration");
    if (!xml.includes("<urlset") && !xml.includes("<sitemapindex")) issues.push("Invalid structure");
    if (urlCount === 0) issues.push("No URLs found");
    if (urlCount > 50000) issues.push("Exceeds 50,000 URL limit");

    const isValid = issues.length === 0;
    let report = "# Sitemap Validator\n\n**Status:** " + (isValid ? "Valid" : "Issues found") + "\n**URLs:** " + urlCount + "\n\n";
    if (issues.length) {
      report += "## Issues\n\n";
      issues.forEach((i) => (report += "- " + i + "\n"));
    }

    return NextResponse.json({ result: report, valid: isValid, urlCount });
  } catch (err) {
    console.error("[sitemap-validator]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
