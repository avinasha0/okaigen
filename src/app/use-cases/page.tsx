import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

const USE_CASES = [
  {
    title: "Customer support",
    description: "Answer product questions, shipping, returns, and policies 24/7. Reduce ticket volume and let your team focus on complex or high-value conversations.",
    links: [
      { label: "What is an AI customer support chatbot?", href: "/learn/what-is-ai-customer-support-chatbot" },
      { label: "Can AI replace customer support?", href: "/learn/can-ai-replace-customer-support" },
    ],
  },
  {
    title: "Lead capture",
    description: "When the bot is unsure or a visitor asks for human follow-up, capture email, name, and phone. Build a list of leads for sales and support handoffs.",
    links: [],
  },
  {
    title: "FAQ automation",
    description: "Handle frequently asked questions conversationally. Visitors ask in their own words instead of scanning a long FAQ page. Fewer repetitive tickets.",
    links: [],
  },
  {
    title: "SaaS & product teams",
    description: "Onboard users, answer product and billing questions, and point visitors to the right docs. Ideal for product-led growth and support deflection.",
    links: [{ label: "Who needs an AI support agent?", href: "/learn/who-needs-an-ai-support-agent" }],
  },
  {
    title: "E‑commerce",
    description: "Help shoppers with orders, returns, and product questions. Capture leads for out-of-stock items or when they want to talk to sales.",
    links: [],
  },
  {
    title: "Agencies & consulting",
    description: "First-line support for client websites. Reduce repetitive client questions and free your team for strategy and high-touch work.",
    links: [],
  },
  {
    title: "EdTech & education",
    description: "Student and instructor help, course FAQs, and 24/7 availability. Train the bot on your learning content and docs.",
    links: [],
  },
];

export default function UseCasesPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            AI chatbot use cases
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600">
            From customer support and lead capture to FAQs and industry-specific help. See how teams use an AI chatbot for their website.
          </p>
        </div>

        <div className="mt-16 space-y-10 sm:mt-20">
          {USE_CASES.map((uc) => (
            <section key={uc.title} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-slate-900">{uc.title}</h2>
              <p className="mt-3 text-slate-600">{uc.description}</p>
              {uc.links.length > 0 && (
                <ul className="mt-4 space-y-1">
                  {uc.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="text-sm font-medium text-[#1a6aff] hover:underline">
                        {l.label} →
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>

        <section className="mt-20 rounded-2xl border border-slate-200 bg-slate-50/50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">Find the right fit</h2>
          <p className="mt-2 text-slate-600">See features and pricing, or try the demo.</p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/features"
              className="inline-flex rounded-lg bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="inline-flex rounded-lg border-2 border-[#1a6aff] bg-white px-6 py-3 text-sm font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/5"
            >
              Pricing
            </Link>
            <Link href="/demo" className="inline-flex rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 transition-colors hover:border-[#1a6aff] hover:text-[#1a6aff]">
              Try demo
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
