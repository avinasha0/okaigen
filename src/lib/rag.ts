import { openai, CHAT_MODEL } from "./openai";
import { generateEmbedding } from "./embeddings";
import { prisma } from "./db";
import { searchVectors, type VectorResult } from "./vector-search";

export interface RAGContext {
  chunks: VectorResult[];
  confidence: number;
}

/** Ensures vector from DB (Json) is number[]; MySQL/Prisma can return numeric arrays as strings. */
function toNumberVector(raw: unknown): number[] {
  if (!Array.isArray(raw)) return [];
  return raw.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
}

export async function retrieveContext(
  botId: string,
  query: string,
  topK: number = 5,
  _minSimilarity?: number
): Promise<RAGContext> {
  const queryEmbedding = await generateEmbedding(query);

  const chunks = await prisma.chunk.findMany({
    where: { botId },
    include: { embedding: true },
  });

  const chunksWithVectors = chunks
    .filter((c) => c.embedding)
    .map((c) => {
      const vector = toNumberVector(c.embedding!.vector);
      return { id: c.id, content: c.content, metadata: c.metadata as Record<string, unknown>, vector };
    })
    .filter((c) => c.vector.length === queryEmbedding.length);

  const results = searchVectors(queryEmbedding, chunksWithVectors, topK);
  const confidence = results.length > 0 ? results[0].similarity : 0;

  return {
    chunks: results,
    confidence,
  };
}

async function summarizeContext(
  contextText: string,
  userMessage: string
): Promise<string> {
  if (!contextText.trim()) return "No relevant context found.";
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content:
          "You summarize content into 4-6 short bullet points. Each bullet is under 10 words. Use your own words. Do not copy phrases. Output only the bullets, nothing else.",
      },
      {
        role: "user",
        content: `Topic: ${userMessage}\n\nContent to summarize:\n${contextText.slice(0, 6000)}`,
      },
    ],
    temperature: 0.2,
    max_tokens: 200,
  });
  return completion.choices[0]?.message?.content?.trim() || contextText.slice(0, 500);
}

function buildSystemPrompt(
  botGreeting: string,
  botTone: string,
  contextSummary: string,
  humanFallback: string
): string {
  const toneInstruction =
    botTone === "formal"
      ? "Respond in a professional, formal tone."
      : botTone === "casual"
        ? "Respond in a casual, conversational tone."
        : "Respond in a friendly, helpful tone.";

  return `You are a customer support AI. Answer using ONLY this summary. Do not add information not in the summary.

${toneInstruction}

Summary:
${contextSummary}

RULES:
1. If the summary does not help answer the question, respond with: "${humanFallback}"
2. When listing items, put each bullet on its own line. Format: a blank line, then "• " or "- " then the bullet, then newline. Example:\n\n• First item\n• Second item\n\n3. Each bullet under 10 words. No long paragraphs. Reply in under 150 words.`;
}

export async function generateResponse(
  botId: string,
  userMessage: string,
  messageHistory: { role: "user" | "assistant"; content: string }[] = []
): Promise<{
  response: string;
  sources: string[];
  confidence: number;
}> {
  const bot = await prisma.bot.findUnique({
    where: { id: botId },
  });

  if (!bot) {
    throw new Error("Bot not found");
  }

  const { chunks, confidence } = await retrieveContext(botId, userMessage, 5);

  if (chunks.length === 0) {
    const totalChunks = await prisma.chunk.count({ where: { botId } });
    if (totalChunks === 0) {
      return {
        response:
          "This bot doesn't have any content yet. Add sources and train it from the dashboard, then try again.",
        sources: [],
        confidence: 0,
      };
    }
  }

  const contextText =
    chunks.length > 0
      ? chunks.map((c) => c.content).join("\n\n---\n\n")
      : "";
  const contextSummary = await summarizeContext(contextText, userMessage);

  const systemPrompt = buildSystemPrompt(
    bot.greetingMessage,
    bot.tone,
    contextSummary,
    bot.humanFallbackMessage
  );

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...messageHistory.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    temperature: 0.3,
    max_tokens: 300,
  });

  const response = completion.choices[0]?.message?.content || bot.humanFallbackMessage;
  const sources = [...new Set(chunks.map((c) => c.metadata?.sourceUrl as string).filter(Boolean))];

  return {
    response,
    sources,
    confidence,
  };
}
