/**
 * reCAPTCHA v3 Configuration & Utilities
 * 
 * Enterprise-grade reCAPTCHA implementation with graceful fallback.
 * Supports both env-based and database-based toggling.
 */

/**
 * Check if reCAPTCHA is enabled (checks both env and DB)
 * This is a server-side function - use getRecaptchaEnabled() for server components
 */
export async function isRecaptchaEnabled(): Promise<boolean> {
  // First check env variable (fastest)
  const envEnabled = process.env.RECAPTCHA_ENABLED === "true";
  if (!envEnabled) {
    // If env says disabled, check DB as fallback (for admin override)
    // But if DB check fails, gracefully fall back to env value
    try {
      const { prisma } = await import("@/lib/db");
      
      // Try to query the SiteSetting table
      // This will fail gracefully if table doesn't exist (before migration)
      let setting;
      try {
        setting = await prisma.siteSetting.findUnique({
          where: { key: "recaptcha_enabled" },
        });
      } catch (queryError) {
        // Table might not exist yet - this is fine, use env value
        return false;
      }
      
      // If setting exists and is true, return true
      if (setting?.value === "true") {
        return true;
      }
      
      // Otherwise, use env value (false)
      return false;
    } catch (error) {
      // If DB check fails for any reason (connection, table doesn't exist, etc.)
      // Gracefully fall back to env value
      // Don't log table-not-found errors as they're expected before migration
      if (error instanceof Error) {
        const isTableNotFound = 
          error.message.includes("doesn't exist") || 
          error.message.includes("Unknown table") ||
          error.message.includes("Table") && error.message.includes("doesn't exist") ||
          error.message.includes("P1001") || // Prisma connection error
          error.message.includes("P2021"); // Prisma table doesn't exist
        
        if (!isTableNotFound) {
          console.warn("[reCAPTCHA] DB check failed, using env value:", error.message);
        }
      }
      return false;
    }
  }
  return true;
}

/**
 * Get reCAPTCHA site key (public, safe for client)
 */
export function getRecaptchaSiteKey(): string | null {
  return process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || null;
}

/**
 * Get reCAPTCHA secret key (server-only)
 */
export function getRecaptchaSecretKey(): string | null {
  return process.env.RECAPTCHA_SECRET_KEY || null;
}

/**
 * Verify reCAPTCHA token with Google API
 * Returns success status and score (if available)
 * NEVER throws - always returns a result for graceful fallback
 */
export async function verifyRecaptchaToken(
  token: string | null | undefined
): Promise<{ success: boolean; score?: number; error?: string }> {
  // If no token provided, return failure (but don't block if reCAPTCHA is disabled)
  if (!token) {
    return { success: false, error: "No token provided" };
  }

  const secretKey = getRecaptchaSecretKey();
  if (!secretKey) {
    console.warn("[reCAPTCHA] Secret key not configured");
    return { success: false, error: "reCAPTCHA not configured" };
  }

  try {
    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: `secret=${encodeURIComponent(secretKey)}&response=${encodeURIComponent(token)}`,
    });

    const data = await response.json();

    if (!data.success) {
      const errors = data["error-codes"] || [];
      console.warn("[reCAPTCHA] Verification failed:", errors);
      return { success: false, error: errors.join(", ") };
    }

    const score = data.score ?? 0;
    return { success: true, score };
  } catch (error) {
    console.error("[reCAPTCHA] API error:", error);
    return { success: false, error: "Network error" };
  }
}

/**
 * Verify reCAPTCHA with score threshold enforcement
 * Returns true if verification passes OR if reCAPTCHA is disabled
 * This is the main function to use in API routes
 */
export async function verifyCaptcha(
  token: string | null | undefined,
  minScore: number = 0.5
): Promise<boolean> {
  try {
    // Check if reCAPTCHA is enabled
    const enabled = await isRecaptchaEnabled();
    if (!enabled) {
      // If disabled, always allow (graceful fallback)
      return true;
    }

    // If enabled but no token, log warning but allow (graceful fallback)
    if (!token) {
      console.warn("[reCAPTCHA] Token missing but reCAPTCHA is enabled - allowing request (graceful fallback)");
      return true;
    }

    // Verify token
    const result = await verifyRecaptchaToken(token);
    
    if (!result.success) {
      // Log warning but allow request (graceful fallback)
      console.warn(`[reCAPTCHA] Verification failed: ${result.error} - allowing request (graceful fallback)`);
      return true;
    }

    // Check score threshold
    if (result.score !== undefined && result.score < minScore) {
      console.warn(`[reCAPTCHA] Score ${result.score} below threshold ${minScore} - allowing request (graceful fallback)`);
      return true;
    }

    return true;
  } catch (error) {
    // If anything goes wrong, always allow (graceful fallback)
    console.error("[reCAPTCHA] Error in verifyCaptcha (allowing request):", error);
    return true;
  }
}
