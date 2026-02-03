import { openai, CHAT_MODEL } from "./openai";

export async function generateWithAI(
  systemPrompt: string,
  userContent: string,
  options?: { maxTokens?: number; temperature?: number }
): Promise<string> {
  const completion = await openai.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 1024});
  const text = completion.choices[0]?.message?.content?.trim();
  if (!text) throw new Error("No response generated");
  return text;
}
