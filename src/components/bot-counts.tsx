"use client";

import { useEffect, useState } from "react";

type CountsMap = Record<string, { chunks: number; chats: number; leads: number }>;

let countsCache: CountsMap | null = null;
let countsPromise: Promise<CountsMap> | null = null;

async function loadCounts(): Promise<CountsMap> {
  const res = await fetch("/api/dashboard/bot-counts", { cache: "no-store" });
  const json = await res.json();
  return json.counts as CountsMap;
}

export function BotCounts({ botId }: { botId: string }) {
  const [counts, setCounts] = useState<{ chunks: number; chats: number; leads: number } | null>(
    countsCache ? countsCache[botId] ?? null : null
  );

  useEffect(() => {
    if (countsCache) {
      setCounts(countsCache[botId] ?? null);
      return;
    }
    if (!countsPromise) {
      countsPromise = loadCounts().then((data) => {
        countsCache = data;
        return data;
      });
    }
    countsPromise.then((data) => {
      setCounts(data[botId] ?? null);
    });
  }, [botId]);

  if (!counts) {
    return <span>Loading counts…</span>;
  }

  return (
    <span>
      {counts.chunks} chunks · {counts.chats} chats · {counts.leads} leads
    </span>
  );
}
