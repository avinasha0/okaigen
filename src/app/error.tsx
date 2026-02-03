"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ResponsiveNav } from "@/components/responsive-nav";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App error:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main id="main-content" className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center sm:px-6">
        <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-8 shadow-sm sm:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="mt-4 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            Something went wrong
          </h1>
          <p className="mt-2 text-slate-600">
            An unexpected error occurred. You can try again or return home.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center sm:gap-4">
            <Button
              onClick={reset}
              className="rounded-xl bg-[#1a6aff] px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb]"
            >
              Try again
            </Button>
            <Link href="/">
              <Button
                variant="outline"
                className="w-full rounded-xl border-2 border-slate-200 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:border-[#1a6aff] hover:text-[#1a6aff] sm:w-auto"
              >
                Back to home
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
