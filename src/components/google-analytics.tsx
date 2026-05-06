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

function readConsent(): "all" | "essential" | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw === "all" || raw === "essential" ? raw : null;
  } catch {
    return null;
  }
}

export function GoogleAnalytics() {
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const pathname = usePathname();

  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const sync = () => setEnabled(readConsent() === "all");
    sync();
    window.addEventListener("cookie-consent", sync);
    return () => window.removeEventListener("cookie-consent", sync);
  }, []);

  useEffect(() => {
    if (!enabled) return;
    if (!measurementId) return;
    if (typeof window.gtag !== "function") return;
    const qs = typeof window !== "undefined" ? window.location.search : "";
    const pagePath = `${pathname}${qs || ""}`;
    window.gtag("config", measurementId, { page_path: pagePath });
  }, [enabled, measurementId, pathname]);

  if (!measurementId || !enabled) return null;

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

