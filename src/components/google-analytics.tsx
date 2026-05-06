"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "sitebotgpt-cookie-consent";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

type Consent = "all" | "essential" | null;

function readConsent(): Consent {
  try {
    const raw = localStorage.getItem(STORAGE_KEY) as Consent | null;
    return raw === "all" || raw === "essential" ? raw : null;
  } catch {
    return null;
  }
}

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();

  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const sync = () => setConsent(readConsent());
    sync();

    const onConsent = (e: Event) => {
      const value = (e as CustomEvent<Consent>).detail;
      if (value === "all" || value === "essential") setConsent(value);
      else sync();
    };

    window.addEventListener("cookie-consent", onConsent);
    return () => window.removeEventListener("cookie-consent", onConsent);
  }, []);

  useEffect(() => {
    if (!measurementId) return;
    if (typeof window.gtag !== "function") return;

    // Default to denied until explicit opt-in ("Accept all").
    window.gtag("consent", "default", {
      ad_storage: "denied",
      analytics_storage: "denied",
      functionality_storage: "granted",
      personalization_storage: "denied",
      security_storage: "granted",
      wait_for_update: 500,
    });

    if (consent !== "all") return;

    window.gtag("consent", "update", {
      ad_storage: "denied",
      analytics_storage: "granted",
    });

    const qs = typeof window !== "undefined" ? window.location.search : "";
    const pagePath = `${pathname}${qs || ""}`;
    window.gtag("config", measurementId, { page_path: pagePath });
  }, [consent, measurementId, pathname]);

  if (!measurementId) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
gtag('config', '${measurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}

