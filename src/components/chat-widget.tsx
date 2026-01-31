"use client";

import { useEffect } from "react";

export function ChatWidget({ botKey }: { botKey: string }) {
  useEffect(() => {
    if (!botKey) return;

    // Avoid loading widget twice
    const existingScript = document.querySelector(
      `script[data-bot="${botKey}"]`
    );
    if (existingScript) return;

    const baseUrl =
      typeof window !== "undefined" ? window.location.origin : "";

    const script = document.createElement("script");
    script.src = `${baseUrl}/widget.js`;
    script.async = true;
    script.setAttribute("data-bot", botKey);
    script.setAttribute("data-base", baseUrl);
    document.body.appendChild(script);

    return () => {
      // Cleanup on unmount (optional, widget may stay)
      script.remove();
      document.querySelectorAll(".atlas-widget").forEach((el) => el.remove());
    };
  }, [botKey]);

  return null;
}
