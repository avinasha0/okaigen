import { NextResponse } from "next/server";
import { generateWithAI } from "@/lib/ai-generate";
import { z } from "zod";

const schema = z.object({
  conversations: z.string().min(1, "Conversation data is required"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
    }
    const systemPrompt = `You are an expert at analyzing chatbot conversations. Analyze the provided conversation logs and produce a structured report with: 1) Knowledge Gaps - topics the bot struggled with, 2) User Intent Patterns - what users are trying to achieve, 3) Actionable Improvements - specific recommendations. Be concise. Use bullet points. Output in markdown.`;
    const report = await generateWithAI(systemPrompt, parsed.data.conversations, { maxTokens: 1500 });
    return NextResponse.json({ result: report });
  } catch (err) {
    console.error("[ai-chatbot-conversation-analysis]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Analysis failed" }, { status: 500 });
  }
}
