const fs = require("fs");
const path = require("path");

const TOOL_PATHS = [
  "convert-docx-to-markdown",
  "convert-html-to-markdown",
  "convert-csv-to-markdown",
  "convert-json-to-markdown",
  "convert-rtf-to-markdown",
  "convert-paste-to-markdown",
  "convert-webpage-to-markdown",
  "ai-chat-text",
  "ai-chat-website",
  "ai-chat-document",
  "ai-chat-pdf",
  "ai-chat-word",
  "ai-reply-generator",
  "ai-prompt-generator",
  "ai-prompt-optimizer",
  "ai-faq-generator",
  "ai-answer-generator",
  "ai-email-response-generator",
  "ai-letter-generator",
  "ai-blog-title-generator",
  "ai-chatbot-name-generator",
  "ai-saas-brand-name-generator",
  "ai-chatbot-conversation-analysis",
  "sitemap-finder-checker",
  "sitemap-validator",
  "xml-sitemap-generator",
  "sitemap-url-extractor",
  "website-url-extractor",
  "chatbot-roi-calculator",
  "email-signature-generator",
  "sourcesync",
];

const template = (toolPath) => `import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools/${toolPath}");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
`;

const base = path.join(__dirname, "..", "src", "app", "tools");
for (const toolPath of TOOL_PATHS) {
  const dir = path.join(base, toolPath);
  if (!fs.existsSync(dir)) continue;
  const filePath = path.join(dir, "layout.tsx");
  if (fs.existsSync(filePath)) continue;
  fs.writeFileSync(filePath, template(toolPath));
  console.log("Created", filePath);
}
