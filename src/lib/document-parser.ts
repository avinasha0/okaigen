import mammoth from "mammoth";
import { PDFParse } from "pdf-parse";

export interface ParsedDocument {
  content: string;
  metadata: { documentName: string };
}

export async function parsePdf(buffer: Buffer, documentName: string): Promise<ParsedDocument> {
  const parser = new PDFParse({ data: new Uint8Array(buffer) });
  try {
    const textResult = await parser.getText();
    await parser.destroy();
    return {
      content: textResult.text,
      metadata: { documentName }};
  } catch (e) {
    await parser.destroy();
    throw e;
  }
}

export async function parseDocx(buffer: Buffer, documentName: string): Promise<ParsedDocument> {
  const result = await mammoth.extractRawText({ buffer });
  return {
    content: result.value,
    metadata: { documentName }};
}

export async function parseText(content: string, documentName: string): Promise<ParsedDocument> {
  return {
    content,
    metadata: { documentName }};
}

export async function parseDocument(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<ParsedDocument> {
  const ext = filename.split(".").pop()?.toLowerCase() || "";

  if (mimeType.includes("pdf") || ext === "pdf") {
    return parsePdf(buffer, filename);
  }
  if (
    mimeType.includes("wordprocessingml") ||
    mimeType.includes("msword") ||
    ["docx", "doc"].includes(ext)
  ) {
    return parseDocx(buffer, filename);
  }
  if (
    ["txt", "md", "markdown"].includes(ext) ||
    mimeType.includes("text/plain") ||
    mimeType.includes("text/markdown")
  ) {
    return parseText(buffer.toString("utf-8"), filename);
  }

  throw new Error(`Unsupported file type: ${mimeType} (${ext})`);
}
