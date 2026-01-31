import { NextResponse } from "next/server";
import { chatWithContent } from "@/lib/chat-with-content";
import mammoth from "mammoth";
import JSZip from "jszip";
import WordExtractor from "word-extractor";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function isDocx(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4b;
}
function isDoc(buffer: Buffer): boolean {
  return buffer.length >= 4 && buffer[0] === 0xd0 && buffer[1] === 0xcf;
}

function extractFromDocxXml(xml: string): string {
  const unescape = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
  const paragraphs = xml.split(/<w:p\b/);
  const lines: string[] = [];
  for (let i = 1; i < paragraphs.length; i++) {
    const matches = paragraphs[i].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    const parts: string[] = [];
    for (const m of matches) parts.push(unescape(m[1] || ""));
    lines.push(parts.join(""));
  }
  return lines.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}

async function extractDocx(buffer: Buffer): Promise<string> {
  try {
    const r = await mammoth.extractRawText({ buffer });
    return r.value?.trim() || "";
  } catch {
    const zip = await JSZip.loadAsync(buffer);
    const f = zip.file("word/document.xml");
    if (!f) throw new Error("Invalid DOCX");
    return extractFromDocxXml(await f.async("text"));
  }
}

async function extractDoc(buffer: Buffer): Promise<string> {
  const ext = new WordExtractor();
  const doc = await ext.extract(buffer);
  const body = await doc.getBody();
  return body?.trim() || "";
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const question = (form.get("question") as string) || "";
    if (!file) return NextResponse.json({ error: "Upload a Word document" }, { status: 400 });
    if (!question.trim()) return NextResponse.json({ error: "Enter a question" }, { status: 400 });
    const ext = file.name.toLowerCase();
    if (!ext.endsWith(".docx") && !ext.endsWith(".doc")) return NextResponse.json({ error: "Only .doc or .docx" }, { status: 400 });
    if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large (max 5 MB)" }, { status: 400 });

    const buffer = Buffer.from(await file.arrayBuffer());
    let content: string;
    if (isDoc(buffer)) {
      content = await extractDoc(buffer);
    } else if (isDocx(buffer)) {
      content = await extractDocx(buffer);
    } else {
      return NextResponse.json({ error: "Invalid Word file" }, { status: 400 });
    }
    if (!content?.trim()) return NextResponse.json({ error: "No text extracted" }, { status: 400 });

    const answer = await chatWithContent(content, question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[ai-chat-word]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
