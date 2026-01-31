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

  // Remove junk elements for content extraction
  JUNK_SELECTORS.forEach((selector) => {
    $(selector).remove();
  });

  const title = $("title").text().trim() || $("h1").first().text().trim() || "";

  // Get main content - prefer article, main, or body
  let contentEl = $("article").first();
  if (!contentEl.length) contentEl = $("main").first();
  if (!contentEl.length) contentEl = $("body");

  const content = contentEl
    .find("p, h1, h2, h3, h4, h5, h6, li, td, th, blockquote")
    .map((_, el) => $(el).text().trim())
    .get()
    .filter((t) => t.length > 0)
    .join("\n\n");

  return {
    url: baseUrl,
    title,
    content: content || $("body").text().replace(/\s+/g, " ").trim(),
    links: [...new Set(links)],
  };
}

export function isSameOrigin(url1: string, url2: string): boolean {
  try {
    return new URL(url1).origin === new URL(url2).origin;
  } catch {
    return false;
  }
}
