"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const STORAGE_KEY = "sitebotgpt-cookie-consent";

/** "all" = accept optional (e.g. analytics); "essential" = essential only; null = not set */
type Consent = "all" | "essential" | null;

export function CookieConsentBanner() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) as Consent | null;
      if (raw === "all" || raw === "essential") setConsent(raw);
    } catch {
      /* ignore */
    }
    setMounted(true);
  }, []);

  function save(value: Consent) {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      setConsent(value);
    } catch {
      /* ignore */
    }
  }

  if (!mounted || consent !== null) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-0 left-0 right-0 z-[999999] border-t border-slate-200 bg-white px-4 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:px-6 md:px-8"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-700">
          We use cookies for essential site function (e.g. sign-in) and may use optional cookies for analytics to improve our service. See our{" "}
          <Link href="/privacy#cookies" className="font-medium text-[#1a6aff] hover:underline">
            Privacy Policy
          </Link>{" "}
          for details.
        </p>
        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => save("essential")}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            Essential only
          </button>
          <button
            type="button"
            onClick={() => save("all")}
            className="rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0d5aeb]"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  );
}
