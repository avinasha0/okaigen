"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: any[]) => void;
  }
}

export function GoogleAnalyticsClient({ measurementId }: { measurementId?: string }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!measurementId) return;
    if (typeof window.gtag !== "function") return;

    const qs = typeof window !== "undefined" ? window.location.search : "";
    const pagePath = `${pathname}${qs || ""}`;
    window.gtag("config", measurementId, { page_path: pagePath });
  }, [measurementId, pathname]);

  return null;
}

