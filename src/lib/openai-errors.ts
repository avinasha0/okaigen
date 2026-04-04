import { APIError } from "openai";

/**
 * Maps OpenAI SDK errors to short, actionable text for dashboards and API clients.
 * See https://platform.openai.com/docs/guides/error-codes/api-errors
 */
export function formatOpenAIUserMessage(error: unknown): string {
  if (error instanceof APIError) {
    const status = error.status;
    const raw = error.message ?? "";
    const lower = raw.toLowerCase();

    const nested = error.error as { code?: string; type?: string } | undefined;
    const code = error.code ?? nested?.code ?? nested?.type;

    if (status === 401) {
      return "OpenAI rejected the API key (401). Check OPENAI_API_KEY in your server environment.";
    }

    if (status === 429) {
      if (
        code === "insufficient_quota" ||
        lower.includes("exceeded your current quota") ||
        lower.includes("check your plan and billing") ||
        (lower.includes("quota") && lower.includes("billing"))
      ) {
        return "OpenAI quota or billing: add credits or a payment method at platform.openai.com/account/billing, then retry.";
      }
      return "OpenAI rate limit (429). Wait a moment and retry, or review usage at platform.openai.com/account/usage.";
    }

    if (status === 500 || status === 502 || status === 503) {
      return "OpenAI service error. Try again in a few minutes.";
    }

    if (raw.length > 0 && raw.length < 600) {
      return raw;
    }
  }

  if (error instanceof Error) {
    const m = error.message;
    if (
      m.includes("429") &&
      (m.includes("quota") || m.includes("billing") || m.includes("Exceeded"))
    ) {
      return "OpenAI quota or billing: add credits at platform.openai.com/account/billing, then retry.";
    }
    return m;
  }

  return "An unexpected error occurred.";
}
