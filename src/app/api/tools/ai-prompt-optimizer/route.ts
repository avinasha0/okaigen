import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  framework: z.enum(["APE", "RACE", "CREATE", "SPARK", "general"]).optional().default("general")});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { prompt, framework } = parsed.data;
    const systemPrompt = `You are an expert at optimizing AI prompts. The user will provide an existing prompt. Transform it into a clearer, more effective version using best practices${framework !== "general" ? ` and the ${framework} framework` : ""}. Preserve the original intent. Output only the optimized prompt, no explanations.`;
    const optimized = await generateWithAI(systemPrompt, prompt);
    return NextResponse.json({ result: optimized });
  } catch (err) {
    console.error("[ai-prompt-optimizer]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Optimization failed" },
      { status: 500 }
    );
  }
}
