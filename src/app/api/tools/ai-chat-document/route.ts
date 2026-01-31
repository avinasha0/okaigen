import { NextResponse } from "next/server";
import { chatWithContent } from "@/lib/chat-with-content";
import { extractText, getDocumentProxy } from "unpdf";
import mammoth from "mammoth";
import JSZip from "jszip";
import WordExtractor from "word-extractor";

const MAX = 5 * 1024 * 1024;

function extractDocxXml(xml: string): string {
  const paragraphs = xml.split(/<w:p\b/);
  const lines: string[] = [];
  for (let i = 1; i < paragraphs.length; i++) {
    const m = paragraphs[i].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    lines.push([...m].map((x) => x[1]).join(""));
  }
  return lines.join("\n").trim();
}

async function getText(buffer: Buffer, type: string): Promise<string> {
  if (type === "pdf") {
    const pdf = await getDocumentProxy(new Uint8Array(buffer));
    const { text } = await extractText(pdf, { mergePages: true });
    return (text ?? "").trim();
  }
  if (type === "docx") {
    try {
      const r = await mammoth.extractRawText({ buffer });
      return r.value?.trim() || "";
    } catch {
      const zip = await JSZip.loadAsync(buffer);
      const f = zip.file("word/document.xml");
      if (!f) throw new Error("Invalid DOCX");
      return extractDocxXml(await f.async("text"));
    }
  }
  if (type === "doc") {
    const ext = new WordExtractor();
    const doc = await ext.extract(buffer);
    return (await doc.getBody())?.trim() || "";
  }
  return "";
}

export async function POST(req: Request) {
  try {
    const ct = req.headers.get("content-type") || "";
    if (ct.includes("multipart")) {
      const form = await req.formData();
      const file = form.get("file") as File | null;
      const question = (form.get("question") as string) || "";
      if (!file || !question.trim()) return NextResponse.json({ error: "File and question required" }, { status: 400 });
      if (file.size > MAX) return NextResponse.json({ error: "Max 5MB" }, { status: 400 });
      const buf = Buffer.from(await file.arrayBuffer());
      const n = file.name.toLowerCase();
      let type = "txt";
      if (n.endsWith(".pdf") || (buf[0] === 0x25 && buf[1] === 0x50)) type = "pdf";
      else if (n.endsWith(".docx") || (buf[0] === 0x50 && buf[1] === 0x4b)) type = "docx";
      else if (n.endsWith(".doc") || (buf[0] === 0xd0 && buf[1] === 0xcf)) type = "doc";
      const content = type === "txt" ? (await file.text()).trim() : await getText(buf, type);
      if (!content) return NextResponse.json({ error: "No content" }, { status: 400 });
      const answer = await chatWithContent(content, question);
      return NextResponse.json({ answer });
    }
    const body = await req.json().catch(() => ({}));
    const content = body.content || "";
    const question = body.question || "";
    if (!content.trim() || !question.trim()) return NextResponse.json({ error: "Content and question required" }, { status: 400 });
    const answer = await chatWithContent(content, question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[ai-chat-document]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
