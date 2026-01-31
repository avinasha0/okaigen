import { NextResponse } from "next/server";
import { textToMarkdown } from "@/lib/text-to-markdown";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = body.text ?? body.content ?? body.paste ?? "";
    if (typeof text !== "string") {
      return NextResponse.json({ error: "No text provided" }, { status: 400 });
    }
    const markdown = textToMarkdown(text);
    return NextResponse.json({ markdown });
  } catch (err) {
    console.error("[convert-paste-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
