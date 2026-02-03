import { NextResponse } from "next/server";
import TurndownService from "turndown";
import * as cheerio from "cheerio";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let url = body.url ?? body.notion ?? "";
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No Notion URL provided" }, { status: 400 });
    }

    url = url.trim();
    if (!url.startsWith("http")) url = "https://" + url;

    const parsed = new URL(url);
    const host = parsed.hostname.toLowerCase();
    if (!host.includes("notion") && !host.includes("notion.so") && !host.includes("notion.site")) {
      return NextResponse.json({ error: "Please provide a valid Notion page URL (notion.so or notion.site)" }, { status: 400 });
    }

    const res = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SiteBotGPT/1.0)" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000)});

    if (!res.ok) {
      return NextResponse.json({ error: `Failed to fetch Notion page: ${res.status}. Ensure the page is published to the web.` }, { status: 400 });
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    $("script, style, noscript, iframe").remove();
    const article = $("article, .notion-page-content, [data-block-id], .page-content").first();
    const content = article.length ? article.html() ?? $.html("body") : $.html("body");

    const turndown = new TurndownService({ headingStyle: "atx" });
    const markdown = turndown.turndown(content || "");

    const title = $("title").text() || "Notion Page";
    return NextResponse.json({
      markdown: `# ${title}\n\nSource: ${url}\n\n---\n\n${markdown}`});
  } catch (err) {
    console.error("[convert-notion-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch or convert. Ensure the Notion page is published to the web." },
      { status: 500 }
    );
  }
}
