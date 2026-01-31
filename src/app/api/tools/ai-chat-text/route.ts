import { NextResponse } from "next/server";
import { chatWithContent } from "@/lib/chat-with-content";
import { z } from "zod";

const schema = z.object({ content: z.string().min(1), question: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const answer = await chatWithContent(parsed.data.content, parsed.data.question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[ai-chat-text]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
