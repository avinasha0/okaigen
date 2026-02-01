import Link from "next/link";
import { BrandIcon } from "@/components/brand-icon";

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
    { name: "Demo", href: "/demo" },
    { name: "All Tools", href: "/tools" },
  ];

  const legal = [
    { name: "Terms & Conditions", href: "/terms" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Refund Policy", href: "/refund" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <footer className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=%2260%22 height=%2260%22 viewBox=%220 0 60 60%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg fill=%22none%22 fill-rule=%22evenodd%22%3E%3Cg fill=%22%231a6aff%22 fill-opacity=%220.03%22%3E%3Cpath d=%22M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#1a6aff]/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a6aff]/30 bg-[#1a6aff]/10 px-4 py-1.5">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              <span className="text-sm font-medium text-white/90">Ready to transform your customer support?</span>
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
              Start your <span className="bg-gradient-to-r from-[#1a6aff] to-indigo-400 bg-clip-text text-transparent">free trial</span> today
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Join thousands of businesses using SiteBotGPT to automate support and capture leads 24/7
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/signup"
                className="group inline-flex items-center gap-2 rounded-xl bg-[#1a6aff] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] hover:shadow-xl hover:shadow-[#1a6aff]/30"
              >
                Start free trial
                <svg className="h-5 w-5 transition-transform group-hover:translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/demo"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white backdrop-blur transition-all hover:bg-white/10"
              >
                <svg className="h-5 w-5 text-[#1a6aff]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
                View live demo
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-slate-900">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-6">
            {/* Company Info */}
            <div className="md:col-span-2 lg:pr-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1a6aff] to-indigo-600 text-white shadow-lg shadow-[#1a6aff]/25">
                  <BrandIcon size="lg" />
                </span>
                <span className="text-xl font-bold text-white">SiteBotGPT</span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed text-slate-400">
                The AI-powered customer support platform that learns from your content. Answer visitor questions instantly with personalized chatbots.
              </p>
              
              {/* Trust Badges */}
              <div className="mt-6 flex flex-wrap gap-3">
                <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 backdrop-blur">
                  <svg className="h-5 w-5 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-medium text-white/80">#1 on Product Hunt</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 backdrop-blur">
                  <svg className="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs font-medium text-white/80">SOC 2 Compliant</span>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-6 flex items-center gap-3">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-[#1a6aff] hover:text-white"
                  aria-label="Twitter"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-red-600 hover:text-white"
                  aria-label="YouTube"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-[#0077b5] hover:text-white"
                  aria-label="LinkedIn"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="https://github.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-all hover:bg-slate-700 hover:text-white"
                  aria-label="GitHub"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Convert to Markdown */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-[#1a6aff]/20">
                  <svg className="h-3.5 w-3.5 text-[#1a6aff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </span>
                Convert to Markdown
              </h3>
              <ul className="mt-4 space-y-2.5">
                {convertTools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#1a6aff]"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Chat Tools + Product */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-indigo-500/20">
                  <svg className="h-3.5 w-3.5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </span>
                AI Chat Tools
              </h3>
              <ul className="mt-4 space-y-2.5">
                {aiChatTools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#1a6aff]"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-emerald-500/20">
                  <svg className="h-3.5 w-3.5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </span>
                Product
              </h3>
              <ul className="mt-4 space-y-2.5">
                {product.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#1a6aff]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* AI Generators */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-purple-500/20">
                  <svg className="h-3.5 w-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                AI Generators
              </h3>
              <ul className="mt-4 space-y-2.5">
                {aiGenerators.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#1a6aff]"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* SEO & Other Tools + Legal */}
            <div>
              <h3 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-amber-500/20">
                  <svg className="h-3.5 w-3.5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </span>
                Other Tools
              </h3>
              <ul className="mt-4 space-y-2.5">
                {seoTools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={tool.href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#1a6aff]"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
              </ul>

              <h3 className="mt-8 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white">
                <span className="flex h-6 w-6 items-center justify-center rounded bg-rose-500/20">
                  <svg className="h-3.5 w-3.5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </span>
                Legal
              </h3>
              <ul className="mt-4 space-y-2.5">
                {legal.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-400 transition-colors hover:text-[#1a6aff]"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
              <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-slate-500 md:justify-start">
                <span>© {new Date().getFullYear()} SiteBotGPT. All rights reserved.</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center gap-1.5">
                  Made with 
                  <svg className="h-4 w-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  for the community
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-500">
                <a href="mailto:support@sitebotgpt.com" className="flex items-center gap-1.5 transition-colors hover:text-[#1a6aff]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  support@sitebotgpt.com
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
