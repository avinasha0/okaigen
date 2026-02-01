import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main id="main-content" className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 shadow-sm sm:p-12">
          <p className="text-6xl font-bold text-slate-200 sm:text-8xl">404</p>
          <h1 className="mt-4 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Page not found
          </h1>
          <p className="mt-2 text-slate-600">
            The page you’re looking for doesn’t exist or has been moved.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-[#1a6aff] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb]"
            >
              Back to home
            </Link>
            <Link
              href="/docs"
              className="inline-flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 transition-colors hover:border-[#1a6aff] hover:text-[#1a6aff]"
            >
              Documentation
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
