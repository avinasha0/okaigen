import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Refund Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: February 1, 2025</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">1. Overview</h2>
            <p className="mt-2 leading-relaxed">
              SiteBotGPT aims to provide a reliable and valuable AI chatbot service. This Refund Policy explains when and how refunds may be requested for paid plans and related charges.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">2. Subscription Plans</h2>
            <p className="mt-2 leading-relaxed">
              Paid subscriptions are billed in advance (e.g., monthly or annually). If you cancel your plan, you will continue to have access until the end of your current billing period. We do not provide prorated refunds for partial billing periods once a cycle has started.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">3. Eligibility for Refunds</h2>
            <p className="mt-2 leading-relaxed">
              You may request a refund within 14 days of your initial purchase or upgrade if you are not satisfied with the Service. Refund requests are evaluated on a case-by-case basis. We may require a brief explanation of the issue. Refunds are not typically offered for renewals or for accounts that have heavily used the Service during the period in question.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">4. How to Request a Refund</h2>
            <p className="mt-2 leading-relaxed">
              To request a refund, contact us through our{" "}
              <Link href="/contact" className="text-[#1a6aff] hover:underline">Contact</Link> page and include your account email and the reason for your request. We will respond within a reasonable time and, if approved, process the refund to the original payment method. Refunds may take several business days to appear depending on your payment provider.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">5. Free Plan</h2>
            <p className="mt-2 leading-relaxed">
              Our free plan does not require payment. No refunds apply to the free plan.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">6. Changes to This Policy</h2>
            <p className="mt-2 leading-relaxed">
              We may update this Refund Policy from time to time. The &quot;Last updated&quot; date at the top of this page will reflect any changes. Continued use of paid services after changes constitutes acceptance of the updated policy.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">7. Contact</h2>
            <p className="mt-2 leading-relaxed">
              For refund requests or questions about this policy, please contact us at{" "}
              <Link href="/contact" className="text-[#1a6aff] hover:underline">Contact Us</Link>.
            </p>
          </section>
        </div>

        <div className="mt-12 border-t border-slate-200 pt-6">
          <Link href="/" className="text-sm font-medium text-[#1a6aff] hover:underline">← Back to home</Link>
        </div>
      </main>
    </div>
  );
}
