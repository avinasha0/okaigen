"use client";

import Link from "next/link";
import { useState } from "react";
import { ResponsiveNav } from "@/components/responsive-nav";

const PLANS = [
  {
    name: "Starter",
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: "Perfect for trying SiteBotGPT",
    features: [
      "1 chatbot",
      "Up to 100 messages per day",
      "Website + document training",
      "Chat widget embed",
      "Lead capture",
      "Basic analytics",
    ],
    cta: "Start free",
    href: "/signup",
    popular: false,
    highlight: false,
  },
  {
    name: "Growth",
    monthlyPrice: 49,
    yearlyPrice: 39,
    description: "For growing teams",
    features: [
      "Up to 3 chatbots",
      "Up to 2,000 messages/month",
      "Up to 2,000 pages",
      "Manual refresh",
      "Up to 3 team members",
      "Export analytics",
    ],
    cta: "Start free trial",
    href: "/signup",
    popular: true,
    highlight: true,
  },
  {
    name: "Scale",
    monthlyPrice: 149,
    yearlyPrice: 119,
    description: "For scaling businesses",
    features: [
      "Up to 10 chatbots",
      "Up to 10,000 messages/month",
      "Up to 20,000 pages",
      "Auto refresh (weekly)",
      "Up to 10 team members",
      "API access",
      "Priority support",
    ],
    cta: "Start free trial",
    href: "/signup",
    popular: false,
    highlight: false,
  },
  {
    name: "Enterprise",
    monthlyPrice: null,
    yearlyPrice: null,
    description: "Custom for large organizations",
    features: [
      "Unlimited chatbots",
      "Custom message volume",
      "Unlimited pages",
      "Auto refresh (daily)",
      "Unlimited team members",
      "API & webhooks",
      "Dedicated support",
      "Custom integrations",
    ],
    cta: "Contact us",
    href: "mailto:support@sitebotgpt.io",
    popular: false,
    highlight: false,
  },
];

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
      <ResponsiveNav />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]" />
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-[#1a6aff]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
        <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Pricing plans
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
              Simple, transparent pricing. Start free and scale as you grow.
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
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-3 text-sm text-slate-600">
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#1a6aff]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        {f}
                      </li>
                    ))}
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
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Remove Atlas branding</p>
                  <p className="text-sm text-slate-500">White-label the chat widget</p>
                </div>
                <span className="text-lg font-bold text-slate-900">+$29/mo</span>
              </div>
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/50 p-4">
                <div>
                  <p className="font-medium text-slate-900">Extra 5k messages</p>
                  <p className="text-sm text-slate-500">Additional message capacity</p>
                </div>
                <span className="text-lg font-bold text-slate-900">+$29/mo</span>
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
