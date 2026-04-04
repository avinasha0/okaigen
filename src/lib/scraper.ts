import * as cheerio from "cheerio";

const JUNK_SELECTORS = [
  "nav",
  "header",
  "footer",
  "aside",
  "[role='navigation']",
  "[role='banner']",
  ".nav",
  ".navbar",
  ".header",
  ".footer",
  ".sidebar",
  ".menu",
  ".social-share",
  "script",
  "style",
  "noscript",
  "iframe",
  "form",
  "button",
  ".cookie-banner",
  "#cookie-banner",
];

/** Embedded / SSR chat UIs (SiteBotGPT uses atlas-*). Strip before text extraction so widget copy is not trained. */
const CHAT_WIDGET_SELECTORS = [
  "[class*='atlas-']",
  "[class*='intercom-']",
  "[id*='intercom']",
  "[class*='crisp-']",
  "[id*='crisp']",
  "[class*='drift-']",
  "[class*='tawk-']",
  "[class*='tidio-']",
  "[class*='zendesk']",
  "[class*='hubspot-messages']",
  "[class*='hs-messages']",
  "[class*='livechat']",
  "[class*='chat-widget']",
  "[class*='chat-button']",
  "[data-atlas-widget]",
];

/** Exact lines left over after DOM stripping (common widget chrome). */
const CHAT_UI_LINE_BLOCKLIST = new Set([
  "Ask a question...",
  "SiteBotGPT Helper",
  "Powered by SiteBotGPT",
  "Loading...",
]);

/**
 * Phrases removed anywhere in text — crawler often collapses the page to one line, so newline-only filtering is not enough.
 * Keep phrases long / distinctive to avoid stripping real marketing copy.
 */
const CHAT_UI_SUBSTRING_PHRASES: string[] = [
  "Ask a question...",
  "Hi! How can I help you today?",
  "SiteBotGPT Helper",
  "Powered by SiteBotGPT",
  "Typically replies instantly",
  "Open the chat bubble in the bottom-right corner to start",
  "Click the bubble →",
];

function stripChatUiNoise(content: string): string {
  let out = content
    .split(/\n+/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0 && !CHAT_UI_LINE_BLOCKLIST.has(l))
    .join("\n\n");

  for (const phrase of CHAT_UI_SUBSTRING_PHRASES) {
    const escaped = phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out = out.replace(new RegExp(escaped, "gi"), " ");
  }

  return out.replace(/\s{2,}/g, " ").trim();
}

export interface ScrapedPage {
  url: string;
  title: string;
  content: string;
  links: string[];
}

export function extractTextFromHtml(html: string, baseUrl: string): ScrapedPage {
  const $ = cheerio.load(html);

  // Extract links FIRST (before removing nav) so we capture all internal links
  const links: string[] = [];
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (href && !href.startsWith("#") && !href.startsWith("mailto:") && !href.startsWith("tel:")) {
      try {
        const absolute = new URL(href, baseUrl).href;
        if (new URL(absolute).origin === new URL(baseUrl).origin) {
          links.push(absolute);
        }
      } catch {
        // Invalid URL, skip
      }
    }
  });

  // Remove junk + embedded chat widgets so UI strings are not indexed as knowledge
  [...JUNK_SELECTORS, ...CHAT_WIDGET_SELECTORS].forEach((selector) => {
    $(selector).remove();
  });

  const title = $("title").text().trim() || $("h1").first().text().trim() || "";

  // Get main content - prefer article, main, or body
  let contentEl = $("article").first();
  if (!contentEl.length) contentEl = $("main").first();
  if (!contentEl.length) contentEl = $("body");

  const rawContent = contentEl
    .find("p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 0)
    .join("\n\n");

  const fallbackBody = $("body").text().replace(/\s+/g, " ").trim();
  const merged = rawContent || fallbackBody;
  const content = stripChatUiNoise(merged);

  return {
    url: baseUrl,
    title,
    content,
    links: [...new Set(links)]};
}

export function isSameOrigin(url1: string, url2: string): boolean {
  try {
    return new URL(url1).origin === new URL(url2).origin;
  } catch {
    return false;
  }
}
