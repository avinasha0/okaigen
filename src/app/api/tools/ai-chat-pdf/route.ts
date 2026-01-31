import { NextResponse } from "next/server";
import { chatWithContent } from "@/lib/chat-with-content";
import { extractText, getDocumentProxy } from "unpdf";

const MAX = 2 * 1024 * 1024;

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const question = (form.get("question") as string) || "";
    if (!file || !question.trim()) return NextResponse.json({ error: "Upload PDF and enter question" }, { status: 400 });
    if (file.type !== "application/pdf" || file.size > MAX) return NextResponse.json({ error: "PDF only, max 2MB" }, { status: 400 });
    const pdf = await getDocumentProxy(new Uint8Array(await file.arrayBuffer()));
    const { text } = await extractText(pdf, { mergePages: true });
    const content = (text ?? "").trim();
    if (!content) return NextResponse.json({ error: "No text in PDF" }, { status: 400 });
    const answer = await chatWithContent(content, question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[ai-chat-pdf]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
