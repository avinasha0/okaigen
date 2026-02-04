"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ResponsiveNav } from "@/components/responsive-nav";

function VerifyEmailForm() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  async function handleResend() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: "success", text: "Verification email sent! Check your inbox." });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to send verification email" });
      }
    } catch {
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <div className="flex min-h-[calc(100vh-4rem)]">
        {/* Left: Branding panel */}
        <div className="relative hidden min-h-screen w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 lg:flex">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
          <Link href="/" className="relative z-10 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a6aff] shadow-lg shadow-[#1a6aff]/25">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">SiteBotGPT</span>
          </Link>
          <div className="relative z-10">
            <h2 className="text-3xl font-bold leading-tight text-white xl:text-4xl">
              You&apos;re almost there
            </h2>
            <p className="mt-4 text-2xl font-medium text-slate-300 xl:text-3xl">
              <span className="bg-gradient-to-r from-[#1a6aff] to-blue-400 bg-clip-text text-transparent">Verify your email</span>
              <br />
              and unlock your dashboard
            </p>
            <p className="mt-6 max-w-sm text-slate-400 leading-relaxed">
              We sent a secure link to your inbox. One click and you&apos;re in—no password needed for this step.
            </p>
            <ul className="mt-8 space-y-3 text-sm text-slate-400">
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[#1a6aff]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                Check your inbox (and spam folder)
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[#1a6aff]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                Click the verification link
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10 text-[#1a6aff]">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                </span>
                Start building your AI chatbot
              </li>
            </ul>
          </div>
          <p className="relative z-10 text-sm text-slate-500">© SiteBotGPT. Enterprise-grade AI chatbots.</p>
        </div>

        {/* Right: Content */}
        <div id="main-content" className="flex w-full flex-col justify-center px-4 py-10 sm:px-6 sm:py-14 lg:w-1/2 lg:px-12 xl:px-16" tabIndex={-1}>
          <div className="mx-auto w-full max-w-md">
            {/* Hero icon with subtle animation */}
            <div className="mb-8 flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse rounded-2xl bg-[#1a6aff]/10 blur-xl" aria-hidden />
                <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1a6aff] to-blue-600 shadow-lg shadow-[#1a6aff]/25 ring-4 ring-[#1a6aff]/10">
                  <svg className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <h1 className="text-center text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Check your email</h1>
            <p className="mt-3 text-center text-slate-600 leading-relaxed">
              We&apos;ve sent a verification link to your email. Click it to activate your account and get full access to your dashboard.
            </p>

            {/* Step indicator */}
            <div className="mt-8 flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50/80 py-3 px-4">
              <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500" aria-hidden />
              <span className="text-sm font-medium text-slate-700">Step 1 of 2: Verify your email</span>
            </div>

            <div className="mt-8 space-y-5">
              {message && (
                <div
                  className={`rounded-xl border px-4 py-3 text-sm font-medium ${
                    message.type === "success"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-rose-200 bg-rose-50 text-rose-800"
                  }`}
                  role="alert"
                >
                  {message.text}
                </div>
              )}

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm ring-1 ring-slate-900/5">
                <h3 className="text-sm font-semibold text-slate-900">Didn&apos;t get the email?</h3>
                <p className="mt-1.5 text-sm text-slate-600">
                  Check spam or promotions, then try resending. Links expire in 24 hours.
                </p>
                <Button
                  type="button"
                  className="mt-4 w-full rounded-xl bg-[#1a6aff] font-semibold text-white shadow-md hover:bg-[#0d5aeb]"
                  onClick={handleResend}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Sending...
                    </span>
                  ) : (
                    "Resend verification email"
                  )}
                </Button>
              </div>

              <div className="flex items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/50 px-4 py-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#1a6aff]/10 text-[#1a6aff]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                </span>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">Why we verify</h3>
                  <p className="mt-0.5 text-sm text-slate-600">
                    Keeps your account secure and ensures you can recover access. You&apos;ll get full dashboard access right after.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              Already verified?{" "}
              <Link href="/login" className="font-semibold text-[#1a6aff] hover:text-[#0d5aeb] hover:underline focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/50 focus:ring-offset-2 rounded">
                Sign in to your account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a6aff] border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailForm />
    </Suspense>
  );
}
