"use client";

import { useEffect } from "react";

/** Load widget script after page is idle to avoid blocking initial paint and main thread. */
function loadWidgetScript(botKey: string) {
  if (!botKey) return;
  const existingScript = document.querySelector(`script[data-bot="${botKey}"]`);
  if (existingScript) return;

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
  const script = document.createElement("script");
  script.src = `${baseUrl}/widget.js`;
  script.async = true;
  script.setAttribute("data-bot", botKey);
  script.setAttribute("data-base", baseUrl);
  document.body.appendChild(script);
}

export function ChatWidget({ botKey }: { botKey: string }) {
  useEffect(() => {
    if (!botKey) return;

    let cancelled = false;
    const load = () => {
      if (!cancelled) loadWidgetScript(botKey);
    };

    // Defer widget until after first paint: use requestIdleCallback with timeout fallback
    const idleId =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(load, { timeout: 3000 })
        : (setTimeout(load, 500) as unknown as number);

    return () => {
      cancelled = true;
      if (typeof cancelIdleCallback !== "undefined") cancelIdleCallback(idleId);
      else clearTimeout(idleId);
    };
  }, [botKey]);

  return null;
}
