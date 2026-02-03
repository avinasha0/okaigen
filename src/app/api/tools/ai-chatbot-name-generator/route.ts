import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  brand: z.string().optional(),
  industry: z.string().optional(),
  style: z.enum(["friendly", "professional", "playful", "tech"]).optional().default("friendly"),
  count: z.number().min(3).max(15).optional().default(5)});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { brand, industry, style, count } = parsed.data;
    const parts: string[] = [];
    if (brand) parts.push("Brand/company: " + brand);
    if (industry) parts.push("Industry: " + industry);
    parts.push("Style: " + style);
    const userContent = parts.length ? parts.join("\n") : "Generate creative chatbot names.";
    const systemPrompt = `You are an expert at naming AI assistants and chatbots. Generate exactly ${count} creative, memorable chatbot name ideas. Names should be ${style}, easy to remember, and suitable for a customer support or assistant bot. Output each name on a new line, numbered 1. 2. 3. etc. No explanations.`;
    const names = await generateWithAI(systemPrompt, userContent);
    return NextResponse.json({ result: names });
  } catch (err) {
    console.error("[ai-chatbot-name-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
