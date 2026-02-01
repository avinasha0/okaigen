import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>

        <div className="mt-10 space-y-8 text-slate-700">
          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">1. Introduction</h2>
            <p className="mt-2 leading-relaxed">
              SiteBotGPT (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI chatbot platform and related services.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">2. Information We Collect</h2>
            <p className="mt-2 leading-relaxed">
              We may collect information you provide directly (e.g., account details, email, payment information), content you upload or use to train chatbots, usage data (e.g., how you use the dashboard and APIs), and technical data (e.g., IP address, browser type). We may also collect information from visitors who interact with your chatbots, such as messages and identifiers used for conversation continuity.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">3. How We Use Your Information</h2>
            <p className="mt-2 leading-relaxed">
              We use collected information to provide, maintain, and improve the Service; to process transactions; to send you service-related communications; to respond to your requests; to enforce our terms and policies; and to comply with legal obligations. We may use aggregated or anonymized data for analytics and product improvement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">4. Data Sharing and Disclosure</h2>
            <p className="mt-2 leading-relaxed">
              We do not sell your personal information. We may share information with service providers who assist us in operating the Service (e.g., hosting, payments, analytics), subject to confidentiality obligations. We may also disclose information when required by law or to protect our rights, safety, or property.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">5. Data Retention and Security</h2>
            <p className="mt-2 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide the Service and fulfill the purposes described in this policy. We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">6. Your Rights</h2>
            <p className="mt-2 leading-relaxed">
              Depending on your location, you may have rights to access, correct, delete, or port your personal data, or to object to or restrict certain processing. You can manage your account and data from the dashboard or by contacting us. You may also have the right to lodge a complaint with a supervisory authority.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">7. Contact</h2>
            <p className="mt-2 leading-relaxed">
              For privacy-related questions or requests, please contact us at{" "}
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
