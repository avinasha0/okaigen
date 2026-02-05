import { MetadataRoute } from "next";
import fs from "fs";
import path from "path";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";

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
        url: `${BASE.replace(/\/$/, "")}/learn/${slug}`,
        lastModified: stat.mtime,
      };
    });
}

const STATIC = [
  "",
  "/demo",
  "/pricing",
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
  if (path === "/pricing" || path === "/docs" || path === "/tools") return 0.9;
  if (path === "/contact" || path === "/demo" || path === "/signup" || path === "/integration") return 0.85;
  if (path.startsWith("/docs")) return 0.85;
  if (path === "/privacy" || path === "/terms" || path === "/refund") return 0.7;
  return 0.8;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries = STATIC.map((p) => ({
    url: `${BASE}${p}`,
    lastModified: new Date(),
    changeFrequency: (p.startsWith("/tools") ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: getPriority(p),
  }));
  const learnEntries = getLearnUrls();
  return [...staticEntries, ...learnEntries];
}
