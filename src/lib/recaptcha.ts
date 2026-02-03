/**
 * reCAPTCHA v3 server-side verification.
 * Only enabled in production (not on localhost). Set RECAPTCHA_SECRET_KEY in production.
 */

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/** Whether reCAPTCHA verification is enabled (production + secret key set). */
export function isRecaptchaEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  return Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim());
}

/**
 * Verify a reCAPTCHA v3 token with Google. Returns true if valid and score acceptable.
 * When reCAPTCHA is disabled (e.g. localhost), returns true without calling Google.
 */
export async function verifyRecaptchaToken(
  token: string | null | undefined,
  action?: string
): Promise<{ success: boolean; score?: number; error?: string }> {
  if (!isRecaptchaEnabled()) {
    return { success: true };
  }
  if (!token?.trim()) {
    return { success: false, error: "Missing reCAPTCHA token" };
  }

  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { success: false, error: "reCAPTCHA not configured" };
  }

  try {
    const res = await fetch(RECAPTCHA_VERIFY_URL, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        ...(action && { action }),
      }),
    });
    const data = (await res.json()) as {
      success: boolean;
      score?: number;
      action?: string;
      "error-codes"?: string[];
    };

    if (!data.success) {
      const codes = data["error-codes"]?.join(", ") ?? "unknown";
      return { success: false, error: codes };
    }
    // Optional: enforce minimum score (e.g. 0.5). reCAPTCHA v3 returns 0.0-1.0.
    const score = data.score ?? 0;
    const minScore = 0.5;
    if (score < minScore) {
      return { success: false, score, error: "Score too low" };
    }
    return { success: true, score };
  } catch (e) {
    console.error("reCAPTCHA verify error:", e);
    return { success: false, error: "Verification failed" };
  }
}
