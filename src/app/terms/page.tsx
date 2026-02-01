import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Terms &amp; Conditions
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: February 1, 2025</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
            <p className="mt-2 leading-relaxed">
              By accessing or using SiteBotGPT (&quot;the Service&quot;), you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use the Service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">2. Description of Service</h2>
            <p className="mt-2 leading-relaxed">
              SiteBotGPT provides an AI-powered chatbot platform that can be trained on your website content, documents, and other sources. The Service includes dashboard tools, APIs, and embeddable widgets for use on your sites and applications.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">3. Account and Use</h2>
            <p className="mt-2 leading-relaxed">
              You are responsible for maintaining the confidentiality of your account and for all activity under your account. You agree to use the Service only for lawful purposes and in accordance with these terms. You must not use the Service to transmit harmful, offensive, or illegal content or to violate any applicable laws.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">4. Intellectual Property</h2>
            <p className="mt-2 leading-relaxed">
              The Service, including its design, features, and underlying technology, is owned by SiteBotGPT or its licensors. You retain ownership of content you upload or train on. By using the Service, you grant us a limited license to process and store your content as necessary to provide the Service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">5. Limitation of Liability</h2>
            <p className="mt-2 leading-relaxed">
              The Service is provided &quot;as is&quot; and &quot;as available.&quot; To the fullest extent permitted by law, SiteBotGPT shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or data, arising from your use of the Service.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">6. Changes</h2>
            <p className="mt-2 leading-relaxed">
              We may update these Terms from time to time. We will notify you of material changes by posting the updated Terms on this page and updating the &quot;Last updated&quot; date. Your continued use of the Service after such changes constitutes acceptance of the revised Terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">7. Contact</h2>
            <p className="mt-2 leading-relaxed">
              For questions about these Terms, please contact us at{" "}
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
