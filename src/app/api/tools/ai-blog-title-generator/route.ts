import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(1, "Topic is required"),
  count: z.number().min(3).max(15).optional().default(5),
  style: z.enum(["clickbait", "professional", "curiosity", "how-to", "list"]).optional().default("professional"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { topic, count, style } = parsed.data;
    const styleDesc: Record<string, string> = {
      clickbait: "engaging and attention-grabbing",
      professional: "professional and authoritative",
      curiosity: "curiosity-driven, intriguing",
      "how-to": "practical how-to style",
      list: "list-style (e.g., '10 Ways to...')",
    };
    const systemPrompt = `You are an expert at creating catchy blog titles. Generate exactly ${count} blog title ideas for the given topic. Style: ${styleDesc[style]}. Make them SEO-friendly and engaging. Output each title on a new line, numbered 1. 2. 3. etc. No other text.`;
    const titles = await generateWithAI(systemPrompt, topic);
    return NextResponse.json({ result: titles });
  } catch (err) {
    console.error("[ai-blog-title-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
