import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  topic: z.string().min(1, "Topic is required"),
  purpose: z.string().optional(),
  framework: z.enum(["APE", "RACE", "CREATE", "SPARK", "general"]).optional().default("general")});

const FRAMEWORKS: Record<string, string> = {
  APE: "Action-Result-Purpose: Start with the desired action, state the expected result, then the purpose.",
  RACE: "Role-Action-Context-Expectation: Define your role, the action, context, and expected output.",
  CREATE: "Context-Request-Examples-Adaptations-Tone-Expand: Comprehensive prompt structure.",
  SPARK: "Situation-Problem-Aspiration-Result-Kudos: Story-driven prompt framework.",
  general: "Clear, specific instructions that any AI can follow effectively."};

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { topic, purpose, framework } = parsed.data;
    const fwDesc = FRAMEWORKS[framework];
    const userContent = purpose
      ? `Topic: ${topic}\nPurpose: ${purpose}\n\nGenerate a prompt using the ${framework} framework.`
      : `Topic: ${topic}\n\nGenerate a prompt using the ${framework} framework.`;
    const systemPrompt = `You are an expert at crafting effective AI prompts. Use the ${framework} framework: ${fwDesc}\n\nGenerate a single, well-structured prompt. Output only the prompt text, no explanations.`;
    const prompt = await generateWithAI(systemPrompt, userContent);
    return NextResponse.json({ result: prompt });
  } catch (err) {
    console.error("[ai-prompt-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
