import { NextResponse } from "next/server";
import { chatWithContent } from "@/lib/chat-with-content";
import * as cheerio from "cheerio";
import { z } from "zod";

const schema = z.object({ url: z.string().min(1), question: z.string().min(1) });

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const parsed = schema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
    const url = parsed.data.url.trim();
    const fullUrl = url.startsWith("http") ? url : "https://" + url;
    const res = await fetch(fullUrl, { headers: { "User-Agent": "Mozilla/5.0" }, signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error("Fetch failed: " + res.status);
    const $ = cheerio.load(await res.text());
    $("script, style, nav, footer").remove();
    const text = $("body").text().replace(/\s+/g, " ").trim().slice(0, 50000);
    if (!text) throw new Error("No content found");
    const answer = await chatWithContent(text, parsed.data.question);
    return NextResponse.json({ answer });
  } catch (err) {
    console.error("[ai-chat-website]", err);
    return NextResponse.json({ error: err instanceof Error ? err.message : "Failed" }, { status: 500 });
  }
}
