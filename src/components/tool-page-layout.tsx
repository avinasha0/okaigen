"use client";

import Link from "next/link";
import { useState } from "react";
import { ResponsiveNav } from "@/components/responsive-nav";
import { ALL_CONVERT_TOOLS, ALL_AI_TOOLS } from "@/lib/tools-data";

interface ToolPageLayoutProps {
  title: string;
  description: string;
  breadcrumbTitle: string;
  currentPath: string;
  children: React.ReactNode;
  otherTools?: readonly { href: string; title: string; icon: string }[];
}

const TESTIMONIALS = [
  { quote: "The chatbot answered our visitors' questions instantly. Support tickets dropped by 40% in the first month.", name: "Sarah Chen", role: "Head of Customer Success, TechFlow" },
  { quote: "Setup was straightforward. We trained it on our docs and it was live in under an hour. Our team loves it.", name: "Marcus Johnson", role: "CTO, ScaleLabs" },
  { quote: "Lead capture through the chat widget has been a game-changer. We've qualified more leads without extra effort.", name: "Elena Rodriguez", role: "VP Sales, CloudNine" },
];

const FAQS = [
  { id: "chatbot-training", q: "What can I train the bot on?", a: "Add your website URL (we crawl and index pages), upload PDFs, DOCX, or TXT files, or paste raw text. The bot uses only your content—no generic knowledge." },
  { id: "training-time", q: "How long does training take?", a: "Usually a few minutes. It depends on how much content you add. Most sites are indexed in under 5 minutes." },
  { id: "support-handoff", q: "Can the bot hand off to a human?", a: "Yes. When the bot is unsure or a visitor wants human help, capture their contact details and follow up. Great for sales and support handoffs." },
  { id: "embed", q: "How do I add the chatbot to my site?", a: "Copy a single script tag and add it to your HTML. The chat bubble appears in the corner. No iframes, no complex setup—one line of code." },
  { id: "pricing-free", q: "Is there a free tier?", a: "Yes. Start with a free plan—multiple bots, document uploads, and core features. Upgrade when you need more volume or advanced options." },
  { id: "pricing-plans", q: "What plans are available?", a: "We offer Starter (free), Growth, Scale, and Enterprise plans. See our Pricing page for details on message limits, chatbots, and features." },
];

function FaqAccordion() {
  const [openId, setOpenId] = useState<string | null>("chatbot-training");
  return (
    <div className="mx-auto mt-10 max-w-2xl space-y-3">
      {FAQS.map((faq) => {
        const isOpen = openId === faq.id;
        return (
          <div key={faq.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <button
              type="button"
              onClick={() => setOpenId(isOpen ? null : faq.id)}
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-slate-50/80"
            >
              <span className="font-semibold text-slate-900">{faq.q}</span>
              <span className={`shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}>
                <svg className="h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div className="border-t border-slate-100 px-5 py-4">
                <p className="text-slate-600">{faq.a}</p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

function ToolCard({ href, title, icon, current }: { href: string; title: string; icon: string; current: boolean }) {
  const isCurrent = current;
  const content = (
    <>
      <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${isCurrent ? "bg-slate-200 text-slate-500" : "bg-gradient-to-br from-[#1a6aff] to-[#0d5aeb] text-white"}`}>
        <ToolIcon type={icon} />
      </div>
      <h3 className={`mt-4 font-semibold ${isCurrent ? "text-slate-600" : "text-slate-900 group-hover:text-[#1a6aff]"}`}>{title}</h3>
      <p className="mt-2 text-sm text-slate-600">{isCurrent ? "You're here" : "Try this tool"}</p>
      {!isCurrent && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#1a6aff]">
          Try tool <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
        </span>
      )}
    </>
  );

  if (isCurrent) {
    return (
      <div className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50/50 p-6 opacity-90">
        {content}
      </div>
    );
  }
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition-all hover:-translate-y-1 hover:border-[#1a6aff]/30 hover:shadow-xl hover:shadow-[#1a6aff]/10"
    >
      {content}
    </Link>
  );
}

function ToolIcon({ type }: { type: string }) {
  const icons: Record<string, React.ReactNode> = {
    pdf: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z M9 9h6M9 13h6M9 17h3" />,
    docx: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    html: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    notion: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />,
    gdocs: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    xml: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />,
    csv: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-7 0h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />,
    json: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />,
    rtf: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
    paste: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />,
    web: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
    ai: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />,
    seo: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />,
  };
  return (
    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      {icons[type] ?? icons.pdf}
    </svg>
  );
}

export function ToolPageLayout({ title, description, breadcrumbTitle, currentPath, children, otherTools }: ToolPageLayoutProps) {
  const toolsList = otherTools ?? ALL_CONVERT_TOOLS;
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <nav className="mb-8 flex items-center gap-2 text-sm text-slate-500">
          <Link href="/" className="hover:text-[#1a6aff]">Home</Link>
          <span>/</span>
          <Link href="/tools" className="hover:text-[#1a6aff]">Tools</Link>
          <span>/</span>
          <span className="text-slate-900">{breadcrumbTitle}</span>
        </nav>

        <h1 className="text-3xl font-bold text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-lg text-slate-600">{description}</p>

        <div className="mt-10">{children}</div>

        {/* Other tools */}
        <section className="mt-20 border-t border-slate-200 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Try our other free tools!</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Discover a suite of free, powerful tools for documentation, content workflows, and productivity.
            </p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {toolsList.slice(0, 8).map((t) => (
              <ToolCard key={t.href} href={t.href} title={t.title} icon={t.icon} current={t.href === currentPath} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section className="mt-20 border-t border-slate-200 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Don&apos;t just take our word for it</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">Customer testimonials</p>
          </div>
          <div className="mt-10 grid gap-8 md:grid-cols-3">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40">
                <p className="text-slate-700">"{t.quote}"</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-sm text-slate-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQs */}
        <section className="mt-20 border-t border-slate-200 pt-16">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">FAQs</h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">Have a different question? Reach out to our support team.</p>
          </div>
          <FaqAccordion />
        </section>

        {/* CTA */}
        <section className="mt-20 rounded-2xl border border-slate-200 bg-gradient-to-br from-[#1a6aff]/5 via-white to-indigo-500/5 px-6 py-16 sm:px-12 sm:py-20">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">Ready to try Project Atlas?</h2>
            <p className="mt-4 text-slate-600">Find out if a personalized AI support chatbot is a good fit for you in just a few hours.</p>
            <ul className="mt-8 grid gap-3 text-left sm:mx-auto sm:max-w-md sm:grid-cols-2">
              {["Start a free trial", "Personalized onboarding help", "Friendly pricing as you scale", "7-day free trial", "Cancel anytime"].map((item) => (
                <li key={item} className="flex items-center gap-2 text-slate-700">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a6aff]/10 text-[#1a6aff]">
                    <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  </span>
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/signup" className="w-full rounded-xl bg-[#1a6aff] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] sm:w-auto">Start a free trial</Link>
              <Link href="/demo" className="w-full rounded-xl border-2 border-[#1a6aff] bg-white px-8 py-4 text-base font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/5 sm:w-auto">Try demo</Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-slate-50/50 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h4 className="font-semibold text-slate-900">Product</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li><Link href="/#features" className="transition-colors hover:text-[#1a6aff]">Features</Link></li>
                <li><Link href="/#how-it-works" className="transition-colors hover:text-[#1a6aff]">How it works</Link></li>
                <li><Link href="/demo" className="transition-colors hover:text-[#1a6aff]">Demo</Link></li>
                <li><Link href="/pricing" className="transition-colors hover:text-[#1a6aff]">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Tools</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li><Link href="/tools" className="transition-colors hover:text-[#1a6aff]">All tools</Link></li>
                {(otherTools ?? ALL_CONVERT_TOOLS).slice(0, 5).map((t) => (
                  <li key={t.href}><Link href={t.href} className="transition-colors hover:text-[#1a6aff]">{t.title.replace("AI ", "").replace("Convert ", "").replace(" to Markdown", "")}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Company</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li><Link href="/login" className="transition-colors hover:text-[#1a6aff]">Sign in</Link></li>
                <li><Link href="/signup" className="transition-colors hover:text-[#1a6aff]">Start free trial</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-slate-900">Contact</h4>
              <ul className="mt-4 space-y-3 text-sm text-slate-600">
                <li><a href="mailto:support@projectatlas.io" className="transition-colors hover:text-[#1a6aff]">support@projectatlas.io</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 border-t border-slate-200 pt-6 text-center">
            <span className="text-sm font-medium text-slate-900">Project Atlas</span>
            <p className="mt-2 text-xs text-slate-500">© {new Date().getFullYear()} Project Atlas. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
