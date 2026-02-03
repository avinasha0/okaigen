"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      render: (container: HTMLElement, options: { sitekey: string; theme?: "light" | "dark"; size?: "normal" | "compact" }) => number;
      getResponse: (widgetId: number) => string;
      reset: (widgetId: number) => void;
    };
  }
}

/** Only true when NEXT_PUBLIC_RECAPTCHA_ENABLED is "true" (set only in production). Disabled on localhost. */
const recaptchaEnabled =
  typeof window !== "undefined" &&
  process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true";

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ?? "";
const SCRIPT_URL = "https://www.google.com/recaptcha/api.js";

interface ReCaptchaProps {
  onChange?: (token: string | null) => void;
  theme?: "light" | "dark";
  size?: "normal" | "compact";
}

/**
 * reCAPTCHA v2 checkbox component. Only renders when enabled in production.
 * On localhost, renders nothing (reCAPTCHA disabled).
 */
export function ReCaptcha({ onChange, theme = "light", size = "normal" }: ReCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);
  const scriptLoadedRef = useRef(false);

  useEffect(() => {
    if (!recaptchaEnabled || !SITE_KEY) {
      setReady(true);
      return;
    }

    if (scriptLoadedRef.current) {
      setReady(true);
      return;
    }

    const script = document.createElement("script");
    script.src = SCRIPT_URL;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      scriptLoadedRef.current = true;
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setReady(true));
      } else {
        setReady(true);
      }
    };
    script.onerror = () => setReady(true);
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ready || !recaptchaEnabled || !SITE_KEY || !containerRef.current || widgetIdRef.current !== null) {
      return;
    }

    if (window.grecaptcha) {
      try {
        const widgetId = window.grecaptcha.render(containerRef.current, {
          sitekey: SITE_KEY,
          theme,
          size,
          callback: (token: string) => {
            onChange?.(token);
          },
          "expired-callback": () => {
            onChange?.(null);
          },
          "error-callback": () => {
            onChange?.(null);
          },
        });
        widgetIdRef.current = widgetId;
      } catch (e) {
        console.error("reCAPTCHA render error:", e);
      }
    }
  }, [ready, onChange, theme, size]);

  if (!recaptchaEnabled || !SITE_KEY) {
    return null;
  }

  return <div ref={containerRef} />;
}

/**
 * Hook to get reCAPTCHA v2 token from a widget.
 * Use with ReCaptcha component - pass the widgetId from the component.
 */
export function useRecaptchaToken(widgetId: number | null): string | null {
  if (!recaptchaEnabled || !window.grecaptcha || widgetId === null) {
    return null;
  }
  try {
    return window.grecaptcha.getResponse(widgetId);
  } catch {
    return null;
  }
}
