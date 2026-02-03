"use client";

import { useGoogleReCaptcha } from "react-google-recaptcha-v3";
import { useMemo } from "react";

/**
 * Custom hook for reCAPTCHA v3 token generation
 * 
 * Usage:
 *   const getCaptchaToken = useCaptcha();
 *   const token = await getCaptchaToken("signup");
 * 
 * Returns null if reCAPTCHA is disabled or unavailable.
 * Never throws - always returns null on failure for graceful fallback.
 */
export function useCaptcha() {
  // Always call the hook (React rules) - provider is always rendered now
  const enabled = process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  
  // Get executeRecaptcha from the hook
  // It will be undefined if reCAPTCHA is disabled (empty key in provider)
  const { executeRecaptcha } = useGoogleReCaptcha();

  const getToken = useMemo(
    () => async (action: string): Promise<string | null> => {
      // Check if reCAPTCHA is enabled (client-side check via env)
      if (!enabled) {
        // If disabled, return null (frontend will proceed without token)
        return null;
      }

      // Check if site key is configured
      if (!siteKey) {
        console.warn("[reCAPTCHA] Site key not configured");
        return null;
      }

      // Check if executeRecaptcha is available
      if (!executeRecaptcha) {
        // This is fine - reCAPTCHA might be disabled or provider not rendered
        return null;
      }

      try {
        const token = await executeRecaptcha(action);
        return token || null;
      } catch (error) {
        console.warn("[reCAPTCHA] Token generation failed:", error);
        return null;
      }
    },
    [enabled, siteKey, executeRecaptcha]
  );

  return getToken;
}
