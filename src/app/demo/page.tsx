import Link from "next/link";
import { DemoWidget } from "@/components/demo-widget";
import { DemoSuggestedQuestions } from "@/components/demo-suggested-questions";
import { ResponsiveNav } from "@/components/responsive-nav";

const DEMO_BOT_ID = process.env.NEXT_PUBLIC_DEMO_BOT_ID;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "";

const SUGGESTED_QUESTIONS = [
  "What do you offer?",
  "How can I contact you?",
  "How does the chatbot work?",
  "How do I embed it on my site?",
  "Is there a free tier?",
];

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(135deg,#0f172a_0%,#1e293b_50%,#0f172a_100%)]" />
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#1a6aff]/20 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl" />
          <div className="mx-auto max-w-5xl px-4 py-16 sm:py-20 lg:py-24">
            <div className="text-center">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1a6aff]/40 bg-[#1a6aff]/10 px-4 py-2 text-sm font-medium text-blue-200">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                Live demo
              </div>
              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Try{" "}
                <span className="bg-gradient-to-r from-blue-400 to-violet-400 bg-clip-text text-transparent">
                  SiteBotGPT
                </span>{" "}
                in action
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
                Ask anything about SiteBotGPT—features, pricing, embedding, or how it works.
                The bot is trained on our site and responds in real time.
              </p>
            </div>
          </div>
        </section>

        {/* Demo area */}
        <section className="relative -mt-8 px-4 pb-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            {DEMO_BOT_ID && APP_URL ? (
              <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-2xl shadow-slate-900/10 ring-1 ring-slate-900/5">
                {/* Chat preview header */}
                <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-[#1a6aff] to-[#0d5aeb] px-6 py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 backdrop-blur">
                    <svg
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-semibold text-white">SiteBotGPT Assistant</p>
                    <p className="text-sm text-blue-100">Typically replies instantly</p>
                  </div>
                  <div className="ml-auto flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    Online
                  </div>
                </div>

                {/* Suggested questions — click sends into widget bubble */}
                <div className="border-b border-slate-100 bg-slate-50/80 px-6 py-5">
                  <p className="mb-3 text-sm font-medium text-slate-600">
                    Click to ask, or type your own in the chat bubble:
                  </p>
                  <DemoSuggestedQuestions botId={DEMO_BOT_ID} questions={SUGGESTED_QUESTIONS} />
                </div>

                {/* Chat placeholder + widget hint */}
                <div className="relative min-h-[340px] bg-gradient-to-b from-white to-slate-50/50 p-6">
                  <div className="mx-auto max-w-2xl">
                    <div className="flex justify-start">
                      <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-[#1a6aff]/10 px-5 py-4 text-slate-800">
                        <p className="font-medium text-slate-900">Hi! How can I help you today?</p>
                        <p className="mt-1 text-sm text-slate-600">
                          I&apos;m the SiteBotGPT demo bot. Ask me about AI chatbots, training, embedding,
                          or anything on this site.
                        </p>
                      </div>
                    </div>
                    <div className="mt-6 flex flex-col items-center gap-4 rounded-2xl border-2 border-dashed border-slate-200 bg-white/80 py-12">
                      <p className="text-center text-slate-500">
                        Open the chat bubble in the bottom-right corner to start
                      </p>
                      <div className="flex items-center gap-2 text-[#1a6aff]">
                        <span className="rounded-full bg-[#1a6aff]/10 p-2">
                          <svg
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                            />
                          </svg>
                        </span>
                        <span className="text-sm font-semibold">Click the bubble →</span>
                      </div>
                    </div>
                  </div>
                </div>

                <DemoWidget botId={DEMO_BOT_ID} baseUrl={APP_URL} />
              </div>
            ) : (
              <div className="overflow-hidden rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50/80 p-16 text-center">
                <div className="mx-auto max-w-lg">
                  <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-200/80">
                    <svg
                      className="h-10 w-10 text-slate-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={1.5}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">Demo not available</h3>
                  <p className="mt-2 text-slate-600">
                    This page needs a demo bot to be configured. In production, set{" "}
                    <code className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-sm">NEXT_PUBLIC_DEMO_BOT_ID</code>{" "}
                    (and optionally <code className="rounded bg-slate-200/80 px-1.5 py-0.5 font-mono text-sm">NEXT_PUBLIC_APP_URL</code>) in your environment, then create and train a bot and use its ID so visitors can try the chatbot here.
                  </p>
                  <p className="mt-4 text-sm text-slate-500">
                    Don&apos;t have an account yet? Create one, add a bot, train it on your content, and use its ID as the demo bot.
                  </p>
                  <Link
                    href="/signup"
                    className="mt-8 inline-flex rounded-xl bg-[#1a6aff] px-8 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] hover:shadow-[#1a6aff]/30"
                  >
                    Create free account
                  </Link>
                </div>
              </div>
            )}

            {/* CTA strip */}
            <div className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center sm:gap-6">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-slate-800"
              >
                Create your own bot
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 rounded-xl border-2 border-slate-200 px-8 py-3.5 text-base font-semibold text-slate-700 transition-all hover:border-[#1a6aff] hover:text-[#1a6aff]"
              >
                View pricing
              </Link>
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className="border-t border-slate-200 bg-slate-50/50 px-4 py-16 sm:py-20">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-2xl font-bold text-slate-900 sm:text-3xl">
              What you just experienced
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-center text-slate-600">
              Real AI, trained on real content. No smoke and mirrors.
            </p>
            <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  title: "Trained on our site",
                  desc: "The bot answers from our actual content, not generic knowledge.",
                  icon: "📚"},
                {
                  title: "Instant responses",
                  desc: "No waiting. Answers stream in as soon as you hit send.",
                  icon: "⚡"},
                {
                  title: "Your content, your way",
                  desc: "Add your website or docs. Your bot, your brand.",
                  icon: "✨"},
              ].map((f) => (
                <div
                  key={f.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
                >
                  <span className="text-2xl">{f.icon}</span>
                  <h3 className="mt-3 font-semibold text-slate-900">{f.title}</h3>
                  <p className="mt-1 text-sm text-slate-600">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
