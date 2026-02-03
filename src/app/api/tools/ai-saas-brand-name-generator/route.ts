import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  description: z.string().min(1, "Product description is required"),
  industry: z.string().optional(),
  count: z.number().min(3).max(15).optional().default(5)});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { description, industry, count } = parsed.data;
    const userContent = industry
      ? `Product: ${description}\nIndustry: ${industry}`
      : description;
    const systemPrompt = `You are an expert at naming SaaS products. Generate exactly ${count} creative, memorable SaaS brand name ideas. Names should be: unique, easy to spell and remember, domain-friendly (no obvious trademark conflicts), and fitting for a tech/SaaS product. Mix creative wordplay, compound words, and modern tech naming. Output each name on a new line, numbered 1. 2. 3. etc. No explanations.`;
    const names = await generateWithAI(systemPrompt, userContent);
    return NextResponse.json({ result: names });
  } catch (err) {
    console.error("[ai-saas-brand-name-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
