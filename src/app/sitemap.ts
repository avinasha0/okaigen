import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE = (process.env.NEXT_PUBLIC_APP_URL || "https://www.sitebotgpt.com").replace(/\/$/, "");

/** Paths that must never appear in the sitemap (private, auth, API). */
const EXCLUDED_PREFIXES = ["/dashboard", "/login", "/api", "/forgot-password", "/reset-password", "/verify-email"];

function isExcluded(urlPath: string): boolean {
  return EXCLUDED_PREFIXES.some((prefix) => urlPath === prefix || urlPath.startsWith(prefix + "/"));
}

/** Get last modified date for a static app route; uses file mtime when available. */
function getLastModForStaticRoute(segmentPath: string): Date {
  const appDir = path.join(process.cwd(), "src", "app");
  const segments = (segmentPath || "").replace(/^\//, "").split("/").filter(Boolean);
  const routePath = segments.length ? path.join(appDir, ...segments) : appDir;
  const candidates = ["page.tsx", "layout.tsx"];
  for (const name of candidates) {
    const filePath = path.join(routePath, name);
    if (fs.existsSync(filePath)) {
      try {
        return fs.statSync(filePath).mtime;
      } catch {
        break;
      }
    }
  }
  return new Date();
}

function getLearnUrls(): MetadataRoute.Sitemap {
  const learnDir = path.join(process.cwd(), "docs", "learn");
  if (!fs.existsSync(learnDir)) return [];
  const files = fs.readdirSync(learnDir);
  return files
    .filter((f) => f.endsWith(".md") && /^[a-z0-9-]+\.md$/.test(f))
    .map((f) => {
      const slug = f.replace(/\.md$/, "");
      const filePath = path.join(learnDir, f);
      const stat = fs.statSync(filePath);
      return {
        url: `${BASE}/learn/${slug}`,
        lastModified: stat.mtime,
      };
    });
}

/** Only public, indexable pages. Excludes /dashboard, /login, /api, auth routes. */
const STATIC = [
  "",
  "/demo",
  "/pricing",
  "/features",
  "/use-cases",
  "/compare",
  "/signup",
  "/contact",
  "/docs",
  "/docs/api",
  "/privacy",
  "/terms",
  "/refund",
  "/integration",
  "/tools",
  "/tools/convert-pdf-to-markdown",
  "/tools/convert-docx-to-markdown",
  "/tools/convert-html-to-markdown",
  "/tools/convert-notion-to-markdown",
  "/tools/convert-google-docs-to-markdown",
  "/tools/convert-xml-to-markdown",
  "/tools/convert-csv-to-markdown",
  "/tools/convert-json-to-markdown",
  "/tools/convert-rtf-to-markdown",
  "/tools/convert-paste-to-markdown",
  "/tools/convert-webpage-to-markdown",
  "/tools/ai-chat-text",
  "/tools/ai-chat-website",
  "/tools/ai-chat-document",
  "/tools/ai-chat-pdf",
  "/tools/ai-chat-word",
  "/tools/ai-reply-generator",
  "/tools/ai-prompt-generator",
  "/tools/ai-prompt-optimizer",
  "/tools/ai-faq-generator",
  "/tools/ai-answer-generator",
  "/tools/ai-email-response-generator",
  "/tools/ai-letter-generator",
  "/tools/ai-blog-title-generator",
  "/tools/ai-chatbot-name-generator",
  "/tools/ai-saas-brand-name-generator",
  "/tools/ai-chatbot-conversation-analysis",
  "/tools/sitemap-finder-checker",
  "/tools/sitemap-validator",
  "/tools/xml-sitemap-generator",
  "/tools/sitemap-url-extractor",
  "/tools/website-url-extractor",
  "/tools/chatbot-roi-calculator",
  "/tools/email-signature-generator",
  "/tools/sourcesync",
];

function getPriority(path: string): number {
  if (path === "") return 1;
  if (path === "/pricing" || path === "/docs" || path === "/tools" || path === "/features" || path === "/use-cases" || path === "/compare") return 0.9;
  if (path === "/contact" || path === "/demo" || path === "/signup" || path === "/integration") return 0.85;
  if (path.startsWith("/docs")) return 0.85;
  if (path === "/privacy" || path === "/terms" || path === "/refund") return 0.7;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC.filter((p) => !isExcluded(p))
    .map((p) => ({
      url: p ? `${BASE}${p}` : BASE,
      lastModified: getLastModForStaticRoute(p),
      changeFrequency: (p.startsWith("/tools") ? "weekly" : "monthly") as "weekly" | "monthly",
      priority: getPriority(p),
    }));
  const learnEntries = getLearnUrls();
  return [...staticEntries, ...learnEntries];
}
