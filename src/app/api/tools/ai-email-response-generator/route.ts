import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  email: z.string().min(1, "Email content is required"),
  tone: z.enum(["professional", "friendly", "formal", "concise"]).optional().default("professional"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const { email, tone } = parsed.data;
    const systemPrompt = `You are an expert at writing email responses. Generate a ${tone} email reply to the following. Keep it appropriate in length. Include a greeting and sign-off. Output only the email body, no subject line or meta-commentary.`;
    const response = await generateWithAI(systemPrompt, email);
    return NextResponse.json({ result: response });
  } catch (err) {
    console.error("[ai-email-response-generator]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Generation failed" },
      { status: 500 }
    );
  }
}
