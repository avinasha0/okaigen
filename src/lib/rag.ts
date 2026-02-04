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
import { searchVectors, type VectorResult, cosineSimilarity } from "./vector-search";
import { responseCache, normalizeCacheKey, botCache, chunkCountCache, requestDeduplicator } from "./cache";

export interface RAGContext {
  chunks: VectorResult[];
  confidence: number;
}

/** Ensures vector from DB (stored as JSON string) is number[]; parses JSON if needed. */
function toNumberVector(raw: unknown): number[] {
  // Handle JSON string (current storage format)
  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
      }
    } catch {
      return [];
    }
  }
  // Handle array (legacy format or direct array)
  if (Array.isArray(raw)) {
    return raw.map((v) => Number(v)).filter((n) => !Number.isNaN(n));
  }
  return [];
}

export async function retrieveContext(
  botId: string,
  query: string,
  maxChunks: number = 10,
  minSimilarity: number = 0.3 // Hard floor: minimum similarity to consider
): Promise<RAGContext> {
  // Optimization: Generate embedding in parallel with initial bot validation
  const queryEmbeddingPromise = generateEmbedding(query);

  // Optimization: Two-stage retrieval to reduce payload:
  // 1) Fetch only embeddings (vector + chunkId) with a smaller limit
  // 2) After scoring, fetch content+metadata for top IDs only
  const EMBEDDING_LIMIT = 300;
  const embeddingsPromise = prisma.embedding.findMany({
    where: { botId },
    select: { chunkId: true, vector: true },
    take: EMBEDDING_LIMIT,
    orderBy: { createdAt: "desc" },
  });

  // Wait for both operations in parallel
  const [queryEmbedding, embeddings] = await Promise.all([queryEmbeddingPromise, embeddingsPromise]);

  console.log(`[rag] retrieveContext: botId=${botId}, query="${query}", embeddings=${embeddings.length}`);

  // Optimization: Pre-filter and convert vectors in one pass with early termination
  // Use a more efficient approach: compute similarity as we go and keep top candidates
  const scoredIds: Array<{ id: string; similarity: number }> = [];
  
  for (const e of embeddings) {
    const vector = toNumberVector(e.vector);
    if (vector.length !== queryEmbedding.length) continue;
    
    // Compute similarity immediately and keep only promising candidates
    const similarity = cosineSimilarity(queryEmbedding, vector);
    if (similarity >= minSimilarity) {
      scoredIds.push({ id: e.chunkId, similarity });
    }
  }

  // Sort by similarity (descending) and take top results
  scoredIds.sort((a, b) => b.similarity - a.similarity);
  const topIds = scoredIds.slice(0, maxChunks * 2); // Get 2x for windowing

  console.log(`[rag] scored embeddings: ${scoredIds.length} candidates >= ${minSimilarity}`);

  // Apply adaptive windowing to top candidates
  let results: VectorResult[] = [];
  if (topIds.length > 0) {
    const topScore = topIds[0].similarity;
    const scoreWindow = Math.max(minSimilarity, topScore - 0.1);
    const finalIds = topIds.filter((r) => r.similarity >= scoreWindow).slice(0, maxChunks).map((r) => r.id);
    // Fetch content + metadata only for selected IDs
    const topChunks = await prisma.chunk.findMany({
      where: { id: { in: finalIds } },
      select: { id: true, content: true, metadata: true },
    });
    // Map by id for quick lookup of similarity
    const simMap = new Map(scoredIds.map((s) => [s.id, s.similarity]));
    results = topChunks.map((c) => {
      let metadata: Record<string, unknown> = {};
      if (c.metadata) {
        try {
          metadata = JSON.parse(c.metadata) as Record<string, unknown>;
        } catch {
          metadata = {};
        }
      }
      return {
        chunkId: c.id,
        content: c.content,
        metadata,
        similarity: simMap.get(c.id) || minSimilarity,
      };
    });
    // Sort results by similarity desc
    results.sort((a, b) => b.similarity - a.similarity);
  }

  const confidence = results.length > 0 ? results[0].similarity : 0;

  console.log(`[rag] searchVectors results: ${results.length} chunks found, top similarity=${confidence.toFixed(3)}`);
  if (results.length > 0) {
    const topScores = results.slice(0, Math.min(5, results.length)).map(r => r.similarity.toFixed(3)).join(", ");
    console.log(`[rag] Top chunk similarity scores: ${topScores}`);
    console.log(`[rag] Top chunk preview: ${results[0].content.substring(0, 200)}`);
  }

  return {
    chunks: results,
    confidence};
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
          "You summarize content into 4-6 short bullet points. Each bullet is under 10 words. Use your own words. Do not copy phrases. Output only the bullets, nothing else."},
      {
        role: "user",
        content: `Topic: ${userMessage}\n\nContent to summarize:\n${contextText.slice(0, 6000)}`},
    ],
    temperature: 0.2,
    max_tokens: 200});
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

    // Optimization: Deduplicate identical requests (prevent processing same question twice simultaneously)
    const dedupeKey = `response:${cacheKey}`;
    return requestDeduplicator.deduplicate(dedupeKey, async () => {
      return generateResponseInternal(botId, userMessage, messageHistory, isQuickPrompt);
    });
  }

  return generateResponseInternal(botId, userMessage, messageHistory, isQuickPrompt);
}

async function generateResponseInternal(
  botId: string,
  userMessage: string,
  messageHistory: { role: "user" | "assistant"; content: string }[],
  isQuickPrompt: boolean
): Promise<{
  response: string;
  sources: string[];
  confidence: number;
}> {

  // Optimization: Cache bot lookups (they don't change often) and parallelize with context retrieval
  let bot = botCache.get(botId);
  const botPromise = bot
    ? Promise.resolve(bot)
    : prisma.bot.findUnique({
        where: { id: botId },
        select: {
          id: true,
          greetingMessage: true,
          tone: true,
          humanFallbackMessage: true,
          confidenceThreshold: true}}).then((b) => {
        if (b) {
          botCache.set(botId, b);
        }
        return b;
      });

  // Optimization: Start context retrieval early (it generates embedding internally)
  // This runs in parallel with bot lookup
  const maxChunks = isQuickPrompt ? 3 : 10; // Fewer chunks for quick prompts = faster retrieval
  const contextPromise = retrieveContext(botId, userMessage, maxChunks, 0.3);

  // Wait for both bot and context in parallel
  const [botData, { chunks, confidence }] = await Promise.all([botPromise, contextPromise]);

  if (!botData) {
    throw new Error("Bot not found");
  }
  bot = botData;

  console.log(`[rag] generateResponse: botId=${botId}, chunks=${chunks.length}, confidence=${confidence.toFixed(3)}`);

  // Answer Confidence Guard: If top similarity < 0.3, return fallback immediately
  // This prevents hallucinations from weakly related content
  const CONFIDENCE_FLOOR = 0.3;
  if (confidence < CONFIDENCE_FLOOR || chunks.length === 0) {
    console.log(`[rag] Confidence guard triggered: ${confidence.toFixed(3)} < ${CONFIDENCE_FLOOR} or no chunks`);
    
    // Optimization: Use cached chunk count to avoid DB query
    if (confidence === 0 && chunks.length === 0) {
      // Check if bot has any chunks at all (cached)
      let totalChunks = chunkCountCache.get(botId);
      if (totalChunks === null) {
        totalChunks = await prisma.chunk.count({ where: { botId } });
        chunkCountCache.set(botId, totalChunks);
      }
      
      if (totalChunks === 0) {
        return {
          response:
            "This bot doesn't have any content yet. Add sources and train it from the dashboard, then try again.",
          sources: [],
          confidence: 0};
      }
    }
    
    // Return honest fallback when confidence is too low
    return {
      response: bot.humanFallbackMessage || "I couldn't find this information in your content. Would you like to leave your contact and we'll get back to you?",
      sources: [],
      confidence};
  }

  // Optimization: Build context text efficiently
  const contextText = chunks.map((c) => c.content).join("\n\n---\n\n");
  console.log(`[rag] contextText length: ${contextText.length} chars`);
  
  // Optimization: Skip summarization for quick prompts to reduce latency (saves 1 OpenAI API call)
  // Only summarize if context is large (>2000 chars) and not a quick prompt
  // Also use smarter threshold: summarize if context > 3000 chars OR if we have many chunks (>5)
  const shouldSummarize = !isQuickPrompt && (contextText.length > 3000 || chunks.length > 5);
  
  // Optimization: For quick prompts or small context, use raw context directly (no API call)
  // For larger contexts, summarize to reduce token usage and improve relevance
  const contextSummary = shouldSummarize
    ? await summarizeContext(contextText, userMessage)
    : contextText.slice(0, isQuickPrompt ? 1500 : 2500); // Slightly larger limit for non-quick prompts
  
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

  // Optimization: Use faster settings for quick prompts and optimize token limits
  // Use lower temperature for more deterministic, faster responses
  // Reduce max_tokens for quicker generation (model generates faster with lower limits)
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    temperature: isQuickPrompt ? 0.2 : 0.3, // Lower temp = faster, more deterministic
    max_tokens: isQuickPrompt ? 120 : 250, // Reduced for faster generation
    stream: false, // Ensure no streaming overhead
    // Optimization: Add timeout to prevent hanging requests
  }, {
    timeout: 30000, // 30 second timeout
  });

  const response = completion.choices[0]?.message?.content || bot.humanFallbackMessage;
  const sources = [...new Set(chunks.map((c) => c.metadata?.sourceUrl as string).filter(Boolean))];

  const result = {
    response,
    sources,
    confidence};

  // Optimization: Cache response for quick prompts
  if (isQuickPrompt && messageHistory.length === 0) {
    const cacheKey = `${botId}:${normalizeCacheKey(userMessage)}`;
    responseCache.set(cacheKey, result, 300000); // 5 minutes cache
  }

  console.log(`[rag] Generated response length: ${response.length}, sources: ${sources.length}, confidence: ${confidence.toFixed(3)}`);
  console.log(`[rag] Response preview: ${response.substring(0, 150)}...`);

  return result;
}

/**
 * Generate streaming response - returns an async generator that yields text chunks
 */
export async function* generateResponseStream(
  botId: string,
  userMessage: string,
  messageHistory: { role: "user" | "assistant"; content: string }[] = []
): AsyncGenerator<string, { sources: string[]; confidence: number }> {
  // Get bot config (cached)
  let bot = botCache.get(botId);
  if (!bot) {
    bot = await prisma.bot.findUnique({
      where: { id: botId },
      select: {
        id: true,
        greetingMessage: true,
        tone: true,
        humanFallbackMessage: true,
        confidenceThreshold: true}});
    if (bot) {
      botCache.set(botId, bot);
    }
  }

  if (!bot) {
    throw new Error("Bot not found");
  }

  const isQuickPrompt = userMessage.length < 60 && (userMessage.includes("?") || userMessage.split(" ").length < 10);
  const maxChunks = isQuickPrompt ? 3 : 10;
  
  // Retrieve context
  const { chunks, confidence } = await retrieveContext(botId, userMessage, maxChunks, 0.3);

  const CONFIDENCE_FLOOR = 0.3;
  if (confidence < CONFIDENCE_FLOOR || chunks.length === 0) {
    let totalChunks = chunkCountCache.get(botId);
    if (totalChunks === null) {
      totalChunks = await prisma.chunk.count({ where: { botId } });
      chunkCountCache.set(botId, totalChunks);
    }
    
    if (totalChunks === 0) {
      const fallback = "This bot doesn't have any content yet. Add sources and train it from the dashboard, then try again.";
      for (const char of fallback) {
        yield char;
      }
      return { sources: [], confidence: 0 };
    }
    
    const fallback = bot.humanFallbackMessage || "I couldn't find this information in your content. Would you like to leave your contact and we'll get back to you?";
    for (const char of fallback) {
      yield char;
    }
    return { sources: [], confidence };
  }

  const contextText = chunks.map((c) => c.content).join("\n\n---\n\n");
  const shouldSummarize = !isQuickPrompt && (contextText.length > 3000 || chunks.length > 5);
  
  const contextSummary = shouldSummarize
    ? await summarizeContext(contextText, userMessage)
    : contextText.slice(0, isQuickPrompt ? 1500 : 2500);

  const systemPrompt = buildSystemPrompt(
    bot.greetingMessage,
    bot.tone,
    contextSummary,
    bot.humanFallbackMessage,
    !shouldSummarize || isQuickPrompt
  );

  const messages: { role: "system" | "user" | "assistant"; content: string }[] = [
    { role: "system", content: systemPrompt },
    ...messageHistory.slice(-10).map((m) => ({ role: m.role, content: m.content })),
    { role: "user", content: userMessage },
  ];

  // Stream the response from OpenAI
  const stream = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages,
    temperature: isQuickPrompt ? 0.2 : 0.3,
    max_tokens: isQuickPrompt ? 120 : 250,
    stream: true, // Enable streaming
  }, {
    timeout: 30000});

  let fullResponse = "";
  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    if (content) {
      fullResponse += content;
      yield content;
    }
  }

  const sources = [...new Set(chunks.map((c) => c.metadata?.sourceUrl as string).filter(Boolean))];
  return { sources, confidence };
}
