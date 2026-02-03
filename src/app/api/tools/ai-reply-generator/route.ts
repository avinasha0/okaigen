import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  message: z.string().min(1, "Message is required"),
  tone: z.enum(["professional", "casual", "friendly", "formal"]).optional().default("friendly"),
  context: z.string().optional()});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { message, tone, context } = parsed.data;
    const userContent = context
      ? `Message to reply to:\n${message}\n\nContext:\n${context}`
      : `Message to reply to:\n${message}`;
    const systemPrompt = `You are a helpful assistant that generates thoughtful replies. Generate a single, natural ${tone} reply to the given message. Keep it concise (1-3 sentences) unless the message clearly requires more. Do not add explanations or meta-commentary—output only the reply.`;
    const reply = await generateWithAI(systemPrompt, userContent);
    return NextResponse.json({ result: reply });
  } catch (err) {
    console.error("[ai-reply-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
