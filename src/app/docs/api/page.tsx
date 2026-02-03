import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";

export default function ApiDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            API Documentation
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Use the SiteBotGPT API to send messages to your chatbot from your app, backend, or scripts.
            API access is available on <strong>Scale</strong> and <strong>Enterprise</strong> plans.
          </p>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900">Authentication</h2>
            <p className="mt-2 text-slate-600">
              For programmatic access, create an API key in{" "}
              <Link href="/dashboard/api" className="text-[#1a6aff] hover:underline">
                Dashboard → API
              </Link>
              . Send it in one of these ways:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6 text-slate-600">
              <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">Authorization: Bearer YOUR_API_KEY</code></li>
              <li><code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">x-api-key: YOUR_API_KEY</code></li>
            </ul>
            <p className="mt-3 text-sm text-slate-500">
              For the embed widget, use the bot&apos;s public key (<code className="rounded bg-slate-100 px-1 py-0.5">x-bot-key</code> or <code className="rounded bg-slate-100 px-1 py-0.5">x-atlas-key</code>) from your embed code. No API key required for widget usage.
            </p>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900">Chat API</h2>
            <p className="mt-2 text-slate-600">
              Send a user message and receive the bot&apos;s reply. Conversations are tracked by <code className="rounded bg-slate-100 px-1 py-0.5">chatId</code>.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Endpoint</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              POST {BASE_URL}/api/chat
            </pre>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Headers</h3>
            <table className="mt-2 min-w-full border border-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Header</th>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Required</th>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">Content-Type</td>
                  <td className="border-b border-slate-100 px-4 py-2">Yes</td>
                  <td className="border-b border-slate-100 px-4 py-2">application/json</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">Authorization / x-api-key</td>
                  <td className="border-b border-slate-100 px-4 py-2">For API access</td>
                  <td className="border-b border-slate-100 px-4 py-2">API key (Scale/Enterprise)</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">x-bot-key / x-atlas-key</td>
                  <td className="border-b border-slate-100 px-4 py-2">Widget</td>
                  <td className="border-b border-slate-100 px-4 py-2">Bot public key (atlas_...)</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">x-visitor-id</td>
                  <td className="border-b border-slate-100 px-4 py-2">No</td>
                  <td className="border-b border-slate-100 px-4 py-2">Anonymous visitor ID for session</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Request body</h3>
            <table className="mt-2 min-w-full border border-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Field</th>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Type</th>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Description</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">message</td>
                  <td className="border-b border-slate-100 px-4 py-2">string</td>
                  <td className="border-b border-slate-100 px-4 py-2">Required. User message (max 4000 chars).</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">botId</td>
                  <td className="border-b border-slate-100 px-4 py-2">string</td>
                  <td className="border-b border-slate-100 px-4 py-2">Required when using API key. Bot ID or public key (atlas_...).</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">chatId</td>
                  <td className="border-b border-slate-100 px-4 py-2">string</td>
                  <td className="border-b border-slate-100 px-4 py-2">Optional. Continue an existing conversation.</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">history</td>
                  <td className="border-b border-slate-100 px-4 py-2">array</td>
                  <td className="border-b border-slate-100 px-4 py-2">Optional. Previous messages &#123; role, content &#125; for context.</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Response (200)</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
{`{
  "response": "The bot's reply text",
  "sources": ["url1", "url2"],
  "chatId": "clx...",
  "confidence": 0.92,
  "shouldCaptureLead": false
}`}
            </pre>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Example: cURL (API key)</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-sm text-slate-100">
{`curl -X POST ${BASE_URL}/api/chat \\
  -H "Authorization: Bearer sk_live_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"botId": "YOUR_BOT_ID", "message": "What are your opening hours?"}'`}
            </pre>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Example: JavaScript (fetch)</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-sm text-slate-100">
{`const res = await fetch("${BASE_URL}/api/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer sk_live_YOUR_API_KEY",
    "Content-Type": "application/json"},
  body: JSON.stringify({
    botId: "YOUR_BOT_ID",
    message: "What are your opening hours?",
    chatId: "optional-existing-chat-id"})});
const data = await res.json();
console.log(data.response);`}
            </pre>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900">Embed info (widget)</h2>
            <p className="mt-2 text-slate-600">
              Fetch greeting and quick prompts for a bot. Used by the chat widget; no API key required.
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
              GET {BASE_URL}/api/embed/info?botId=atlas_xxxx
            </pre>
            <p className="mt-2 text-sm text-slate-600">Response: <code className="rounded bg-slate-100 px-1 py-0.5">&#123; greeting, quickPrompts &#125;</code></p>
          </section>

          <section id="webhooks" className="mt-12 scroll-mt-8">
            <h2 className="text-2xl font-semibold text-slate-900">Webhooks</h2>
            <p className="mt-2 text-slate-600">
              Receive HTTP POST requests at your endpoint when events occur. Available on <strong>Scale</strong> and <strong>Enterprise</strong> plans. Create webhooks in{" "}
              <Link href="/dashboard/webhooks" className="text-[#1a6aff] hover:underline">Dashboard → Webhooks</Link>.
            </p>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Events</h3>
            <table className="mt-2 min-w-full border border-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Event</th>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">When</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">lead.captured</td>
                  <td className="border-b border-slate-100 px-4 py-2">A visitor submits their contact (name, email, etc.) via the chat widget.</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2 font-mono text-xs">chat.message</td>
                  <td className="border-b border-slate-100 px-4 py-2">A chat turn completes (user message + assistant reply).</td>
                </tr>
              </tbody>
            </table>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Request</h3>
            <p className="mt-2 text-slate-600">We send a POST to your URL with:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-slate-600">
              <li><code className="rounded bg-slate-100 px-1 py-0.5">Content-Type: application/json</code></li>
              <li><code className="rounded bg-slate-100 px-1 py-0.5">X-Webhook-Signature: sha256=&lt;hex&gt;</code> — HMAC-SHA256 of the raw body using your signing secret</li>
              <li><code className="rounded bg-slate-100 px-1 py-0.5">X-Webhook-Event: &lt;event&gt;</code> — e.g. lead.captured, chat.message</li>
            </ul>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Payload: lead.captured</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
{`{
  "event": "lead.captured",
  "botId": "clx...",
  "lead": {
    "id": "clx...",
    "name": "Jane",
    "email": "jane@example.com",
    "phone": "+1...",
    "message": "I need help with...",
    "pageUrl": "https://...",
    "status": "new",
    "createdAt": "2025-01-01T12:00:00.000Z"
  }
}`}
            </pre>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Payload: chat.message</h3>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
{`{
  "event": "chat.message",
  "botId": "clx...",
  "chatId": "clx...",
  "userMessage": "What are your hours?",
  "assistantResponse": "We're open 9am–5pm...",
  "sources": ["https://..."],
  "confidence": 0.92
}`}
            </pre>

            <h3 className="mt-6 text-lg font-semibold text-slate-800">Verifying the signature</h3>
            <p className="mt-2 text-slate-600">
              Compute <code className="rounded bg-slate-100 px-1 py-0.5">HMAC-SHA256(secret, rawRequestBody)</code> and compare with the <code className="rounded bg-slate-100 px-1 py-0.5">X-Webhook-Signature</code> value (after <code className="rounded bg-slate-100 px-1 py-0.5">sha256=</code>). Return 200 quickly to acknowledge receipt; process asynchronously if needed.
            </p>
            <pre className="mt-2 overflow-x-auto rounded-lg border border-slate-200 bg-slate-900 p-4 text-sm text-slate-100">
{`// Node.js example
const crypto = require("crypto");
const signature = req.headers["x-webhook-signature"]; // "sha256=abc123..."
const expected = "sha256=" + crypto.createHmac("sha256", process.env.WEBHOOK_SECRET).update(rawBody).digest("hex");
if (signature !== expected) return res.status(401).send("Invalid signature");`}
            </pre>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900">Errors</h2>
            <table className="mt-2 min-w-full border border-slate-200 text-left text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Status</th>
                  <th className="border-b border-slate-200 px-4 py-2 font-medium text-slate-700">Meaning</th>
                </tr>
              </thead>
              <tbody className="text-slate-600">
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2">400</td>
                  <td className="border-b border-slate-100 px-4 py-2">Bad request (e.g. missing message, bot not found)</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2">401</td>
                  <td className="border-b border-slate-100 px-4 py-2">Invalid API key or plan does not include API access</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2">402</td>
                  <td className="border-b border-slate-100 px-4 py-2">Daily message limit reached (upgrade plan)</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2">429</td>
                  <td className="border-b border-slate-100 px-4 py-2">Rate limit exceeded (30 req/min per bot/visitor)</td>
                </tr>
                <tr>
                  <td className="border-b border-slate-100 px-4 py-2">500</td>
                  <td className="border-b border-slate-100 px-4 py-2">Server error</td>
                </tr>
              </tbody>
            </table>
          </section>

          <section className="mt-12">
            <h2 className="text-2xl font-semibold text-slate-900">Rate limits</h2>
            <p className="mt-2 text-slate-600">
              Chat API: 30 requests per minute per bot/visitor (or per API key + visitor). Message limits per day depend on your plan (see{" "}
              <Link href="/pricing" className="text-[#1a6aff] hover:underline">Pricing</Link>).
            </p>
          </section>

          <div className="mt-12 flex flex-wrap gap-4 border-t border-slate-200 pt-8">
            <Link
              href="/dashboard/api"
              className="rounded-lg bg-[#1a6aff] px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-[#0d5aeb]"
            >
              Create API key
            </Link>
            <Link
              href="/dashboard/webhooks"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              Webhooks
            </Link>
            <Link
              href="/pricing"
              className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              View plans
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
