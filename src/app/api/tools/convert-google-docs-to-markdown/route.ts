import { NextResponse } from "next/server";
import TurndownService from "turndown";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    let url = body.url ?? body.googleDoc ?? "";
    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "No Google Docs URL provided" }, { status: 400 });
    }

    url = url.trim();
    if (!url.startsWith("http")) url = "https://" + url;

    const parsed = new URL(url);
    if (!parsed.hostname.includes("docs.google.com")) {
      return NextResponse.json({ error: "Please provide a valid Google Docs URL (docs.google.com/document/...)" }, { status: 400 });
    }

    const docIdMatch = url.match(/\/document\/d\/([a-zA-Z0-9_-]+)/);
    const docId = docIdMatch?.[1];
    if (!docId) {
      return NextResponse.json({ error: "Could not extract document ID from URL" }, { status: 400 });
    }

    const exportUrl = `https://docs.google.com/document/d/${docId}/export?format=html`;
    const res = await fetch(exportUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; SiteBotGPT/1.0)" },
      redirect: "follow",
      signal: AbortSignal.timeout(15000)});

    if (!res.ok) {
      return NextResponse.json({
        error: `Failed to export document (${res.status}). Ensure the document is shared so anyone with the link can view.`}, { status: 400 });
    }

    const html = await res.text();
    const turndown = new TurndownService({ headingStyle: "atx" });
    const markdown = turndown.turndown(html);

    return NextResponse.json({
      markdown: `# Google Doc\n\nSource: ${url}\n\n---\n\n${markdown}`});
  } catch (err) {
    console.error("[convert-google-docs-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Failed to fetch or convert. Ensure the doc is shared for viewing." },
      { status: 500 }
    );
  }
}
