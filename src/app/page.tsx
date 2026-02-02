import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";
import { ChatWidget } from "@/components/chat-widget";
import { Footer } from "@/components/footer";

export default function LandingPage() {
  const demoBotKey = process.env.NEXT_PUBLIC_DEMO_BOT_ID || "";

  return (
    <div className="min-h-screen overflow-x-hidden bg-white">
      <ResponsiveNav />
      {/* Only render widget when demo bot is configured; avoids empty key and no-op script */}
      {demoBotKey ? <ChatWidget botKey={demoBotKey} /> : null}

      <main id="main-content">
        {/* Hero - Two column layout inspired by SiteGPT */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_bottom_right,#f8fafc_0%,#f1f5f9_50%,white_100%)]" />
          <div className="absolute -right-40 -top-40 h-80 w-80 rounded-full bg-[#1a6aff]/5 blur-3xl" />
          <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />
          <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8 lg:py-24">
            <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Left: Text */}
              <div className="text-center lg:text-left">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1a6aff]/30 bg-[#1a6aff]/5 px-4 py-1.5 text-sm font-medium text-[#1a6aff]">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  AI-powered customer support
                </div>
                <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-[2.75rem] lg:leading-tight xl:text-5xl">
                  Make{" "}
                  <span className="text-[#1a6aff]">AI</span> your expert customer{" "}
                  <span className="text-[#1a6aff]">support agent</span>
                </h1>
                <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-slate-600 lg:mx-0">
                  It&apos;s like having ChatGPT specifically for your product. Instantly answer your visitors&apos; questions with a personalized chatbot trained on your website content.
                </p>
                <ul className="mx-auto mt-8 grid max-w-md gap-3 text-left sm:grid-cols-2 lg:mx-0 lg:max-w-lg">
                  {[
                    "Personalized onboarding help",
                    "Friendly pricing as you scale",
                    "No credit card to start",
                    "Forever free plan available",
                    "Cancel anytime",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2.5 text-slate-700">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1a6aff]/10 text-[#1a6aff]">
                        <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row lg:justify-start">
                  <Link
                    href="/signup"
                    className="inline-flex w-full justify-center rounded-lg bg-[#1a6aff] px-8 py-4 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] hover:shadow-[#1a6aff]/30 sm:w-auto"
                  >
                    Get started free
                  </Link>
                  <Link
                    href="/demo"
                    className="inline-flex w-full justify-center rounded-lg border-2 border-[#1a6aff] bg-white px-8 py-4 text-base font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/5 sm:w-auto"
                  >
                    Try demo
                  </Link>
                </div>
              </div>
              {/* Right: SiteBotGPT Helper */}
              <div className="flex justify-center lg:justify-center">
                <div className="w-full max-w-md rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/50 ring-1 ring-slate-900/5 sm:p-8">
                  <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1a6aff] to-[#0d5aeb] text-white shadow-lg shadow-[#1a6aff]/30">
                      <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-slate-900">SiteBotGPT Helper</p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-slate-600">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                          <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                        </span>
                        Typically replies instantly
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
                    <p className="font-medium text-slate-900">Ask me about:</p>
                    <ul className="mt-2 space-y-1 text-slate-600">
                      <li>• Your product features</li>
                      <li>• Pricing and plans</li>
                      <li>• Setup and integration</li>
                      <li>• Support and documentation</li>
                    </ul>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {["What are your hours?", "How do I get started?", "Pricing?"].map((q) => (
                      <span
                        key={q}
                        className="rounded-lg border border-[#1a6aff]/30 bg-[#1a6aff]/5 px-3 py-2 text-xs font-medium text-[#1a6aff]"
                      >
                        {q}
                      </span>
                    ))}
                  </div>
                  <Link
                    href="/demo"
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-[#1a6aff] py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
                  >
                    Open live demo
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust / Used by */}
        <section className="border-y border-slate-200 bg-slate-50/80 px-4 py-10 sm:py-14" aria-label="Used by">
          <p className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-slate-500">
            Used by teams who care about support
          </p>
          <h2 className="mb-10 text-center text-xl font-bold text-slate-900 sm:text-2xl">
            Trusted across industries
          </h2>
          <div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
            {[
              { name: "SaaS", desc: "Product & support teams", icon: "chart" },
              { name: "Agencies", desc: "Client support & delivery", icon: "users" },
              { name: "EdTech", desc: "Student & instructor help", icon: "academic" },
              { name: "E‑commerce", desc: "Shoppers & order help", icon: "cart" },
              { name: "Consulting", desc: "Advisory & follow-up", icon: "briefcase" },
            ].map(({ name, desc, icon }) => (
              <div
                key={name}
                className="flex flex-col items-center rounded-xl border border-slate-200 bg-white px-5 py-5 text-center shadow-sm transition-shadow hover:shadow-md"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1a6aff]/10 text-[#1a6aff]" aria-hidden>
                  {icon === "chart" && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  )}
                  {icon === "users" && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {icon === "academic" && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  )}
                  {icon === "cart" && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  )}
                  {icon === "briefcase" && (
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  )}
                </span>
                <p className="mt-2 font-semibold text-slate-900">{name}</p>
                <p className="mt-0.5 text-sm text-slate-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Imagine - Before / After */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Imagine what you could do with an expert chatbot answering questions 24/7
          </h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-8">
              <h3 className="text-lg font-semibold text-slate-900">Before</h3>
              <p className="mt-2 text-sm text-slate-600">Fickle, one-size-fits-all chatbots that do more harm than good</p>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li>• Generic AI tools that don&apos;t know your product</li>
                <li>• Custom bots that break and are hard to maintain</li>
                <li>• Support staff taking months to train</li>
                <li>• Bogged down with support tickets</li>
              </ul>
            </div>
            <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/40 p-8">
              <h3 className="text-lg font-semibold text-slate-900">After</h3>
              <p className="mt-2 text-sm text-slate-600">An automated resource that supercharges your support team</p>
              <ul className="mt-6 space-y-3 text-slate-600">
                <li>• 24/7 quality support with instant responses</li>
                <li>• Most questions handled automatically</li>
                <li>• Your team twice as productive</li>
                <li>• Time freed for higher-level tasks</li>
              </ul>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="border-t border-slate-200 bg-gradient-to-b from-slate-50/50 to-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              You&apos;re three steps away from your own personalized AI support chatbot
            </h2>
            <div className="mt-12 grid gap-10 sm:mt-16 sm:gap-12 md:grid-cols-3">
              {[
                { num: 1, title: "Add your content", desc: "Enter your website URL, upload PDFs or docs, or paste raw text. SiteBotGPT indexes everything and builds a searchable knowledge base." },
                { num: 2, title: "Install on your site", desc: "Embed the chatbot on your marketing site, in-app, help center—wherever you need it. One bot, many touchpoints." },
                { num: 3, title: "Learn and refine", desc: "Use chat history and analytics to see what visitors ask. Add training data where there are gaps and improve with every interaction." },
              ].map((step) => (
                <div key={step.num}>
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-[#1a6aff] text-lg font-bold text-white shadow-lg shadow-[#1a6aff]/25">
                    {step.num}
                  </span>
                  <h3 className="mt-4 font-semibold text-slate-900">{step.title}</h3>
                  <p className="mt-2 text-slate-600">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Everything you need for AI-powered support
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-center text-slate-600">
            Train once, deploy everywhere, and keep improving
          </p>

          <div className="mt-12 space-y-16 sm:mt-16 sm:space-y-20 md:space-y-24">
            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <div className="mb-4 inline-flex rounded-lg bg-[#1a6aff]/10 px-3 py-1 text-sm font-medium text-[#1a6aff]">
                  Personalized chatbot
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Your brand, your voice
                </h3>
                <p className="mt-4 text-slate-600">
                  Train the bot on your content so it speaks like your team. Set the tone—formal, friendly, or casual—and control how it handles uncertainty. Who knew a chatbot could be your digital doppelgänger?
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8">
                <div className="space-y-4">
                  <div className="h-3 w-3/4 rounded bg-[#1a6aff]/20" />
                  <div className="h-3 w-full rounded bg-[#1a6aff]/10" />
                  <div className="h-3 w-1/2 rounded bg-[#1a6aff]/20" />
                </div>
              </div>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="order-2 md:order-1 rounded-xl border border-slate-200 bg-slate-50/50 p-8">
                <div className="flex flex-wrap gap-2">
                  {["What are your hours?", "How do I get started?", "Pricing?"].map((q) => (
                    <span key={q} className="rounded-full bg-white px-3 py-1.5 text-sm shadow-sm ring-1 ring-slate-200/60">
                      {q}
                    </span>
                  ))}
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="mb-4 inline-flex rounded-lg bg-violet-100 px-3 py-1 text-sm font-medium text-violet-700">
                  Quick prompts
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Help users start conversations
                </h3>
                <p className="mt-4 text-slate-600">
                  Give visitors a digital icebreaker. Add frequently asked questions or prompts you wish more users would ask—and turn cold traffic into engaged conversations from the first click.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <div className="mb-4 inline-flex rounded-lg bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                  Collect leads
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Generate leads to follow up with later
                </h3>
                <p className="mt-4 text-slate-600">
                  Don&apos;t just answer questions—seize opportunities. When the bot isn&apos;t sure or a visitor wants human help, capture their details and build a list of potential leads.
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-8">
                <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                  <p className="text-sm text-slate-500">Leave your details and we&apos;ll reach out</p>
                  <div className="mt-3 h-9 rounded border border-slate-200 bg-slate-50" />
                  <div className="mt-2 h-9 rounded border border-slate-200 bg-slate-50" />
                </div>
              </div>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div className="order-2 md:order-1 rounded-xl border border-slate-200 bg-slate-50/50 p-8">
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-lg bg-[#1a6aff]/10 px-3 py-1.5 text-[#1a6aff]">Chats</span>
                  <span className="rounded-lg bg-violet-100 px-3 py-1.5 text-violet-700">Leads</span>
                  <span className="rounded-lg bg-amber-100 px-3 py-1.5 text-amber-700">Top questions</span>
                </div>
              </div>
              <div className="order-1 md:order-2">
                <div className="mb-4 inline-flex rounded-lg bg-amber-100 px-3 py-1 text-sm font-medium text-amber-700">
                  Analytics
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Learn from every conversation
                </h3>
                <p className="mt-4 text-slate-600">
                  View chat history, see which questions come up most, and identify where to add training data. Make your bot smarter with real usage insights.
                </p>
              </div>
            </div>

            <div className="grid items-center gap-8 md:grid-cols-2 md:gap-12">
              <div>
                <div className="mb-4 inline-flex rounded-lg bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700">
                  One snippet
                </div>
                <h3 className="text-2xl font-semibold text-slate-900">
                  Deploy anywhere with one snippet
                </h3>
                <p className="mt-4 text-slate-600">
                  Add the widget to your marketing site, product dashboard, or help center. Same bot, consistent answers, no extra setup per page.
                </p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 font-mono text-xs text-emerald-400 shadow-xl sm:p-6 sm:text-sm">
                <code className="break-all">&lt;script src=&quot;.../widget.js&quot; data-bot=&quot;...&quot;&gt;&lt;/script&gt;</code>
              </div>
            </div>
          </div>
        </section>

        {/* Integrations */}
        <section className="border-t border-slate-200 bg-slate-50/50 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Works with your stack
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-slate-600">
              Embed on any site. API-ready for custom integrations. Connect with your existing tools.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:mt-12 sm:gap-6 md:gap-8 text-slate-400">
              {["Any website", "WordPress", "React", "Help centers", "API"].map((t) => (
                <span key={t} className="rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-medium shadow-sm">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Live demo */}
        <section id="demo" className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            See for yourself
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Try the Atlas chatbot. Ask it anything about this product.
          </p>
          <div className="mt-10 text-center">
            <Link
              href="/demo"
              className="inline-flex rounded-lg border-2 border-[#1a6aff] bg-[#1a6aff]/5 px-8 py-4 text-base font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/10"
            >
              Try the live demo →
            </Link>
          </div>
        </section>

        {/* Testimonials */}
        <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-16 sm:px-6 sm:py-24 lg:px-8" aria-label="Testimonials">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              What our users say
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-center text-sm text-slate-500">
              Example testimonials—replace with real customer quotes when available.
            </p>
            <div className="mt-10 grid gap-6 sm:mt-12 md:grid-cols-3">
              {[
                {
                  quote: "We got the bot dialled in—trained on our docs, tone matched to our brand. Support tickets dropped and visitors get answers instantly. Exactly what we needed.",
                  name: "Alex Chen",
                  role: "Head of Support",
                  company: "B2B SaaS",
                },
                {
                  quote: "Our clients expect fast answers. SiteBotGPT handles the first line so we can focus on strategy and high-touch work. Setup took an afternoon.",
                  name: "Sam Rivera",
                  role: "Founder",
                  company: "Digital Agency",
                },
                {
                  quote: "Students get 24/7 help on our docs and FAQs. The bot knows our product—no more generic answers. Our support team loves it.",
                  name: "Jordan Lee",
                  role: "Customer Success",
                  company: "EdTech",
                },
              ].map((t) => (
                <blockquote
                  key={t.name}
                  className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
                >
                  <p className="flex-1 text-slate-700 italic leading-relaxed">
                    &ldquo;{t.quote}&rdquo;
                  </p>
                  <footer className="mt-6 border-t border-slate-100 pt-4">
                    <cite className="not-italic font-semibold text-slate-900">{t.name}</cite>
                    <p className="text-sm text-slate-500">
                      {t.role}, {t.company}
                    </p>
                  </footer>
                </blockquote>
              ))}
            </div>
          </div>
        </section>

        {/* CTA - Dark section */}
        <section className="relative overflow-hidden border-t border-slate-200 px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1a6aff] via-[#0d5aeb] to-slate-900" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent" />
          <div className="relative mx-auto max-w-3xl px-2 text-center sm:px-0">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to take SiteBotGPT for a spin?
            </h2>
            <p className="mt-4 text-blue-100">
              Find out if a personalized AI support chatbot is right for you. Create your first bot in minutes.
            </p>
            <ul className="mx-auto mt-6 flex max-w-md flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-blue-200">
              <li>Simple setup</li>
              <li>Friendly pricing</li>
              <li>No credit card</li>
              <li>Cancel anytime</li>
            </ul>
            <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center sm:flex-wrap sm:justify-center">
              <Link
                href="/signup"
                className="inline-flex w-full justify-center rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#1a6aff] transition-colors hover:bg-blue-50 sm:w-auto"
              >
                Start free
              </Link>
              <Link
                href="/demo"
                className="inline-flex w-full justify-center rounded-lg border border-blue-400/60 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                Try demo
              </Link>
              <Link
                href="/pricing"
                className="inline-flex w-full justify-center rounded-lg border border-blue-400/60 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-white/10 sm:w-auto"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Frequently asked questions
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-center text-slate-600">
            Can&apos;t find what you need? Reach out—we&apos;re happy to help.
          </p>

          <div className="mt-12 space-y-10 sm:mt-16 sm:space-y-12">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Training & setup
              </h3>
              <dl className="mt-6 space-y-6">
                {[
                  { q: "What can I train the bot on?", a: "Add your website URL (we crawl and index pages), upload PDFs, DOCX, or TXT files, or paste raw text. The bot uses only your content—no generic knowledge." },
                  { q: "How long does training take?", a: "Usually a few minutes. It depends on how much content you add. Most sites are indexed in under 5 minutes." },
                  { q: "Can I upload files?", a: "Yes. PDF, DOCX, TXT, and MD are supported. Each file is processed and added to your bot's knowledge base." },
                ].map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-6">
                    <dt className="font-semibold text-slate-900">{faq.q}</dt>
                    <dd className="mt-2 text-slate-600">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Embed & integrate
              </h3>
              <dl className="mt-6 space-y-6">
                {[
                  { q: "How do I add the chatbot to my site?", a: "Copy a single script tag and add it to your HTML. The chat bubble appears in the corner. No iframes, no complex setup—one line of code." },
                  { q: "Can it hand off to a human?", a: "Yes. When the bot is unsure or a visitor wants human help, capture their contact details and follow up. Great for sales and support handoffs." },
                ].map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-6">
                    <dt className="font-semibold text-slate-900">{faq.q}</dt>
                    <dd className="mt-2 text-slate-600">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">
                Pricing
              </h3>
              <dl className="mt-6 space-y-6">
                {[
                  { q: "Is there a free tier?", a: "Yes. Start with a free plan—multiple bots, document uploads, and core features. Upgrade when you need more volume or advanced options." },
                ].map((faq) => (
                  <div key={faq.q} className="rounded-xl border border-slate-200 bg-slate-50/30 p-4 sm:p-6">
                    <dt className="font-semibold text-slate-900">{faq.q}</dt>
                    <dd className="mt-2 text-slate-600">{faq.a}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white px-4 py-12 sm:px-6 sm:py-20 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Give your visitors a smarter way to get help
            </h2>
            <p className="mt-3 text-slate-600">
              Join teams using SiteBotGPT to automate support and capture leads.
            </p>
            <Link
              href="/signup"
              className="mt-6 inline-flex rounded-lg bg-[#1a6aff] px-8 py-3 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb]"
            >
              Start free
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
