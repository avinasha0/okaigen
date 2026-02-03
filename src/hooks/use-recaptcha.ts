"use client";

import { useCallback, useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

/** Only true when NEXT_PUBLIC_RECAPTCHA_ENABLED is "true" (set only in production). Disabled on localhost. */
export const recaptchaEnabled =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const SCRIPT_URL = "https://www.google.com/recaptcha/api.js?render=" + SITE_KEY;

/**
 * Hook to get a reCAPTCHA v3 token. When reCAPTCHA is disabled (e.g. localhost), getToken resolves to "".
 */
export function useRecaptcha() {
  const [ready, setReady] = useState(false);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!recaptchaEnabled || !SITE_KEY) {
      setReady(true);
      return;
    }
    if (scriptLoaded.current) {
      setReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setReady(true));
      } else {
        setReady(true);
      }
    };
    script.onerror = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  const getToken = useCallback(
    async (action: string): Promise<string> => {
      if (!recaptchaEnabled || !SITE_KEY || !window.grecaptcha) return "";
      if (!ready) {
        await new Promise<void>((resolve) => {
          if (window.grecaptcha) {
            window.grecaptcha.ready(() => resolve());
          } else {
            resolve();
          }
        });
      }
      try {
        return await window.grecaptcha.execute(SITE_KEY, { action });
      } catch {
        return "";
      }
    },
    [ready]
  );

  return { getToken, isEnabled: recaptchaEnabled };
}
