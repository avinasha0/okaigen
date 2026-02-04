"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { useState } from "react";
import { ResponsiveNav } from "@/components/responsive-nav";
import { PLANS } from "@/lib/plans";
import { useRouter } from "next/navigation";

const CelebrationConfetti = dynamic(
  () => import("@/components/celebration-confetti").then((m) => ({ default: m.CelebrationConfetti })),
  { ssr: false }
);

const FAQ = [
  {
    q: "Can I try before I buy?",
    a: "Yes. Start with the free Starter plan—no credit card required. You can upgrade anytime when you need more capacity."},
  {
    q: "What content can I train the bot on?",
    a: "You can train your bot on website URLs, sitemaps, and uploaded files (PDF, DOCX, TXT, MD). The more content you provide, the better the answers."},
  {
    q: "How do I add the chatbot to my site?",
    a: "Copy one embed script from your dashboard and paste it before the closing </body> tag. The chat bubble appears automatically. We also provide platform-specific guides for WordPress, Shopify, and more."},
  {
    q: "Can I change plans later?",
    a: "Yes. You can upgrade or downgrade at any time. Billing is prorated so you only pay for what you use."},
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) and PayPal. Invoicing is available for Enterprise plans."},
  {
    q: "Do you offer refunds?",
    a: "Yes. We offer a 30-day money-back guarantee on paid plans. If you're not satisfied, contact us for a full refund. See our Refund Policy for details."},
  {
    q: "How many bots or websites can I use?",
    a: "Starter includes 1 bot; Growth and Scale include multiple bots. Each plan lists the exact bot limit. Enterprise can have unlimited bots and dedicated support."},
  {
    q: "Is there API access?",
    a: "API access is included on Growth, Scale, and Enterprise plans. Use it to send messages from your app, sync data, or build custom integrations."},
  {
    q: "Where is my data stored?",
    a: "Your content and chat data are stored in secure, encrypted infrastructure. We do not train general AI models on your data. See our Privacy Policy for full details."},
  {
    q: "Can I remove \"Powered by\" branding?",
    a: "Scale and Enterprise plans include white-label (no branding). On other plans, you can add the Remove Branding add-on for an extra fee."},
  {
    q: "What kind of support do I get?",
    a: "All plans include email support and documentation. Growth and above get priority support; Enterprise includes dedicated success management and SLA."},
  {
    q: "Do you have an uptime SLA?",
    a: "We aim for 99.9% uptime. Scale and Enterprise plans include a formal SLA. Check our status page for current availability."},
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const router = useRouter();
  async function handleGetAddonClick() {
    try {
      const res = await fetch("/api/auth/session", { credentials: "include" });
      const data = await res.json().catch(() => ({}));
      const loggedIn = !!data?.user?.id;
      if (!loggedIn) {
        const callbackUrl = encodeURIComponent("/dashboard/pricing");
        router.push(`/login?callbackUrl=${callbackUrl}`);
        return;
      }
      router.push("/contact?subject=Add-on%3A%20Remove%20SiteBotGPT%20branding");
    } catch {
      const callbackUrl = encodeURIComponent("/dashboard/pricing");
      router.push(`/login?callbackUrl=${callbackUrl}`);
    }
  }

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
                  <button
                    type="button"
                    onClick={handleGetAddonClick}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
                  >
                    Get add-on
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Why teams choose us
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            Simple setup, transparent pricing, and support that scales with you.
          </p>
          <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6aff]/10 text-[#1a6aff]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Setup in minutes</h3>
              <p className="mt-2 text-sm text-slate-600">Add your URL or docs, get a trained bot. No engineering required.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6aff]/10 text-[#1a6aff]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Your data stays yours</h3>
              <p className="mt-2 text-sm text-slate-600">We don’t train external models on your content. Encrypted and secure.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6aff]/10 text-[#1a6aff]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8v-3M3 21h18M3 10h18M3 7l9-4 9 4M4 18h9v-7H4v7z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Pay as you grow</h3>
              <p className="mt-2 text-sm text-slate-600">Start free, upgrade when you need more messages and features.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a6aff]/10 text-[#1a6aff]">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="mt-4 font-semibold text-slate-900">Real support</h3>
              <p className="mt-2 text-sm text-slate-600">Documentation, email support, and priority help on higher plans.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Compare at a glance */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
            Compare at a glance
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-center text-slate-600">
            See how plans stack up on key features.
          </p>
          <div className="mt-12 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full min-w-[600px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-4 py-3 font-semibold text-slate-900">Feature</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Starter</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Growth</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Scale</th>
                  <th className="px-4 py-3 font-semibold text-slate-900">Enterprise</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr><td className="px-4 py-3 text-slate-600">Messages</td><td className="px-4 py-3">10/day</td><td className="px-4 py-3">2,000/mo</td><td className="px-4 py-3">10,000/mo</td><td className="px-4 py-3">Custom</td></tr>
                <tr><td className="px-4 py-3 text-slate-600">Bots</td><td className="px-4 py-3">1</td><td className="px-4 py-3">3</td><td className="px-4 py-3">10</td><td className="px-4 py-3">Unlimited</td></tr>
                <tr><td className="px-4 py-3 text-slate-600">API & webhooks</td><td className="px-4 py-3">—</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td></tr>
                <tr><td className="px-4 py-3 text-slate-600">Remove branding</td><td className="px-4 py-3">—</td><td className="px-4 py-3">Add-on</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td></tr>
                <tr><td className="px-4 py-3 text-slate-600">Priority support</td><td className="px-4 py-3">—</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">Dedicated</td></tr>
                <tr><td className="px-4 py-3 text-slate-600">SLA</td><td className="px-4 py-3">—</td><td className="px-4 py-3">—</td><td className="px-4 py-3">✓</td><td className="px-4 py-3">✓</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Enterprise / Custom */}
      <section className="border-t border-slate-200 bg-white py-16 sm:py-20">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">
            Need something custom?
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Enterprise plans include custom message limits, SSO, dedicated support, and tailored SLAs. Tell us your requirements and we’ll put together a proposal.
          </p>
          <div className="mt-8">
            <Link
              href="/contact?subject=About%20Enterprise%20Plan"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-3.5 text-base font-semibold text-white transition hover:bg-slate-800"
            >
              Contact sales
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="border-t border-slate-200 bg-slate-50/50 py-12 sm:py-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-xl font-bold text-slate-900 sm:text-2xl">
            Built for reliability
          </h2>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-12 gap-y-6 text-slate-600">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>Encrypted data</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>99.9% uptime target</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>No lock-in contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
              <span>30-day money-back guarantee</span>
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
    </div>
  );
}
