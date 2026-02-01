import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main id="main-content" className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16" tabIndex={-1}>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-slate-500">Last updated: February 1, 2025</p>

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
              We may collect information you provide directly (e.g., account details, email, payment information), content you upload or use to train chatbots, usage data (e.g., how you use the dashboard and APIs), and technical data (e.g., IP address, browser type). We also collect information from visitors who interact with chatbots embedded on your or third-party sites, as described in Section 3 (Chatbot and Visitor Data) below.
            </p>
          </section>

          <section id="chatbot-visitor-data">
            <h2 className="font-heading text-lg font-semibold text-slate-900">3. Chatbot and Visitor Data</h2>
            <p className="mt-2 leading-relaxed">
              When someone uses a SiteBotGPT chatbot (e.g. via the chat widget on a website), we collect and process data on behalf of the bot owner (our customer). This &quot;visitor data&quot; may include:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-slate-700">
              <li><strong>Conversations:</strong> The messages visitors send and the bot&apos;s replies, so the bot owner can view chat history, improve answers, and train the bot.</li>
              <li><strong>Leads:</strong> If the bot is configured to capture leads, we may collect and store name, email, phone, and message content when a visitor submits a lead form.</li>
              <li><strong>Technical and context data:</strong> A pseudonymous visitor identifier (to keep conversation context), the page URL where the chat occurred, and similar metadata the bot owner may use for analytics and support.</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              This visitor data is stored in our systems and is visible to the bot owner (and any team members they authorize) via the dashboard. We process it to provide the Service (e.g. answering questions, storing chats and leads) and to improve our systems. We do not use visitor data for our own marketing or advertising; we act as a processor for the bot owner, who is responsible for their own privacy notices to their visitors.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">4. How We Use Your Information</h2>
            <p className="mt-2 leading-relaxed">
              We use collected information to provide, maintain, and improve the Service; to process transactions; to send you service-related communications; to respond to your requests; to enforce our terms and policies; and to comply with legal obligations. We may use aggregated or anonymized data for analytics and product improvement.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">5. Data Sharing and Disclosure</h2>
            <p className="mt-2 leading-relaxed">
              We do not sell your personal information. We may share information with service providers who assist us in operating the Service (e.g., hosting, payments, analytics), subject to confidentiality obligations. We may also disclose information when required by law or to protect our rights, safety, or property.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">6. Data Retention and Security</h2>
            <p className="mt-2 leading-relaxed">
              We retain your information for as long as your account is active or as needed to provide the Service and fulfill the purposes described in this policy.
            </p>
            <p className="mt-2 leading-relaxed">
              <strong>Chat and lead data:</strong> Conversation history and captured leads are retained for as long as the bot owner&apos;s account is active (or as they configure). Bot owners can view, export, and delete chats and leads from the dashboard. If an account is closed, we may retain data for a limited period for legal or operational reasons before deletion.
            </p>
            <p className="mt-2 leading-relaxed">
              We implement appropriate technical and organizational measures to protect your data against unauthorized access, alteration, or destruction.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">7. Your Rights</h2>
            <p className="mt-2 leading-relaxed">
              Depending on your location, you may have rights to access, correct, delete, or port your personal data, or to object to or restrict certain processing. You can manage your account and data from the dashboard or by contacting us. You may also have the right to lodge a complaint with a supervisory authority.
            </p>
          </section>

          <section id="cookies">
            <h2 className="font-heading text-lg font-semibold text-slate-900">8. Cookies and Similar Technologies</h2>
            <p className="mt-2 leading-relaxed">
              We use cookies and similar technologies for:
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1 leading-relaxed text-slate-700">
              <li><strong>Essential cookies:</strong> Required for the site to work (e.g. session and sign-in, security). These do not require your consent.</li>
              <li><strong>Optional cookies:</strong> We may use analytics or other non-essential cookies to understand how the site is used and to improve our service. We will only use these with your consent. You can accept or reject optional cookies via the cookie banner when you first visit; your choice is stored and you can change it by clearing site data or contacting us.</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Our cookie banner allows you to choose &quot;Essential only&quot; (no optional cookies) or &quot;Accept all&quot; (including optional cookies). For more detail or to change your preference, contact us as in Section 9.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg font-semibold text-slate-900">9. Contact</h2>
            <p className="mt-2 leading-relaxed">
              For privacy-related questions, cookie preferences, or data requests, please contact us at{" "}
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
