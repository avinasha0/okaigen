import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://okaigen.com";

export default function DocumentationPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            SiteBotGPT Documentation
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Learn how to use every feature of SiteBotGPT: from creating your first bot and embedding the chat widget to using the dashboard, API, and free tools.
          </p>

          {/* Quick links */}
          <nav className="not-prose my-10 rounded-xl border border-slate-200 bg-slate-50/80 p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              On this page
            </h2>
            <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <li><a href="#getting-started" className="text-[#1a6aff] hover:underline">Getting started</a></li>
              <li><a href="#chat-widget" className="text-[#1a6aff] hover:underline">Chat widget</a></li>
              <li><a href="#dashboard" className="text-[#1a6aff] hover:underline">Dashboard</a></li>
              <li><a href="#free-tools" className="text-[#1a6aff] hover:underline">Free tools</a></li>
              <li><a href="#api" className="text-[#1a6aff] hover:underline">API &amp; webhooks</a></li>
            </ul>
          </nav>

          {/* Getting started */}
          <section id="getting-started" className="scroll-mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Getting started</h2>
            <p className="mt-2 text-slate-600">
              SiteBotGPT turns your website and documents into an AI customer support agent. Here’s how to go from zero to a live chatbot.
            </p>
            <ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-600">
              <li>
                <strong>Sign up</strong> — Create an account at{" "}
                <Link href="/signup" className="text-[#1a6aff] hover:underline">Get started free</Link>.
                You can use email/password or sign in with Google.
              </li>
              <li>
                <strong>Create a bot</strong> — In the <Link href="/dashboard" className="text-[#1a6aff] hover:underline">Dashboard</Link>, click &quot;New bot&quot;. Give it a name (e.g. &quot;Support Bot&quot;) and optionally your website URL.
              </li>
              <li>
                <strong>Add sources</strong> — In the bot’s <strong>Setup</strong> page, add content for the bot to learn from:
                <ul className="mt-2 list-disc pl-6">
                  <li><strong>Website URL</strong> — We crawl the URL and index the content (respects robots.txt).</li>
                  <li><strong>Documents</strong> — Upload PDF, DOCX, TXT, or MD files. Available on paid plans.</li>
                </ul>
              </li>
              <li>
                <strong>Train</strong> — Click &quot;Train&quot; (or &quot;Retrain&quot;) so the bot builds its knowledge from your sources. Training may take a minute depending on content size.
              </li>
              <li>
                <strong>Embed the widget</strong> — On the bot’s main page, copy the embed code and add it to your website (see <a href="#chat-widget" className="text-[#1a6aff] hover:underline">Chat widget</a>).
              </li>
            </ol>
          </section>

          {/* Chat widget */}
          <section id="chat-widget" className="mt-12 scroll-mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Chat widget</h2>
            <p className="mt-2 text-slate-600">
              The chat widget is a small bubble on your site that opens a chat panel. Visitors can ask questions and get answers from your bot 24/7.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">How to get the embed code</h3>
            <p className="mt-2 text-slate-600">
              Go to <strong>Dashboard → [Your bot]</strong>. The embed code is shown in the &quot;Add to your site&quot; section. It looks like:
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
{`<script src="${BASE_URL}/widget.js" data-bot="atlas_xxxx" data-base="${BASE_URL}"></script>`}
            </pre>
            <p className="mt-2 text-slate-600">
              <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">data-bot</code> is your bot’s public key (atlas_...). <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">data-base</code> is your SiteBotGPT app URL.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Adding the widget to your site</h3>
            <p className="mt-2 text-slate-600">
              Paste the script <strong>once</strong>, usually in the footer or before <code className="rounded bg-slate-100 px-1 py-0.5">&lt;/body&gt;</code>. The chat bubble will appear on every page where the script loads.
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-600">
              <li><strong>WordPress</strong> — Use a plugin like &quot;Insert Headers and Footers&quot; and paste the code in &quot;Scripts in Footer&quot;. Or add it in <code className="rounded bg-slate-100 px-1 py-0.5">footer.php</code> before the closing <code className="rounded bg-slate-100 px-1 py-0.5">&lt;/body&gt;</code>.</li>
              <li><strong>Wix</strong> — Settings → Custom Code → Add code to &quot;Body - end&quot;.</li>
              <li><strong>Squarespace</strong> — Settings → Advanced → Code Injection → Footer.</li>
              <li><strong>Shopify</strong> — Themes → Edit code → <code className="rounded bg-slate-100 px-1 py-0.5">theme.liquid</code> → paste before the last line.</li>
              <li><strong>Google Tag Manager</strong> — New tag → Custom HTML → paste the script; trigger on All Pages.</li>
              <li><strong>Manual / HTML</strong> — Paste the script at the bottom of your HTML, before <code className="rounded bg-slate-100 px-1 py-0.5">&lt;/body&gt;</code>.</li>
            </ul>
            <p className="mt-3 text-slate-600">
              In the dashboard, you can <strong>download step-by-step instructions</strong> for your platform (WordPress, Wix, etc.) from the same &quot;Add to your site&quot; section.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Widget options (script attributes)</h3>
            <p className="mt-2 text-slate-600">
              The embed script supports the following attributes:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">data-bot</code> (required) — Your bot’s public key (atlas_...).</li>
              <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">data-base</code> (optional) — Your SiteBotGPT app URL. Defaults to the script’s origin if omitted.</li>
            </ul>
            <p className="mt-3 text-slate-600">
              <strong>Position and colors:</strong> The chat bubble is fixed in the bottom-right corner. Colors and layout use the default theme (blue accent). Custom position or colors are not configurable via script attributes in the current version.
            </p>
            <p className="mt-2 text-slate-600">
              <strong>Branding:</strong> The widget can show &quot;Powered by SiteBotGPT&quot; at the bottom of the chat panel. On <strong>Scale and Enterprise</strong> plans (or with the Remove Branding add-on), you can turn this off in the dashboard: open your bot → <strong>Embed code</strong> card → toggle &quot;Remove SiteBotGPT branding&quot;. The setting is saved per bot.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Widget behavior</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li>Visitors see a chat bubble; clicking it opens the chat panel.</li>
              <li>The bot shows a <strong>greeting</strong> and optional <strong>quick prompts</strong> (e.g. &quot;What are your hours?&quot;) that you configure in Setup.</li>
              <li>When the AI is unsure, it can ask for the visitor’s <strong>name and email</strong> (lead capture). Captured leads appear in Dashboard → Leads.</li>
            </ul>
          </section>

          {/* Dashboard */}
          <section id="dashboard" className="mt-12 scroll-mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Dashboard</h2>
            <p className="mt-2 text-slate-600">
              After signing in, the dashboard is your control center. Here’s what each area does.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Bots</h3>
            <p className="mt-2 text-slate-600">
              <strong>Dashboard home</strong> lists all your bots. You can create a new bot (subject to plan limits), open a bot to manage it, or delete a bot. Each bot has its own embed code, sources, and settings.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Bot setup (sources &amp; training)</h3>
            <p className="mt-2 text-slate-600">
              Open a bot and click <strong>Add sources</strong> (or go to <strong>Setup</strong>). Here you:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><strong>Add website URLs</strong> — Enter a URL; we crawl and index that page (and optionally linked pages). Good for docs, FAQs, product pages.</li>
              <li><strong>Upload documents</strong> — PDF, DOCX, TXT, MD (on plans that support documents). Files are chunked and embedded for RAG.</li>
              <li><strong>Train / Retrain</strong> — Click to (re)build the bot’s knowledge from all sources. Do this after adding or changing sources.</li>
            </ul>
            <p className="mt-2 text-slate-600">
              Source list shows status (pending, ready, error). If a source fails, check the error message and fix the URL or file, then retrain.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Bot settings (name, greeting, quick prompts)</h3>
            <p className="mt-2 text-slate-600">
              On the bot’s main page you can edit:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><strong>Name</strong> — Display name of the bot (e.g. in the widget header).</li>
              <li><strong>Greeting</strong> — First message visitors see when they open the chat.</li>
              <li><strong>Quick prompts</strong> — Short suggested questions (e.g. &quot;Pricing?&quot;, &quot;Contact?&quot;) that visitors can tap to send.</li>
              <li><strong>Lead capture</strong> — When to ask for name/email (e.g. when confidence is low). Optional.
            </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Analytics</h3>
            <p className="mt-2 text-slate-600">
              In <strong>Dashboard → [Bot] → Analytics</strong> you see:
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li>Chat volume over time.</li>
              <li>Top questions asked by visitors.</li>
              <li>Other metrics to improve your content and bot answers.
            </li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Chats</h3>
            <p className="mt-2 text-slate-600">
              <strong>Dashboard → [Bot] → Chats</strong> shows conversation history. You can review what visitors asked and how the bot replied, and use this to spot gaps in your knowledge base.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Leads</h3>
            <p className="mt-2 text-slate-600">
              When the widget captures a visitor’s name and email (e.g. when the AI is unsure), the lead appears in <strong>Dashboard → [Bot] → Leads</strong> (or the global <strong>Leads</strong> page). You can view, export, or follow up from there.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">API keys</h3>
            <p className="mt-2 text-slate-600">
              <strong>Dashboard → API</strong> lets you create and manage <strong>API keys</strong> for programmatic access. Available on <strong>Scale</strong> and <strong>Enterprise</strong> plans. Use the key in the <code className="rounded bg-slate-100 px-1 py-0.5">Authorization: Bearer</code> or <code className="rounded bg-slate-100 px-1 py-0.5">x-api-key</code> header when calling the Chat API. See <Link href="/docs/api" className="text-[#1a6aff] hover:underline">API Documentation</Link>.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Webhooks</h3>
            <p className="mt-2 text-slate-600">
              <strong>Dashboard → Webhooks</strong> (Scale/Enterprise) lets you register a URL to receive HTTP POST requests when events happen (e.g. <code className="rounded bg-slate-100 px-1 py-0.5">lead.captured</code>, <code className="rounded bg-slate-100 px-1 py-0.5">chat.message</code>). Use this to push leads to your CRM or log conversations. Full details and payloads are in the <Link href="/docs/api#webhooks" className="text-[#1a6aff] hover:underline">API docs</Link>.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Team</h3>
            <p className="mt-2 text-slate-600">
              <strong>Dashboard → Team</strong> lets you invite team members by email. They can access the same bots and dashboard according to your plan. Accept invitations via the link in the invite email.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Settings &amp; billing</h3>
            <p className="mt-2 text-slate-600">
              <strong>Dashboard → Settings</strong> — Account and profile. <strong>Dashboard → Pricing</strong> — View plan, usage, and upgrade options.
            </p>
          </section>

          {/* Free tools */}
          <section id="free-tools" className="mt-12 scroll-mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Free tools</h2>
            <p className="mt-2 text-slate-600">
              SiteBotGPT offers free, no-signup tools for content and productivity. All are available at <Link href="/tools" className="text-[#1a6aff] hover:underline">/tools</Link>.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">AI generators</h3>
            <p className="mt-2 text-slate-600">
              Generate text with AI: replies, prompts, FAQs, answers, email responses, letters, blog titles, chatbot names, SaaS brand names. Use the input fields on each tool page, then copy the result.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><Link href="/tools/ai-reply-generator" className="text-[#1a6aff] hover:underline">AI Reply Generator</Link> — Replies to messages.</li>
              <li><Link href="/tools/ai-prompt-generator" className="text-[#1a6aff] hover:underline">AI Prompt Generator</Link> — Create AI prompts.</li>
              <li><Link href="/tools/ai-prompt-optimizer" className="text-[#1a6aff] hover:underline">AI Prompt Optimizer</Link> — Improve existing prompts.</li>
              <li><Link href="/tools/ai-faq-generator" className="text-[#1a6aff] hover:underline">AI FAQ Generator</Link> — FAQs for a topic/product.</li>
              <li><Link href="/tools/ai-answer-generator" className="text-[#1a6aff] hover:underline">AI Answer Generator</Link> — Quick answers to questions.</li>
              <li><Link href="/tools/ai-email-response-generator" className="text-[#1a6aff] hover:underline">AI Email Response Generator</Link> — Email replies.</li>
              <li><Link href="/tools/ai-letter-generator" className="text-[#1a6aff] hover:underline">AI Letter Generator</Link> — Letters and notes.</li>
              <li><Link href="/tools/ai-blog-title-generator" className="text-[#1a6aff] hover:underline">AI Blog Title Generator</Link> — Blog titles.</li>
              <li><Link href="/tools/ai-chatbot-name-generator" className="text-[#1a6aff] hover:underline">AI Chatbot Name Generator</Link> — Names for chatbots.</li>
              <li><Link href="/tools/ai-saas-brand-name-generator" className="text-[#1a6aff] hover:underline">AI SaaS Brand Name Generator</Link> — SaaS brand names.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">AI chat with your data</h3>
            <p className="mt-2 text-slate-600">
              Paste or upload content, then ask questions. Answers are based only on your provided data.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><Link href="/tools/ai-chat-text" className="text-[#1a6aff] hover:underline">AI Chat with Text</Link> — Paste text and chat.</li>
              <li><Link href="/tools/ai-chat-website" className="text-[#1a6aff] hover:underline">AI Chat with Website</Link> — Enter URL and ask about the page.</li>
              <li><Link href="/tools/ai-chat-document" className="text-[#1a6aff] hover:underline">AI Chat with Document</Link> — Upload/paste documents and chat.</li>
              <li><Link href="/tools/ai-chat-pdf" className="text-[#1a6aff] hover:underline">AI Chat with PDF</Link> — Upload PDF and ask questions.</li>
              <li><Link href="/tools/ai-chat-word" className="text-[#1a6aff] hover:underline">AI Chat with Word</Link> — Upload Word doc and chat.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">SEO &amp; utilities</h3>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><Link href="/tools/ai-chatbot-conversation-analysis" className="text-[#1a6aff] hover:underline">AI Chatbot Conversation Analysis</Link> — Analyze conversations for gaps.</li>
              <li><Link href="/tools/sitemap-finder-checker" className="text-[#1a6aff] hover:underline">Sitemap Finder &amp; Checker</Link> — Find and check sitemaps.</li>
              <li><Link href="/tools/sitemap-validator" className="text-[#1a6aff] hover:underline">Sitemap Validator</Link> — Validate XML sitemaps.</li>
              <li><Link href="/tools/xml-sitemap-generator" className="text-[#1a6aff] hover:underline">XML Sitemap Generator</Link> — Generate sitemap.xml from a URL.</li>
              <li><Link href="/tools/sitemap-url-extractor" className="text-[#1a6aff] hover:underline">Sitemap URL Extractor</Link> — Extract URLs from a sitemap.</li>
              <li><Link href="/tools/website-url-extractor" className="text-[#1a6aff] hover:underline">Website URL Extractor</Link> — Crawl and extract URLs.</li>
              <li><Link href="/tools/chatbot-roi-calculator" className="text-[#1a6aff] hover:underline">Chatbot ROI Calculator</Link> — Estimate chatbot savings.</li>
              <li><Link href="/tools/email-signature-generator" className="text-[#1a6aff] hover:underline">Email Signature Generator</Link> — Create email signatures.</li>
              <li><Link href="/tools/sourcesync" className="text-[#1a6aff] hover:underline">SourceSync.ai</Link> — Sync content sources.</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Convert to Markdown</h3>
            <p className="mt-2 text-slate-600">
              Convert various formats to Markdown. Paste content or enter a URL/file as indicated on each tool.
            </p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><Link href="/tools/convert-pdf-to-markdown" className="text-[#1a6aff] hover:underline">PDF to Markdown</Link></li>
              <li><Link href="/tools/convert-docx-to-markdown" className="text-[#1a6aff] hover:underline">DOCX to Markdown</Link></li>
              <li><Link href="/tools/convert-html-to-markdown" className="text-[#1a6aff] hover:underline">HTML to Markdown</Link></li>
              <li><Link href="/tools/convert-notion-to-markdown" className="text-[#1a6aff] hover:underline">Notion to Markdown</Link></li>
              <li><Link href="/tools/convert-google-docs-to-markdown" className="text-[#1a6aff] hover:underline">Google Docs to Markdown</Link></li>
              <li><Link href="/tools/convert-xml-to-markdown" className="text-[#1a6aff] hover:underline">XML to Markdown</Link></li>
              <li><Link href="/tools/convert-csv-to-markdown" className="text-[#1a6aff] hover:underline">CSV to Markdown</Link></li>
              <li><Link href="/tools/convert-json-to-markdown" className="text-[#1a6aff] hover:underline">JSON to Markdown</Link></li>
              <li><Link href="/tools/convert-rtf-to-markdown" className="text-[#1a6aff] hover:underline">RTF to Markdown</Link></li>
              <li><Link href="/tools/convert-paste-to-markdown" className="text-[#1a6aff] hover:underline">Paste to Markdown</Link></li>
              <li><Link href="/tools/convert-webpage-to-markdown" className="text-[#1a6aff] hover:underline">Webpage to Markdown</Link></li>
            </ul>
          </section>

          {/* API */}
          <section id="api" className="mt-12 scroll-mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">API &amp; webhooks</h2>
            <p className="mt-2 text-slate-600">
              For full request/response formats, authentication, rate limits, and webhook payloads, see the dedicated API docs:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-600">
              <li><strong>Chat API</strong> — Send messages and get bot replies (API key or bot key).</li>
              <li><strong>Embed info</strong> — Get greeting and quick prompts for the widget (no API key).</li>
              <li><strong>Webhooks</strong> — Events (lead.captured, chat.message), payloads, and signature verification.</li>
              <li><strong>Errors and rate limits</strong> — Status codes and throttling.
            </ul>
            <div className="mt-6">
              <Link
                href="/docs/api"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1a6aff] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0d5aeb]"
              >
                Open API Documentation
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </section>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-200 pt-8">
            <Link
              href="/docs/api"
              className="rounded-lg bg-[#1a6aff] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0d5aeb]"
            >
              API Reference
            </Link>
            <Link
              href="/dashboard"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Dashboard
            </Link>
            <Link
              href="/tools"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Free tools
            </Link>
            <Link
              href="/contact"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Contact
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
