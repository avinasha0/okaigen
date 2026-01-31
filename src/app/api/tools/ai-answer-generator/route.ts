import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  question: z.string().min(1, "Question is required"),
  context: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { question, context } = parsed.data;
    const userContent = context ? `Question: ${question}\n\nContext: ${context}` : question;
    const systemPrompt = `You are a helpful assistant. Answer the question clearly and concisely. Be accurate and direct. If you're unsure, say so. Output only the answer, no preamble.`;
    const answer = await generateWithAI(systemPrompt, userContent);
    return NextResponse.json({ result: answer });
  } catch (err) {
    console.error("[ai-answer-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
