"use client";

import { useState, useEffect } from "react";

/**
 * Client-side hook to check if reCAPTCHA is enabled
 * Fetches status from API to get both env and DB settings
 * 
 * Usage:
 *   const { enabled, loading } = useRecaptchaStatus();
 */
export function useRecaptchaStatus() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStatus() {
      try {
        const res = await fetch("/api/admin/recaptcha-toggle");
        if (res.ok) {
          const data = await res.json();
          setEnabled(data.enabled);
        } else {
          // Fallback to env check if API fails
          setEnabled(process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true");
        }
      } catch {
        // Fallback to env check on error
        setEnabled(process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true");
      } finally {
        setLoading(false);
      }
    }

    fetchStatus();
  }, []);

  return { enabled, loading };
}

/**
 * Simple client-side check (env only, no API call)
 * Use this for quick checks without loading state
 * 
 * Usage:
 *   const isEnabled = isRecaptchaEnabledClient();
 */
export function isRecaptchaEnabledClient(): boolean {
  return process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";
}
