import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  type: z.enum(["cover", "thank-you", "formal", "resignation", "reference", "custom"]),
  context: z.string().min(1, "Context/details are required"),
  recipient: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { type, context, recipient } = parsed.data;
    const typeDesc: Record<string, string> = {
      cover: "cover letter for a job application",
      "thank-you": "thank you letter",
      formal: "formal business letter",
      resignation: "resignation letter",
      reference: "reference or recommendation letter",
      custom: "professional letter",
    };
    const userContent = recipient ? `Context: ${context}\n\nRecipient: ${recipient}` : `Context: ${context}`;
    const systemPrompt = `You are an expert at writing professional letters. Generate a ${typeDesc[type]} based on the user's context. Use proper formatting (date, greeting, body, closing, signature block). Output only the letter.`;
    const letter = await generateWithAI(systemPrompt, userContent, { maxTokens: 1500 });
    return NextResponse.json({ result: letter });
  } catch (err) {
    console.error("[ai-letter-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
