import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function xmlToMarkdown(xml: string): string {
  const lines: string[] = [];
  const tagRegex = /<([^/>\s]+)([^>]*)>|<\/([^>]+)>|([^<]+)/g;
  let match;
  const stack: string[] = [];
  let textBuffer = "";

  const flushText = () => {
    const t = textBuffer.trim();
    if (t) lines.push(t);
    textBuffer = "";
  };

  while ((match = tagRegex.exec(xml)) !== null) {
    const [, openTag, attrs, closeTag, text] = match;
    if (text) {
      textBuffer += text;
    } else if (openTag) {
      flushText();
      const level = stack.length;
      const indent = "  ".repeat(level);
      const name = openTag.split(/\s/)[0];
      if (!["?xml", "!DOCTYPE", "![CDATA["].includes(name)) {
        stack.push(openTag);
        lines.push(`${indent}- **<${name}>**`);
      }
    } else if (closeTag) {
      flushText();
      if (stack.length && stack[stack.length - 1].startsWith(closeTag)) {
        stack.pop();
      }
    }
  }
  flushText();

  return lines.length ? "# XML Structure\n\n" + lines.join("\n") : "# XML Output\n\n" + xml;
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let xml: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large. Max 2 MB." }, { status: 400 });
      xml = await file.text();
    } else {
      const body = await req.json().catch(() => ({}));
      xml = body.xml ?? body.content ?? body.text ?? body.paste ?? "";
      if (!xml || typeof xml !== "string") return NextResponse.json({ error: "No XML content provided" }, { status: 400 });
    }

    const markdown = xmlToMarkdown(xml);
    return NextResponse.json({ markdown });
  } catch (err) {
    console.error("[convert-xml-to-markdown]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Conversion failed" }, { status: 500 });
  }
}
