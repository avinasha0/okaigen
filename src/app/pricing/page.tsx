"use client";

import Link from "next/link";
import { useState } from "react";
import { CelebrationConfetti } from "@/components/celebration-confetti";
import { ResponsiveNav } from "@/components/responsive-nav";
import { PLANS } from "@/lib/plans";

const FAQ = [
  {
    q: "Can I try before I buy?",
    a: "Yes. Start with the free Starter plan—no credit card required. You can upgrade anytime when you need more capacity.",
  },
  {
    q: "What content can I train the bot on?",
    a: "You can train your bot on website URLs, sitemaps, and uploaded files (PDF, DOCX, TXT, MD). The more content you provide, the better the answers.",
  },
  {
    q: "How do I add the chatbot to my site?",
    a: "Copy one embed script from your dashboard and paste it before the closing </body> tag. The chat bubble appears automatically. We also provide platform-specific guides for WordPress, Shopify, and more.",
  },
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade or downgrade at any time. Billing is prorated so you only pay for what you use.",
  },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      <CelebrationConfetti />
      <ResponsiveNav />

      {/* Hero - explicit dark bg so text is always visible */}
      <section className="relative overflow-hidden bg-[#0f172a]">
        <div className="absolute inset-0 z-0 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]" aria-hidden />
        <div className="absolute -right-40 -top-40 z-0 h-96 w-96 rounded-full bg-[#1a6aff]/20 blur-3xl" aria-hidden />
        <div className="absolute -bottom-40 -left-40 z-0 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" aria-hidden />
        <div className="relative z-10 mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Pricing plans
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-xl font-medium text-white/95 sm:text-2xl">
              Pays for itself in saved support time
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-300">
              Whether you&apos;re just getting started or are a large enterprise, we have a plan for you.
            </p>
            <p className="mt-8 text-sm font-medium uppercase tracking-wider text-slate-400">
              Trusted by growing teams worldwide
            </p>
            {/* Billing toggle */}
            <div className="mt-10 flex items-center justify-center gap-4">
              <span className={`text-sm font-medium ${!yearly ? "text-white" : "text-slate-400"}`}>
                Monthly
              </span>
              <button
                type="button"
                onClick={() => setYearly(!yearly)}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  yearly ? "bg-[#1a6aff]" : "bg-slate-600"
                }`}
                aria-pressed={yearly}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    yearly ? "left-7" : "left-1"
                  }`}
                />
              </button>
              <span className={`text-sm font-medium ${yearly ? "text-white" : "text-slate-400"}`}>
                Yearly
              </span>
              <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                Save 20%
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Plans grid */}
      <section className="relative -mt-8 px-4 pb-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-xl transition-all sm:p-8 ${
                  plan.highlight
                    ? "border-[#1a6aff] ring-4 ring-[#1a6aff]/10"
                    : "border-slate-200 hover:border-slate-300 hover:shadow-2xl"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="rounded-full bg-[#1a6aff] px-4 py-1.5 text-xs font-semibold text-white shadow-lg">
                      Most popular
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
                  <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
                  <div className="mt-6 flex items-baseline gap-1">
                    {plan.monthlyPrice !== null ? (
                      <>
                        <span className="text-4xl font-extrabold text-slate-900">
                          ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                        </span>
                        <span className="text-slate-500">/mo</span>
                        {yearly && plan.monthlyPrice > 0 && (
                          <span className="ml-2 text-xs text-slate-400">
                            billed yearly
                          </span>
                        )}
                      </>
                    ) : (
                      <span className="text-3xl font-extrabold text-slate-900">Custom</span>
                    )}
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f, i) => {
                      const isExcluded = typeof f === "object" && f.excluded;
                      const label = typeof f === "string" ? f : f.text;
                      return (
                        <li
                          key={typeof f === "string" ? f : `${f.text}-${i}`}
                          className={`flex items-start gap-3 text-sm ${isExcluded ? "text-slate-400" : "text-slate-600"}`}
                        >
                          {isExcluded ? (
                            <svg
                              className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          ) : (
                            <svg
                              className="mt-0.5 h-5 w-5 shrink-0 text-[#1a6aff]"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                              aria-hidden
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                            </svg>
                          )}
                          {label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className="mt-8">
                  <Link
                    href={plan.href}
                    className={`flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                      plan.highlight
                        ? "bg-[#1a6aff] text-white shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb]"
                        : "border-2 border-slate-300 text-slate-700 hover:border-[#1a6aff] hover:bg-[#1a6aff]/5 hover:text-[#1a6aff]"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Add-ons */}
          <div className="mx-auto mt-16 max-w-4xl">
            <h2 className="text-center text-xl font-bold text-slate-900">Add-ons</h2>
            <p className="mt-2 text-center text-sm text-slate-500">
              Extend your plan with optional upgrades
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-4 rounded-xl border border-slate-200 bg-slate-50/50 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium text-slate-900">Remove SiteBotGPT branding</p>
                  <p className="text-sm text-slate-500">White-label the chat widget</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-bold text-slate-900">+$29/mo</span>
                  <Link
                    href="/contact?subject=Add-on%3A%20Remove%20SiteBotGPT%20branding"
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
                  >
                    Get add-on
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Frequently asked questions
          </h2>
          <div className="mt-12 space-y-4">
            {FAQ.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between font-medium text-slate-900">
                  {item.q}
                  <svg
                    className="h-5 w-5 shrink-0 text-slate-400 transition-transform group-open:rotate-180"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <p className="mt-3 text-slate-600">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1a6aff] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-2xl font-bold text-white sm:text-3xl">
            Ready to automate your support?
          </h2>
          <p className="mt-4 text-lg text-blue-100">
            Join teams using SiteBotGPT to capture leads, answer questions, and delight customers.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex w-full justify-center rounded-xl bg-white px-8 py-4 text-base font-semibold text-[#1a6aff] shadow-lg transition-all hover:bg-slate-100 sm:w-auto"
            >
              Start free
            </Link>
            <Link
              href="/demo"
              className="inline-flex w-full justify-center rounded-xl border-2 border-white/50 bg-transparent px-8 py-4 text-base font-semibold text-white transition-all hover:bg-white/10 sm:w-auto"
            >
              Try demo
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
