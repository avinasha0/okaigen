import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            AI chatbot features for your website
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            Train on your content, embed in one snippet, capture leads, and learn from every conversation. Everything you need to run an AI-powered support chatbot.
          </p>
        </div>

        <div className="mt-16 space-y-16 sm:mt-20">
          <section>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Your brand, your voice</h2>
            <p className="mt-3 text-slate-600">
              SiteBotGPT trains only on your content—website, docs, PDFs—so answers match your brand. Set the tone (formal, friendly, or casual) and how the bot handles uncertainty. Responses use your information only, so they stay accurate and on-brand. No generic AI knowledge in the mix.
            </p>
            <p className="mt-3">
              <Link href="/#features" className="font-medium text-[#1a6aff] hover:underline">See how it works on the homepage</Link> or <Link href="/demo" className="font-medium text-[#1a6aff] hover:underline">try the demo</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Quick prompts</h2>
            <p className="mt-3 text-slate-600">
              Give visitors a way to start the conversation. Add frequently asked questions or prompts you wish more users would ask. Turn cold traffic into engaged conversations from the first click.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Lead capture</h2>
            <p className="mt-3 text-slate-600">
              When the bot is unsure or a visitor wants human help, capture their email, name, and phone. Leads appear in your dashboard for follow-up. Ideal for sales handoffs and support escalation.
            </p>
            <p className="mt-3">
              <Link href="/pricing" className="font-medium text-[#1a6aff] hover:underline">View pricing and plans</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">Analytics</h2>
            <p className="mt-3 text-slate-600">
              View chat history, see which questions come up most, and identify where to add training data. Make your bot smarter with real usage insights.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">One snippet, deploy anywhere</h2>
            <p className="mt-3 text-slate-600">
              Add the widget to your marketing site, product dashboard, or help center with a single script tag. Same bot, consistent answers, no extra setup per page. Works on any website—WordPress, React, Shopify, and more.
            </p>
            <p className="mt-3">
              <Link href="/integration" className="font-medium text-[#1a6aff] hover:underline">Integrations</Link> and <Link href="/docs" className="font-medium text-[#1a6aff] hover:underline">documentation</Link>.
            </p>
          </section>
        </div>

        <section className="mt-20 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Ready to try it?</h2>
          <p className="mt-2 text-slate-600">Start with a free plan. No credit card required.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/signup"
              className="inline-flex rounded-lg bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
            >
              Get started free
            </Link>
            <Link
              href="/demo"
              className="inline-flex rounded-lg border-2 border-[#1a6aff] bg-white px-6 py-3 text-sm font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/5"
            >
              Try demo
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#1a6aff] hover:text-[#1a6aff]"
            >
              Pricing
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
