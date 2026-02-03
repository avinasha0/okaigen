import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

const TOOL_CATEGORIES = [
  {
    id: "ai",
    name: "AI Generators",
    description: "Generate content with AI—replies, prompts, FAQs, names, and more",
    tools: [
      { href: "/tools/ai-reply-generator", title: "AI Reply Generator", description: "Generate thoughtful replies to messages.", icon: "ai", badge: "Popular" },
      { href: "/tools/ai-prompt-generator", title: "AI Prompt Generator", description: "Create effective AI prompts with proven frameworks.", icon: "ai" },
      { href: "/tools/ai-prompt-optimizer", title: "AI Prompt Optimizer", description: "Transform prompts into clearer, more effective versions.", icon: "ai" },
      { href: "/tools/ai-faq-generator", title: "AI FAQ Generator", description: "Create FAQs for your product or topic.", icon: "ai" },
      { href: "/tools/ai-answer-generator", title: "AI Answer Generator", description: "Get quick, accurate answers to your questions.", icon: "ai" },
      { href: "/tools/ai-email-response-generator", title: "AI Email Response Generator", description: "Craft professional email replies.", icon: "ai" },
      { href: "/tools/ai-letter-generator", title: "AI Letter Generator", description: "Create cover letters, thank you notes, and more.", icon: "ai" },
      { href: "/tools/ai-blog-title-generator", title: "AI Blog Title Generator", description: "Generate catchy, SEO-friendly blog titles.", icon: "ai" },
      { href: "/tools/ai-chatbot-name-generator", title: "AI Chatbot Name Generator", description: "Find the perfect name for your AI assistant.", icon: "ai" },
      { href: "/tools/ai-saas-brand-name-generator", title: "AI SaaS Brand Name Generator", description: "Discover names for your SaaS product.", icon: "ai" },
    ]},
  {
    id: "chat",
    name: "AI Chat with Your Data",
    description: "Chat with text, websites, PDFs, and documents",
    tools: [
      { href: "/tools/ai-chat-text", title: "AI Chat with Your Text Data", description: "Paste text and ask questions. Answers from your content only.", icon: "ai" },
      { href: "/tools/ai-chat-website", title: "AI Chat with Your Website Data", description: "Enter a URL and ask questions about the page content.", icon: "ai" },
      { href: "/tools/ai-chat-document", title: "AI Chat with Your Document & Data", description: "Upload or paste documents and chat with your data.", icon: "ai" },
      { href: "/tools/ai-chat-pdf", title: "AI Chat with Your PDF Document & Data", description: "Upload a PDF and ask questions about its content.", icon: "ai" },
      { href: "/tools/ai-chat-word", title: "AI Chat with Your Word Document & Data", description: "Upload a Word doc and get answers from it.", icon: "ai" },
    ]},
  {
    id: "seo",
    name: "SEO & Analytics",
    description: "Sitemaps, URL extraction, ROI calculator, and more",
    tools: [
      { href: "/tools/ai-chatbot-conversation-analysis", title: "AI Chatbot Conversation Analysis", description: "Analyze conversations for knowledge gaps and improvements.", icon: "seo" },
      { href: "/tools/sitemap-finder-checker", title: "Sitemap Finder & Checker", description: "Find and validate sitemaps on any website.", icon: "seo" },
      { href: "/tools/sitemap-validator", title: "Sitemap Validator", description: "Validate XML sitemap for errors and SEO compliance.", icon: "seo" },
      { href: "/tools/xml-sitemap-generator", title: "XML Sitemap Generator", description: "Generate sitemap.xml by crawling your site.", icon: "seo" },
      { href: "/tools/sitemap-url-extractor", title: "Sitemap URL Extractor", description: "Extract all URLs from a sitemap.", icon: "seo" },
      { href: "/tools/website-url-extractor", title: "Website URL Extractor", description: "Crawl and extract URLs from any website.", icon: "seo" },
      { href: "/tools/chatbot-roi-calculator", title: "Chatbot ROI Calculator", description: "Estimate savings from AI chatbot implementation.", icon: "seo" },
      { href: "/tools/email-signature-generator", title: "Email Signature Generator", description: "Create professional email signatures.", icon: "seo" },
      { href: "/tools/sourcesync", title: "SourceSync.ai", description: "Sync content sources for AI training.", icon: "seo" },
    ]},
  {
    id: "convert",
    name: "Convert to Markdown",
    description: "Transform documents and content into Markdown",
    tools: [
      { href: "/tools/convert-pdf-to-markdown", title: "Convert PDF to Markdown", description: "Upload any PDF and convert to Markdown. Perfect for documentation and content migration.", icon: "pdf", badge: "Popular" },
      { href: "/tools/convert-docx-to-markdown", title: "Convert DOCX to Markdown", description: "Convert Word documents to Markdown. Supports DOCX format.", icon: "docx" },
      { href: "/tools/convert-html-to-markdown", title: "Convert HTML to Markdown", description: "Convert HTML to clean Markdown. Paste or upload HTML files.", icon: "html" },
      { href: "/tools/convert-notion-to-markdown", title: "Convert Notion to Markdown", description: "Enter any public Notion page URL and convert to Markdown.", icon: "notion" },
      { href: "/tools/convert-google-docs-to-markdown", title: "Convert Google Docs to Markdown", description: "Convert public Google Docs to Markdown via URL.", icon: "gdocs" },
      { href: "/tools/convert-xml-to-markdown", title: "Convert XML to Markdown", description: "Convert XML to Markdown. Paste or upload XML files.", icon: "xml" },
      { href: "/tools/convert-csv-to-markdown", title: "Convert CSV to Markdown", description: "Convert CSV to Markdown tables. Perfect for README files.", icon: "csv" },
      { href: "/tools/convert-json-to-markdown", title: "Convert JSON to Markdown", description: "Convert JSON to well-formatted Markdown.", icon: "json" },
      { href: "/tools/convert-rtf-to-markdown", title: "Convert RTF to Markdown", description: "Convert RTF documents to Markdown.", icon: "rtf" },
      { href: "/tools/convert-paste-to-markdown", title: "Convert Paste to Markdown", description: "Paste any text and convert to clean Markdown.", icon: "paste" },
      { href: "/tools/convert-webpage-to-markdown", title: "Convert Webpage to Markdown", description: "Enter any webpage URL and convert to Markdown.", icon: "web" },
    ]},
];

const TRUST_BADGES = [
  { label: "Free forever", icon: "check" },
  { label: "No signup required", icon: "lock" },
  { label: "Instant results", icon: "bolt" },
];

function ToolIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    pdf: <><path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M9 9h6M9 13h6M9 17h3" /></>,
    docx: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    html: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    notion: <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />,
    gdocs: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    xml: <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    csv: <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    json: <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    rtf: <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    paste: <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    web: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
    ai: <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    seo: <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />};
  return (
    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      {icons[type] ?? <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />}
    </svg>
  );
}

export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />

      {/* Hero - matches home page light theme */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom_right,#f8fafc_0%,#f1f5f9_50%,white_100%)]" />
        <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#1a6aff]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a6aff]/30 bg-[#1a6aff]/5 px-4 py-2 text-sm font-medium text-[#1a6aff]">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
              </svg>
              Free tools for the community
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
              Free{" "}
              <span className="text-[#1a6aff]">Tools</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
              Discover powerful, no-signup tools for documentation, content workflows, and productivity. Built for developers and teams.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm font-medium text-slate-700">
              {TRUST_BADGES.map((b) => (
                <span key={b.label} className="flex items-center gap-2">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1a6aff]/10 text-[#1a6aff]">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </span>
                  {b.label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="relative -mt-4 px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          {TOOL_CATEGORIES.map((category) => (
            <div key={category.id} className="mb-16">
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                  {category.name}
                </h2>
                <p className="mt-2 text-base text-slate-700">{category.description}</p>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {category.tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    className="group relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 transition-all duration-300 hover:-translate-y-1 hover:border-[#1a6aff]/30 hover:shadow-2xl hover:shadow-[#1a6aff]/10"
                  >
                    {tool.badge && (
                      <span className="absolute right-4 top-4 rounded-full bg-[#1a6aff]/10 px-3 py-1 text-xs font-semibold text-[#1a6aff]">
                        {tool.badge}
                      </span>
                    )}
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a6aff] to-[#0d5aeb] text-white shadow-lg shadow-[#1a6aff]/25 transition-transform duration-300 group-hover:scale-110 group-hover:shadow-[#1a6aff]/30">
                      <ToolIcon type={tool.icon} />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 transition-colors group-hover:text-[#1a6aff]">
                      {tool.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-700">
                      {tool.description}
                    </p>
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#1a6aff]">
                      Try tool
                      <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <p className="text-lg text-slate-700">
            More tools coming soon. Need something specific?{" "}
            <Link href="/demo" className="font-semibold text-[#1a6aff] hover:underline">
              Try our AI chatbot
            </Link>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
