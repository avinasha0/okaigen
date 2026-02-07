import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function ComparePage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            SiteBotGPT vs other AI website chatbots
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            When comparing AI chatbots for your website, focus on how they’re trained, how you embed them, and whether they support lead capture and analytics. Here’s how SiteBotGPT is built to fit that checklist.
          </p>
        </div>

        <div className="mt-12 overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 font-semibold text-slate-900">What to compare</th>
                <th className="px-4 py-3 font-semibold text-slate-900">SiteBotGPT</th>
                <th className="px-4 py-3 font-semibold text-slate-500">What to look for in any tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Training</td>
                <td className="px-4 py-3 text-slate-600">Only your content (site, docs, PDFs). No generic AI knowledge for answers.</td>
                <td className="px-4 py-3 text-slate-500">Answers from your content only; avoids hallucinations and off-brand replies.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Embed</td>
                <td className="px-4 py-3 text-slate-600">One script tag. Works on any website, WordPress, React, Shopify, help centers.</td>
                <td className="px-4 py-3 text-slate-500">Simple install; no per-page config for basic use.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Lead capture</td>
                <td className="px-4 py-3 text-slate-600">Capture email, name, phone when bot is unsure or visitor wants human follow-up. Leads in dashboard.</td>
                <td className="px-4 py-3 text-slate-500">Configurable capture; leads exported or sent to your tools.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Analytics</td>
                <td className="px-4 py-3 text-slate-600">Chat history, top questions, message counts. Use data to improve content and retrain.</td>
                <td className="px-4 py-3 text-slate-500">Enough to see what visitors ask and improve over time.</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-medium text-slate-700">Pricing</td>
                <td className="px-4 py-3 text-slate-600">Free Starter plan; Growth, Scale, Enterprise. Transparent limits (messages, bots). No lock-in.</td>
                <td className="px-4 py-3 text-slate-500">Clear free/paid tiers; scale that matches your traffic.</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-slate-600">
          Choosing an AI chatbot for your website is less about a single “best” product and more about fit: content-trained answers, easy embed, lead capture, and pricing that scales with you. For a detailed checklist, see <Link href="/learn/website-chatbot-software" className="font-medium text-[#1a6aff] hover:underline">website chatbot software: what to look for</Link> and <Link href="/learn/how-to-choose-ai-customer-support-chatbot" className="font-medium text-[#1a6aff] hover:underline">how to choose an AI customer support chatbot</Link>.
        </p>

        <section className="mt-16 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Try SiteBotGPT</h2>
          <p className="mt-2 text-slate-600">See features, pricing, or run the demo with no signup.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/demo" className="inline-flex rounded-lg bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]">
              Try demo
            </Link>
            <Link href="/features" className="inline-flex rounded-lg border-2 border-[#1a6aff] bg-white px-6 py-3 text-sm font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/5">
              Features
            </Link>
            <Link href="/pricing" className="inline-flex rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#1a6aff] hover:text-[#1a6aff]">
              Pricing
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
