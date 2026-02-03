/**
 * RAG (Retrieval-Augmented Generation) Implementation
 * 
 * Features:
 * - Dynamic threshold: Hard floor of 0.3 similarity (prevents hallucinations)
 * - Adaptive chunk count: Uses score windowing (top_score - 0.1) instead of fixed count
 * - Answer confidence guard: Returns fallback if top similarity < 0.3
 * - Two-stage generation: Summarize context → Generate answer (reduces hallucinations)
 * 
 * This matches production-grade RAG systems used by Intercom, SiteGPT, Perplexity.
 */
import { openai, CHAT_MODEL } from "./openai";
import { generateEmbedding } from "./embeddings";
import { prisma } from "./db";
import { searchVectors, type VectorResult } from "./vector-search";
import { responseCache, normalizeCacheKey, botCache } from "./cache";

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
  maxChunks: number = 10,
  minSimilarity: number = 0.3 // Hard floor: minimum similarity to consider
): Promise<RAGContext> {
  const queryEmbedding = await generateEmbedding(query);

  // Optimization: Limit chunks to avoid loading entire KB into memory (cap 500)
  const CHUNK_LIMIT = 500;
  const chunks = await prisma.chunk.findMany({
    where: {
      botId,
      embedding: { isNot: null },
    },
    select: {
      id: true,
      content: true,
      metadata: true,
      embedding: {
        select: {
          vector: true,
        },
      },
    },
    take: CHUNK_LIMIT,
    orderBy: { createdAt: "desc" }, // Prefer recent chunks when over limit
  });

  console.log(`[rag] retrieveContext: botId=${botId}, query="${query}", totalChunks=${chunks.length}`);

  // Optimization: Pre-filter and convert vectors in one pass
  const chunksWithVectors = chunks
    .map((c) => {
      if (!c.embedding) return null;
      const vector = toNumberVector(c.embedding.vector);
      if (vector.length !== queryEmbedding.length) return null;
      return { 
        id: c.id, 
        content: c.content, 
        metadata: (c.metadata as Record<string, unknown>) || {}, 
        vector 
      };
    })
    .filter((c): c is NonNullable<typeof c> => c !== null);

  console.log(`[rag] chunksWithVectors: ${chunksWithVectors.length} chunks with valid embeddings`);

  // Adaptive search: uses score windowing (top_score - 0.1) instead of fixed count
  const results = searchVectors(queryEmbedding, chunksWithVectors, maxChunks, minSimilarity);
  const confidence = results.length > 0 ? results[0].similarity : 0;

  console.log(`[rag] searchVectors results: ${results.length} chunks found, top similarity=${confidence.toFixed(3)}`);
  if (results.length > 0) {
    const topScores = results.slice(0, Math.min(5, results.length)).map(r => r.similarity.toFixed(3)).join(", ");
    console.log(`[rag] Top chunk similarity scores: ${topScores}`);
    console.log(`[rag] Top chunk preview: ${results[0].content.substring(0, 200)}`);
  }

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
  humanFallback: string,
  useRawContext: boolean = false
): string {
  const toneInstruction =
    botTone === "formal"
      ? "Respond in a professional, formal tone."
      : botTone === "casual"
        ? "Respond in a casual, conversational tone."
        : "Respond in a friendly, helpful tone.";

  // Improved prompt: Only use fallback if summary is truly empty or irrelevant
  const hasContext = contextSummary && contextSummary.trim().length > 0 && !contextSummary.includes("No relevant context");

  return `You are a customer support AI assistant. ${hasContext ? `Use the provided ${useRawContext ? 'content' : 'summary'} to answer the question.` : "You don't have relevant information to answer this question."}

${toneInstruction}

${hasContext ? `${useRawContext ? 'Relevant content' : 'Summary of relevant content'}:
${contextSummary}

INSTRUCTIONS:
- Answer the question using the ${useRawContext ? 'content' : 'summary'} above
- ${useRawContext ? 'Extract the key information and provide a concise answer.' : 'If the summary contains relevant information (even partially), provide a helpful answer based on it.'}
- Only use the fallback message if the ${useRawContext ? 'content' : 'summary'} is completely irrelevant or empty
- Be helpful and informative` : `You don't have information about this topic in your knowledge base.`}

${hasContext ? "" : `Respond with: "${humanFallback}"`}

FORMATTING RULES:
- When listing items, put each bullet on its own line
- Format: blank line, then "• " or "- " then the bullet, then newline
- Example:\n\n• First item\n• Second item\n\n- Keep each bullet under 10 words
- Keep responses under 150 words
- Be concise and helpful`;
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
  // Optimization: Cache responses for common questions (quick prompts)
  const isQuickPrompt = userMessage.length < 60 && (userMessage.includes("?") || userMessage.split(" ").length < 10);
  if (isQuickPrompt && messageHistory.length === 0) {
    // Only cache if no conversation history (fresh question)
    const cacheKey = `${botId}:${normalizeCacheKey(userMessage)}`;
    const cached = responseCache.get(cacheKey);
    if (cached) {
      console.log(`[rag] Cache hit for quick prompt: "${userMessage}"`);
      return cached;
    }
  }

  // Optimization: Cache bot lookups (they don't change often)
  let bot = botCache.get(botId);
  if (!bot) {
    bot = await prisma.bot.findUnique({
      where: { id: botId },
      select: {
        id: true,
        greetingMessage: true,
        tone: true,
        humanFallbackMessage: true,
        confidenceThreshold: true,
      },
    });
    if (bot) {
      botCache.set(botId, bot);
    }
  }

  if (!bot) {
    throw new Error("Bot not found");
  }

  // isQuickPrompt already defined above for caching
  const maxChunks = isQuickPrompt ? 3 : 10; // Fewer chunks for quick prompts = faster retrieval
  
  // Dynamic threshold: hard floor of 0.3 for minimum similarity
  const { chunks, confidence } = await retrieveContext(botId, userMessage, maxChunks, 0.3);

  console.log(`[rag] generateResponse: botId=${botId}, chunks=${chunks.length}, confidence=${confidence.toFixed(3)}`);

  // Answer Confidence Guard: If top similarity < 0.3, return fallback immediately
  // This prevents hallucinations from weakly related content
  const CONFIDENCE_FLOOR = 0.3;
  if (confidence < CONFIDENCE_FLOOR) {
    const totalChunks = await prisma.chunk.count({ where: { botId } });
    console.log(`[rag] Confidence guard triggered: ${confidence.toFixed(3)} < ${CONFIDENCE_FLOOR}`);
    
    if (totalChunks === 0) {
      return {
        response:
          "This bot doesn't have any content yet. Add sources and train it from the dashboard, then try again.",
        sources: [],
        confidence: 0,
      };
    }
    
    // Return honest fallback when confidence is too low
    return {
      response: bot.humanFallbackMessage || "I couldn't find this information in your content. Would you like to leave your contact and we'll get back to you?",
      sources: [],
      confidence,
    };
  }

  if (chunks.length === 0) {
    const totalChunks = await prisma.chunk.count({ where: { botId } });
    console.log(`[rag] No chunks found for query, totalChunks in DB: ${totalChunks}`);
    if (totalChunks === 0) {
      return {
        response:
          "This bot doesn't have any content yet. Add sources and train it from the dashboard, then try again.",
        sources: [],
        confidence: 0,
      };
    }
    // This shouldn't happen if confidence >= 0.3, but handle it anyway
    console.log(`[rag] Warning: ${totalChunks} chunks exist but none matched the query`);
    return {
      response: bot.humanFallbackMessage || "I couldn't find this information in your content.",
      sources: [],
      confidence: 0,
    };
  }

  const contextText =
    chunks.length > 0
      ? chunks.map((c) => c.content).join("\n\n---\n\n")
      : "";
  console.log(`[rag] contextText length: ${contextText.length} chars`);
  
  // Optimization: Skip summarization for quick prompts to reduce latency (saves 1 OpenAI API call)
  // Only summarize if context is large (>2000 chars) and not a quick prompt
  const shouldSummarize = !isQuickPrompt && (contextText.length > 2000 || chunks.length > 3);
  
  const contextSummary = shouldSummarize
    ? await summarizeContext(contextText, userMessage)
    : contextText.slice(0, 2000); // Use raw context for quick prompts (faster, saves API call)
  
  console.log(`[rag] ${shouldSummarize ? 'Summarized' : 'Using raw'} context (quickPrompt=${isQuickPrompt}): ${contextSummary.substring(0, 200)}...`);

  const systemPrompt = buildSystemPrompt(
    bot.greetingMessage,
    bot.tone,
    contextSummary,
    bot.humanFallbackMessage,
    !shouldSummarize || isQuickPrompt // Pass flag if using raw context
  );
  console.log(`[rag] confidenceThreshold=${bot.confidenceThreshold}, using fallback only if summary truly doesn't help`);

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...messageHistory.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  // Optimization: Use faster settings for quick prompts
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    temperature: 0.3,
    max_tokens: isQuickPrompt ? 150 : 300, // Shorter responses for quick prompts
    stream: false, // Ensure no streaming overhead
  });

  const response = completion.choices[0]?.message?.content || bot.humanFallbackMessage;
  const sources = [...new Set(chunks.map((c) => c.metadata?.sourceUrl as string).filter(Boolean))];

  const result = {
    response,
    sources,
    confidence,
  };

  // Optimization: Cache response for quick prompts
  if (isQuickPrompt && messageHistory.length === 0) {
    const cacheKey = `${botId}:${normalizeCacheKey(userMessage)}`;
    responseCache.set(cacheKey, result, 300000); // 5 minutes cache
  }

  console.log(`[rag] Generated response length: ${response.length}, sources: ${sources.length}, confidence: ${confidence.toFixed(3)}`);
  console.log(`[rag] Response preview: ${response.substring(0, 150)}...`);

  return result;
}
