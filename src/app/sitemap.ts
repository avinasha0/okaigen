import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://okaigen.com";

const STATIC = [
  "",
  "/demo",
  "/pricing",
  "/signup",
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

export default function sitemap(): MetadataRoute.Sitemap {
  return STATIC.map((path) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: (path.startsWith("/tools") ? "weekly" : "monthly") as "weekly" | "monthly",
    priority: path === "" ? 1 : path === "/tools" ? 0.9 : 0.8,
  }));
}
