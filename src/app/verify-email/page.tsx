"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ResponsiveNav } from "@/components/responsive-nav";

function VerifyEmailForm() {
  const router = useRouter();
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
        <div className="hidden min-h-screen w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a6aff]">
              <svg
                className="h-5 w-5 text-white"
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
            <span className="text-xl font-semibold text-white">SiteBotGPT</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Verify your email
              <br />
              <span className="bg-gradient-to-r from-[#1a6aff] to-blue-400 bg-clip-text text-transparent">
                to get started
              </span>
            </h2>
            <p className="mt-6 max-w-md text-slate-400">
              We&apos;ve sent a verification link to your email address. Click the link in the email to verify your account and access your dashboard.
            </p>
          </div>
          <p className="text-sm text-slate-500">© SiteBotGPT. Enterprise-grade AI chatbots.</p>
        </div>

        {/* Right: Content */}
        <div id="main-content" className="flex w-full flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2 lg:px-12 xl:px-16" tabIndex={-1}>
          <div className="mx-auto w-full max-w-md">
            <div className="mb-8 flex items-center justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100">
                <svg className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Check your email</h1>
            <p className="mt-2 text-slate-600">
              We&apos;ve sent a verification link to your email address. Please check your inbox and click the link to verify your account.
            </p>

            <div className="mt-8 space-y-6">
              {message && (
                <div className={`rounded-xl border px-4 py-3 text-sm ${
                  message.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }`}>
                  {message.text}
                </div>
              )}

              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-4">
                <h3 className="text-sm font-semibold text-slate-900">Didn&apos;t receive the email?</h3>
                <p className="mt-1 text-sm text-slate-600">
                  Check your spam folder or click below to resend the verification email.
                </p>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4 w-full rounded-xl border-slate-200 bg-white font-medium hover:bg-slate-50 hover:border-slate-300"
                  onClick={handleResend}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Resend verification email"}
                </Button>
              </div>

              <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-4">
                <h3 className="text-sm font-semibold text-blue-900">Why verify your email?</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Email verification helps us ensure account security and allows you to access all features of your dashboard.
                </p>
              </div>
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              Already verified?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#1a6aff] hover:text-[#0d5aeb] hover:underline"
              >
                Sign in
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
