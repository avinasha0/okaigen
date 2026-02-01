import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function IntegrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main className="mx-auto max-w-3xl px-4 py-20 sm:px-6 sm:py-28 lg:py-32">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500" />
            </span>
            In development
          </div>
          <h1 className="font-heading mt-6 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Integrations
          </h1>
          <p className="mt-4 text-xl text-slate-600">
            Coming soon
          </p>
          <p className="mt-3 max-w-lg mx-auto text-slate-500">
            Connect SiteBotGPT with your CRM, help desk, and other tools. We&apos;re building integrations to make your workflow seamless.
          </p>
          <div className="mt-10">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
            >
              Back to home
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
