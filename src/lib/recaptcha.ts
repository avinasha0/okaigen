/**
 * reCAPTCHA v2 server-side verification.
 * Only enabled in production (not on localhost). Set RECAPTCHA_SECRET_KEY in production.
 */

const RECAPTCHA_VERIFY_URL = "https://www.google.com/recaptcha/api/siteverify";

/** Whether reCAPTCHA verification is enabled (production + secret key set). */
export function isRecaptchaEnabled(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  return Boolean(process.env.RECAPTCHA_SECRET_KEY?.trim());
}

/**
 * Verify a reCAPTCHA v2 token with Google. Returns true if valid.
 * When reCAPTCHA is disabled (e.g. localhost), returns true without calling Google.
 */
export async function verifyRecaptchaToken(
  token: string | null | undefined
): Promise<{ success: boolean; error?: string }> {
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
      }),
    });
    const data = (await res.json()) as {
      success: boolean;
      "error-codes"?: string[];
    };

    if (!data.success) {
      const codes = data["error-codes"]?.join(", ") ?? "unknown";
      return { success: false, error: codes };
    }
    return { success: true };
  } catch (e) {
    console.error("reCAPTCHA verify error:", e);
    return { success: false, error: "Verification failed" };
  }
}
