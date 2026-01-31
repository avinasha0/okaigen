import { NextResponse } from "next/server";
import { parse } from "rtf-parser";
import { textToMarkdown } from "@/lib/text-to-markdown";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function extractText(node: { value?: string; content?: unknown[] }): string {
  if (typeof node.value === "string") return node.value;
  if (Array.isArray(node.content)) {
    return node.content.map((c) => extractText(c as { value?: string; content?: unknown[] })).join("") + (node.content.length ? "\n" : "");
  }
  return "";
}

function parseRtf(rtf: string): Promise<{ content: unknown[] }> {
  return new Promise((resolve, reject) => {
    parse.string(rtf, (err, doc) => (err ? reject(err) : resolve(doc as { content: unknown[] })));
  });
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (!file.name.toLowerCase().endsWith(".rtf")) {
      return NextResponse.json({ error: "Only RTF files are supported" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 2 MB." }, { status: 400 });
    }

    const rtf = await file.text();
    const doc = await parseRtf(rtf);
    let text = "";
    for (const node of doc.content) {
      text += extractText(node as { value?: string; content?: unknown[] });
    }
    const markdown = textToMarkdown(text);

    return NextResponse.json({
      markdown,
      filename: file.name.replace(/\.rtf$/i, "") + ".md",
    });
  } catch (err) {
    console.error("[convert-rtf-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
