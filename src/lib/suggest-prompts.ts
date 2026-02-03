import { prisma } from "@/lib/db";
import { openai, CHAT_MODEL } from "./openai";

/** Generate 4-6 quick prompt questions from the bot's trained content. */
export async function suggestQuickPromptsFromContent(
  botId: string
): Promise<string[]> {
  const chunks = await prisma.chunk.findMany({
    where: { botId },
    select: { content: true },
    take: 20,
    orderBy: { createdAt: "asc" }});

  if (chunks.length === 0) {
    return [
      "What do you offer?",
      "How can I contact you?",
      "Tell me about your services",
      "What are your hours?",
    ];
  }

  const sample = chunks
    .map((c) => c.content)
    .join("\n\n")
    .slice(0, 8000);

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You generate 4-6 short questions that visitors would ask about this content. Each question should be 3-8 words. Output a JSON array of strings only, e.g. [\"Question 1\", \"Question 2\"]. No other text."},
      {
        role: "user",
        content: `Based on this content, generate 4-6 questions visitors might ask:\n\n${sample}`},
    ],
    temperature: 0.5,
    max_tokens: 300});

  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) return getDefaults();

  try {
    const parsed = JSON.parse(text) as unknown;
    if (!Array.isArray(parsed)) return getDefaults();
    const questions = parsed
      .filter((p): p is string => typeof p === "string")
      .map((q) => q.trim())
      .filter((q) => q.length > 0 && q.length < 80)
      .slice(0, 6);
    return questions.length > 0 ? questions : getDefaults();
  } catch {
    return getDefaults();
  }
}

function getDefaults(): string[] {
  return [
    "What do you offer?",
    "How can I contact you?",
    "Tell me about your services",
    "What are your hours?",
  ];
}
