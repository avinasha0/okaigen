import type { Metadata } from "next";
import { createMetadata } from "./seo";

/** SEO metadata for each tool. Title 34-48 chars (total 50-60 with suffix), description 155-160 chars */
export const TOOLS_META: Record<string, { title: string; description: string; keywords: string[] }> = {
  "/tools": {
    title: "Free AI Tools, PDF to Markdown & Sitemap Generator",
    description: "Free AI generators, PDF to Markdown, sitemap tools, chatbot ROI calculator. No signup. Instant results.",
    keywords: ["free AI tools", "PDF to markdown", "sitemap generator", "chatbot ROI", "document converter"],
  },
  "/tools/convert-pdf-to-markdown": {
    title: "PDF to Markdown Converter - Free Online Tool",
    description: "Convert PDF to Markdown instantly. Free online tool. No signup. Supports docs, articles & more. Download as .md.",
    keywords: ["PDF to markdown", "convert PDF markdown", "PDF converter", "free PDF tool"],
  },
  "/tools/convert-docx-to-markdown": {
    title: "DOCX to Markdown - Convert Word to MD Free",
    description: "Convert Word DOCX/DOC to Markdown online. Free, no signup. Perfect for docs, blogs & content migration.",
    keywords: ["docx to markdown", "Word to markdown", "convert DOCX", "document converter"],
  },
  "/tools/convert-html-to-markdown": {
    title: "HTML to Markdown Converter - Free Online Tool",
    description: "Convert HTML to Markdown online. Paste HTML or upload file. Free tool for clean Markdown output.",
    keywords: ["HTML to markdown", "convert HTML", "HTML converter", "web to markdown"],
  },
  "/tools/convert-notion-to-markdown": {
    title: "Notion to Markdown - Export Notion Pages Free",
    description: "Convert any public Notion page to Markdown. Enter URL and get clean Markdown. Free, instant.",
    keywords: ["Notion to markdown", "export Notion", "Notion converter"],
  },
  "/tools/convert-google-docs-to-markdown": {
    title: "Google Docs to Markdown - Convert Online Free",
    description: "Convert Google Docs to Markdown via URL. Free online tool. Preserve formatting and structure.",
    keywords: ["Google Docs to markdown", "convert Google Docs", "Docs converter"],
  },
  "/tools/convert-xml-to-markdown": {
    title: "XML to Markdown Converter - Free Online Tool",
    description: "Convert XML to Markdown online. Paste or upload XML. Free tool for docs and data conversion.",
    keywords: ["XML to markdown", "convert XML", "XML converter"],
  },
  "/tools/convert-csv-to-markdown": {
    title: "CSV to Markdown Table - Free Converter Tool",
    description: "Convert CSV to Markdown tables. Free tool. Perfect for README files and documentation.",
    keywords: ["CSV to markdown", "CSV table", "markdown table generator"],
  },
  "/tools/convert-json-to-markdown": {
    title: "JSON to Markdown - Free Online Converter Tool",
    description: "Convert JSON to formatted Markdown. Free online tool. Paste or upload JSON for clean output.",
    keywords: ["JSON to markdown", "convert JSON", "JSON formatter"],
  },
  "/tools/convert-rtf-to-markdown": {
    title: "RTF to Markdown Converter - Free Online Tool",
    description: "Convert RTF documents to Markdown. Free online converter. No signup required.",
    keywords: ["RTF to markdown", "convert RTF", "Rich Text to markdown"],
  },
  "/tools/convert-paste-to-markdown": {
    title: "Text to Markdown - Paste & Convert Free Online",
    description: "Paste any text and convert to clean Markdown. Free tool. Fix formatting for docs and notes.",
    keywords: ["paste to markdown", "text to markdown", "markdown converter"],
  },
  "/tools/convert-webpage-to-markdown": {
    title: "Webpage to Markdown - URL to MD Converter Free",
    description: "Convert any webpage URL to Markdown. Extract content from articles, blogs & docs. Free tool.",
    keywords: ["webpage to markdown", "URL to markdown", "scrape to markdown"],
  },
  "/tools/ai-chat-text": {
    title: "AI Chat with Text - Ask Questions About Your Data",
    description: "Paste text and ask AI questions. Answers from your content only. Free tool. No signup.",
    keywords: ["chat with text", "AI text chat", "analyze text AI"],
  },
  "/tools/ai-chat-website": {
    title: "AI Chat with Website - Q&A from Any Webpage",
    description: "Enter URL and chat with webpage content. AI answers from the page. Free online tool.",
    keywords: ["chat with website", "AI website chat", "webpage Q&A"],
  },
  "/tools/ai-chat-document": {
    title: "AI Chat with Document - PDF, Word, Text Q&A",
    description: "Upload PDF, Word or paste text. Chat with your documents. AI answers from your content only.",
    keywords: ["chat with document", "AI document chat", "document Q&A"],
  },
  "/tools/ai-chat-pdf": {
    title: "AI Chat with PDF - Ask Questions About PDF Files",
    description: "Upload PDF and ask questions. AI reads your document and answers. Free tool. Max 2MB.",
    keywords: ["chat with PDF", "AI PDF chat", "PDF Q&A", "ask PDF"],
  },
  "/tools/ai-chat-word": {
    title: "AI Chat with Word - Ask Questions About Doc Files",
    description: "Upload Word doc and chat with it. AI answers from your document. Free. Supports .doc & .docx.",
    keywords: ["chat with Word", "AI Word chat", "document Q&A"],
  },
  "/tools/ai-reply-generator": {
    title: "AI Reply Generator - Professional Message Responses",
    description: "Generate professional replies to messages. Choose tone. Free AI tool. Perfect for emails & chats.",
    keywords: ["AI reply", "reply generator", "message reply AI"],
  },
  "/tools/ai-prompt-generator": {
    title: "AI Prompt Generator - ChatGPT & LLM Prompts Free",
    description: "Create effective AI prompts with proven frameworks. Free tool. Improve ChatGPT & AI outputs.",
    keywords: ["AI prompt generator", "prompt engineering", "ChatGPT prompts"],
  },
  "/tools/ai-prompt-optimizer": {
    title: "AI Prompt Optimizer - Improve Your Prompts Free",
    description: "Optimize your AI prompts for better results. Free tool. Clearer, more effective prompts.",
    keywords: ["prompt optimizer", "AI prompt", "improve prompts"],
  },
  "/tools/ai-faq-generator": {
    title: "AI FAQ Generator - Create FAQs for Product Free",
    description: "Generate FAQs for your product or topic. Free AI tool. Ready for website or help center.",
    keywords: ["FAQ generator", "AI FAQ", "create FAQs"],
  },
  "/tools/ai-answer-generator": {
    title: "AI Answer Generator - Get Answers with Context",
    description: "Get quick AI answers to any question. Add context for accurate results. Free online tool.",
    keywords: ["AI answer", "answer generator", "AI Q&A"],
  },
  "/tools/ai-email-response-generator": {
    title: "AI Email Response Generator - Professional Replies",
    description: "Generate professional email replies. Free AI tool. Perfect tone and clarity.",
    keywords: ["email reply AI", "AI email", "email response generator"],
  },
  "/tools/ai-letter-generator": {
    title: "AI Letter Generator - Cover Letters & Thank You",
    description: "Create cover letters, thank you notes & more. Free AI letter generator. Professional output.",
    keywords: ["letter generator", "AI letter", "cover letter AI"],
  },
  "/tools/ai-blog-title-generator": {
    title: "AI Blog Title Generator - SEO Headlines Free",
    description: "Generate catchy, SEO-friendly blog titles. Free AI tool. Increase clicks and engagement.",
    keywords: ["blog title generator", "AI blog titles", "headline generator"],
  },
  "/tools/ai-chatbot-name-generator": {
    title: "AI Chatbot Name Generator - Bot Names Ideas Free",
    description: "Find the perfect name for your AI assistant. Free name ideas for chatbots and bots.",
    keywords: ["chatbot names", "AI name generator", "bot names"],
  },
  "/tools/ai-saas-brand-name-generator": {
    title: "AI SaaS Brand Name Generator - Startup Names",
    description: "Generate SaaS product names. Free AI tool. Memorable, brandable names for your startup.",
    keywords: ["SaaS names", "brand name generator", "startup names"],
  },
  "/tools/ai-chatbot-conversation-analysis": {
    title: "Chatbot Conversation Analysis - Find Knowledge Gaps",
    description: "Analyze chatbot logs for knowledge gaps & improvements. Free AI tool. Actionable insights.",
    keywords: ["chatbot analysis", "conversation analysis", "chatbot analytics"],
  },
  "/tools/sitemap-finder-checker": {
    title: "Sitemap Finder & Checker - Find Sitemaps Free",
    description: "Find and validate sitemaps on any website. Check robots.txt. Free SEO tool. Instant results.",
    keywords: ["sitemap finder", "sitemap checker", "find sitemap"],
  },
  "/tools/sitemap-validator": {
    title: "XML Sitemap Validator - Check Sitemap Errors Free",
    description: "Validate XML sitemap for errors and SEO. Paste URL or XML. Free tool. Get detailed report.",
    keywords: ["sitemap validator", "validate sitemap", "XML sitemap check"],
  },
  "/tools/xml-sitemap-generator": {
    title: "XML Sitemap Generator - Create sitemap.xml Free",
    description: "Generate sitemap.xml by crawling your site. Free SEO tool. Up to 500 URLs. Download instantly.",
    keywords: ["sitemap generator", "XML sitemap", "create sitemap"],
  },
  "/tools/sitemap-url-extractor": {
    title: "Sitemap URL Extractor - Get All URLs from Sitemap",
    description: "Extract all URLs from sitemap.xml. Free tool. Supports sitemap index. Export URL list.",
    keywords: ["sitemap extractor", "extract URLs", "sitemap URLs"],
  },
  "/tools/website-url-extractor": {
    title: "Website URL Extractor - Crawl & Extract Links Free",
    description: "Crawl and extract URLs from any website. Free tool. Site mapping and SEO analysis.",
    keywords: ["URL extractor", "crawl website", "extract links"],
  },
  "/tools/chatbot-roi-calculator": {
    title: "Chatbot ROI Calculator - Estimate AI Chatbot Savings",
    description: "Estimate savings from AI chatbot. Enter tickets, cost & deflection rate. Free ROI calculator.",
    keywords: ["chatbot ROI", "ROI calculator", "chatbot savings"],
  },
  "/tools/email-signature-generator": {
    title: "Email Signature Generator - Professional HTML Free",
    description: "Create professional email signatures. Free HTML signature generator. Copy & paste ready.",
    keywords: ["email signature", "signature generator", "HTML signature"],
  },
  "/tools/sourcesync": {
    title: "SourceSync - Content Sync for AI Training",
    description: "Sync content sources for AI training. Keep chatbot knowledge up to date. Project Atlas.",
    keywords: ["content sync", "AI training", "chatbot sync"],
  },
};

export function getToolMetadata(path: string): Metadata {
  const meta = TOOLS_META[path];
  if (!meta) return {};
  return createMetadata({
    ...meta,
    path,
  });
}
