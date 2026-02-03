import { NextResponse } from "next/server";
import mammoth from "mammoth";
import TurndownService from "turndown";
import JSZip from "jszip";
import WordExtractor from "word-extractor";
import { textToMarkdown } from "@/lib/text-to-markdown";

const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

// DOCX/ZIP magic bytes: PK (50 4B). Old .doc (OLE): D0 CF 11 E0
function isDocxFormat(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return buffer[0] === 0x50 && buffer[1] === 0x4b;
}

function isOldDocFormat(buffer: Buffer): boolean {
  if (buffer.length < 4) return false;
  return buffer[0] === 0xd0 && buffer[1] === 0xcf && buffer[2] === 0x11 && buffer[3] === 0xe0;
}

function extractTextFromDocxXml(xml: string): string {
  const unescape = (s: string) => s.replace(/&#(\d+);/g, (_, n) => String.fromCharCode(parseInt(n, 10)));
  const paragraphs = xml.split(/<w:p\b/);
  const lines: string[] = [];
  for (let i = 1; i < paragraphs.length; i++) {
    const matches = paragraphs[i].matchAll(/<w:t[^>]*>([^<]*)<\/w:t>/g);
    const parts: string[] = [];
    for (const m of matches) parts.push(unescape(m[1] || ""));
    lines.push(parts.join(""));
  }
  return lines.join("\n\n").replace(/\n{3}/g, "\n\n").trim();
}

async function fallbackExtractText(buffer: Buffer): Promise<string> {
  const zip = await JSZip.loadAsync(buffer);
  const docFile = zip.file("word/document.xml");
  if (!docFile) throw new Error("Invalid DOCX: missing word/document.xml");
  const xml = await docFile.async("text");
  return extractTextFromDocxXml(xml);
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const ext = file.name.toLowerCase();
    if (!ext.endsWith(".docx") && !ext.endsWith(".doc")) {
      return NextResponse.json({
        error: "Please upload a Word document (.doc or .docx)."}, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 5 MB." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());

    if (isOldDocFormat(buffer)) {
      try {
        const extractor = new WordExtractor();
        const doc = await extractor.extract(buffer);
        const body = doc.getBody();
        const markdown = textToMarkdown(body || "");
        return NextResponse.json({
          markdown,
          filename: file.name.replace(/\.doc$/i, "") + ".md"});
      } catch (docErr) {
        console.error("[convert-docx-to-markdown] .doc parse error:", docErr);
        return NextResponse.json({
          error: "Could not read this .doc file. Try opening it in Word and saving as .docx, then upload again."}, { status: 400 });
      }
    }

    if (!isDocxFormat(buffer)) {
      return NextResponse.json({
        error: "Could not recognize this file as a Word document. Please ensure it's a valid .docx file."}, { status: 400 });
    }

    let html: string;
    try {
      const result = await mammoth.convertToHtml({ buffer });
      html = result.value;
    } catch (mammothErr) {
      const msg = mammothErr instanceof Error ? mammothErr.message : "";
      if (msg.includes("Could not find the body element") || msg.includes("Could not find main document")) {
        try {
          const plainText = await fallbackExtractText(buffer);
          const markdown = textToMarkdown(plainText);
          return NextResponse.json({
            markdown,
            filename: file.name.replace(/\.docx$/i, "") + ".md"});
        } catch (fallbackErr) {
          return NextResponse.json({
            error: "Could not parse this DOCX. The file may be corrupted or in an unsupported format. Try re-saving it as .docx in Word or Google Docs."}, { status: 400 });
        }
      }
      throw mammothErr;
    }

    const turndown = new TurndownService();
    const markdown = turndown.turndown(html);

    return NextResponse.json({
      markdown,
      filename: file.name.replace(/\.docx$/i, "") + ".md"});
  } catch (err) {
    console.error("[convert-docx-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
