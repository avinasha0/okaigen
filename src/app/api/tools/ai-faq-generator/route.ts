import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.number().min(3).max(15).optional().default(5),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { topic, count } = parsed.data;
    const systemPrompt = `You are an expert at creating helpful FAQs. Generate exactly ${count} FAQ items for the given topic. Format each as:\n\nQ: [Question]\nA: [Answer]\n\nQuestions should be common and useful. Answers should be clear and concise (2-4 sentences). Output only the FAQ items, no introductions.`;
    const faq = await generateWithAI(systemPrompt, topic);
    return NextResponse.json({ result: faq });
  } catch (err) {
    console.error("[ai-faq-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
