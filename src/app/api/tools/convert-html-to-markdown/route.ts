import { NextResponse } from "next/server";
import TurndownService from "turndown";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let html: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large. Max 2 MB." }, { status: 400 });
      html = await file.text();
    } else {
      const body = await req.json().catch(() => ({}));
      html = body.html ?? body.content ?? "";
      if (!html || typeof html !== "string") {
        return NextResponse.json({ error: "No HTML content provided" }, { status: 400 });
      }
    }

    const turndown = new TurndownService({ headingStyle: "atx" });
    const markdown = turndown.turndown(html);

    return NextResponse.json({ markdown });
  } catch (err) {
    console.error("[convert-html-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
