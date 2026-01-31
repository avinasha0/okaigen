"use client";

import { useEffect } from "react";

export function DemoWidget({ botId, baseUrl }: { botId: string; baseUrl: string }) {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = `${baseUrl}/widget.js`;
    script.setAttribute("data-bot", botId);
    script.setAttribute("data-base", baseUrl);
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
      document.querySelectorAll(".atlas-widget").forEach((el) => el.remove());
    };
  }, [botId, baseUrl]);

  return null;
}
