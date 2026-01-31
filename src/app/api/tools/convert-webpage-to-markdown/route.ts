import { NextResponse } from "next/server";
import TurndownService from "turndown";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const url = body.url ?? body.webpage ?? "";
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      return NextResponse.json({ error: "Invalid URL. Use http or https." }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; ProjectAtlas/1.0)" },
      signal: AbortSignal.timeout(15000),
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch: ${res.status}` }, { status: 400 });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, nav, footer, .ad, .ads, [role='banner']").remove();
    const main = $("main, article, [role='main'], .content").first();
    const content = main.length ? main.html() ?? $.html() : $.html();

    const turndown = new TurndownService({ headingStyle: "atx" });
    const markdown = turndown.turndown(content || html);

    const title = $("title").text() || parsed.hostname;
    return NextResponse.json({
      markdown: `# ${title}\n\nSource: ${url}\n\n---\n\n${markdown}`,
    });
  } catch (err) {
    console.error("[convert-webpage-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch or convert" },
      { status: 500 }
    );
  }
}
