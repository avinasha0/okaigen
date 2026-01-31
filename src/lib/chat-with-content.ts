import { generateWithAI } from "./ai-generate";

const SYSTEM_PROMPT = `You are a helpful assistant. Answer the user's question using ONLY the provided context below. 
- Base your answer strictly on the context. Do not add information from your general knowledge.
- If the context does not contain enough information to answer, say "The provided content doesn't contain enough information to answer this question."
- Be concise and accurate. Quote or paraphrase from the context when relevant.`;

export async function chatWithContent(content: string, question: string): Promise<string> {
  if (!content?.trim()) throw new Error("No content provided");
  if (!question?.trim()) throw new Error("No question provided");
  const userContent = `Context:\n\n${content.trim()}\n\n---\n\nQuestion: ${question.trim()}`;
  return generateWithAI(SYSTEM_PROMPT, userContent, { maxTokens: 1024 });
}
