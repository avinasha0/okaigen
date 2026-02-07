import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";
import { FooterCtaSection } from "@/components/footer-cta-section";

export function Footer() {
  const convertTools = [
    { name: "PDF to Markdown", href: "/tools/convert-pdf-to-markdown" },
    { name: "DOCX to Markdown", href: "/tools/convert-docx-to-markdown" },
    { name: "HTML to Markdown", href: "/tools/convert-html-to-markdown" },
    { name: "Notion to Markdown", href: "/tools/convert-notion-to-markdown" },
    { name: "Google Docs to Markdown", href: "/tools/convert-google-docs-to-markdown" },
    { name: "XML to Markdown", href: "/tools/convert-xml-to-markdown" },
    { name: "CSV to Markdown", href: "/tools/convert-csv-to-markdown" },
    { name: "JSON to Markdown", href: "/tools/convert-json-to-markdown" },
    { name: "RTF to Markdown", href: "/tools/convert-rtf-to-markdown" },
    { name: "Paste to Markdown", href: "/tools/convert-paste-to-markdown" },
    { name: "Webpage to Markdown", href: "/tools/convert-webpage-to-markdown" },
  ];

  const aiChatTools = [
    { name: "AI Chat with Text", href: "/tools/ai-chat-text" },
    { name: "AI Chat with Website", href: "/tools/ai-chat-website" },
    { name: "AI Chat with Document", href: "/tools/ai-chat-document" },
    { name: "AI Chat with PDF", href: "/tools/ai-chat-pdf" },
    { name: "AI Chat with Word", href: "/tools/ai-chat-word" },
  ];

  const aiGenerators = [
    { name: "AI Reply Generator", href: "/tools/ai-reply-generator" },
    { name: "AI Prompt Generator", href: "/tools/ai-prompt-generator" },
    { name: "AI Prompt Optimizer", href: "/tools/ai-prompt-optimizer" },
    { name: "AI FAQ Generator", href: "/tools/ai-faq-generator" },
    { name: "AI Answer Generator", href: "/tools/ai-answer-generator" },
    { name: "AI Email Response Generator", href: "/tools/ai-email-response-generator" },
    { name: "AI Letter Generator", href: "/tools/ai-letter-generator" },
    { name: "AI Blog Title Generator", href: "/tools/ai-blog-title-generator" },
    { name: "AI Chatbot Name Generator", href: "/tools/ai-chatbot-name-generator" },
    { name: "AI SaaS Brand Name Generator", href: "/tools/ai-saas-brand-name-generator" },
  ];

  const seoTools = [
    { name: "AI Chatbot Conversation Analysis", href: "/tools/ai-chatbot-conversation-analysis" },
    { name: "Sitemap Finder & Checker", href: "/tools/sitemap-finder-checker" },
    { name: "Sitemap Validator", href: "/tools/sitemap-validator" },
    { name: "XML Sitemap Generator", href: "/tools/xml-sitemap-generator" },
    { name: "Sitemap URL Extractor", href: "/tools/sitemap-url-extractor" },
    { name: "Website URL Extractor", href: "/tools/website-url-extractor" },
    { name: "Chatbot ROI Calculator", href: "/tools/chatbot-roi-calculator" },
    { name: "Email Signature Generator", href: "/tools/email-signature-generator" },
    { name: "SourceSync.ai", href: "/tools/sourcesync" },
  ];

  const product = [
    { name: "Features", href: "/#features" },
    { name: "How it works", href: "/#how-it-works" },
    { name: "Pricing", href: "/pricing" },
    { name: "Integration", href: "/integration" },
    { name: "Documentation", href: "/docs" },
    { name: "Learn", href: "/learn/how-do-ai-chatbots-work" },
    { name: "Webhooks", href: "/dashboard/webhooks" },
    { name: "API Docs", href: "/docs/api" },
    { name: "All Tools", href: "/tools" },
  ];

  const legal = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Sitemap", href: "/sitemap.xml" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section — prominent blue card */}
      <section className="border-t border-slate-200 bg-slate-50/80">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="rounded-2xl bg-[#1a6aff] px-6 py-10 shadow-xl shadow-[#1a6aff]/20 sm:px-10 sm:py-12 lg:px-14 lg:py-14">
            <FooterCtaSection />
          </div>
        </div>
      </section>

      {/* Main Footer */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          {/* Row 1: Logo, Product, AI Generators, Legal */}
          <div className="grid grid-cols-1 gap-y-10 border-b border-white/10 pb-10 text-left md:grid-cols-4 md:gap-y-0 md:gap-x-8 md:pb-10 lg:gap-x-12">
            {/* Company / Logo */}
            <div className="md:col-span-1">
              <Link href="/" className="inline-flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a6aff] to-indigo-600 text-white shadow-lg shadow-[#1a6aff]/25">
                  <BrandIcon size="lg" />
                </span>
                <span className="font-heading text-xl font-bold text-white">SiteBotGPT</span>
              </Link>
              <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-400">
                The AI-powered customer support platform that learns from your content.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                  <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 6l-9.5 9.5-5-5L1 18" />
                    <path d="M17 6h6v6" />
                  </svg>
                  Trending In Product Hunt
                </span>
                <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300">
                  <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Following SOC 2 Compliant Practices
                </span>
              </div>
              <div className="mt-6 flex gap-2">
                <a href="https://x.com/sitebotgpt" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#1a6aff]/50 hover:bg-[#1a6aff]/10 hover:text-white" aria-label="X (Twitter)">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                </a>
                <a href="https://www.facebook.com/sitebotgpt" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#1877f2]/50 hover:bg-[#1877f2]/10 hover:text-white" aria-label="Facebook">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                </a>
                <a href="https://www.instagram.com/sitebotgpt/" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#E4405F]/50 hover:bg-[#E4405F]/10 hover:text-white" aria-label="Instagram">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.012-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-red-500/50 hover:bg-red-500/10 hover:text-white" aria-label="YouTube">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>
                </a>
                <a href="https://www.linkedin.com/company/sitebotgpt" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-[#0077b5]/50 hover:bg-[#0077b5]/10 hover:text-white" aria-label="LinkedIn">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                </a>
                <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-white/20 hover:bg-white/10 hover:text-white" aria-label="GitHub">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" /></svg>
                </a>
              </div>
            </div>

            {/* Product */}
            <div className="text-left">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-300">Product</h3>
              <ul className="mt-4 space-y-1">
                {product.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-2 text-sm text-slate-400 transition-colors hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Generators */}
            <div className="text-left">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-300">AI Generators</h3>
              <ul className="mt-4 space-y-1">
                {aiGenerators.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="block py-2 text-sm text-slate-400 transition-colors hover:text-white">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div className="text-left">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-300">Legal</h3>
              <ul className="mt-4 space-y-1">
                {legal.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="block py-2 text-sm text-slate-400 transition-colors hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Row 2: Convert to Markdown, AI Chat Tools, Tools & More */}
          <div className="grid grid-cols-1 gap-y-10 pt-10 text-left md:grid-cols-3 md:gap-y-0 md:gap-x-8 lg:gap-x-12">
            {/* Convert to Markdown */}
            <div className="text-left">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-300">Convert to Markdown</h3>
              <ul className="mt-4 space-y-1">
                {convertTools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="block py-2 text-sm text-slate-400 transition-colors hover:text-white">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Chat Tools */}
            <div className="text-left">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-300">AI Chat Tools</h3>
              <ul className="mt-4 space-y-1">
                {aiChatTools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="block py-2 text-sm text-slate-400 transition-colors hover:text-white">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tools & More */}
            <div className="text-left">
              <h3 className="font-heading text-xs font-semibold uppercase tracking-wider text-slate-300">Tools & More</h3>
              <ul className="mt-4 space-y-1">
                {seoTools.map((tool) => (
                  <li key={tool.href}>
                    <Link href={tool.href} className="block py-2 text-sm text-slate-400 transition-colors hover:text-white">
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-3 text-left sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                <span>© {new Date().getFullYear()} SiteBotGPT. All rights reserved.</span>
                <span className="hidden sm:inline" aria-hidden>·</span>
                <span className="flex items-center gap-1.5">
                  Made with
                  <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  for the community
                </span>
                {process.env.NEXT_PUBLIC_RECAPTCHA_ENABLED === "true" && (
                  <>
                    <span className="hidden sm:inline" aria-hidden>·</span>
                    <span className="text-xs text-slate-600">
                      This site is protected by reCAPTCHA and the Google{" "}
                      <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">
                        Privacy Policy
                      </a>{" "}
                      and{" "}
                      <a href="https://policies.google.com/terms" target="_blank" rel="noopener noreferrer" className="underline hover:text-slate-400">
                        Terms of Service
                      </a>{" "}
                      apply.
                    </span>
                  </>
                )}
              </div>
              <a href="mailto:support@sitebotgpt.com" className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-500 transition-colors hover:bg-white/5 hover:text-white">
                <svg className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                support@sitebotgpt.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
