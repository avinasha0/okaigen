"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveNav } from "@/components/responsive-nav";
import { useCaptcha } from "@/hooks/use-captcha";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const getCaptchaToken = useCaptcha();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() })});
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      setSuccess(true);
    } catch {
      setError("Something went wrong");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <div className="flex min-h-[calc(100vh-4rem)]">
        <div className="hidden min-h-screen w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-12 lg:flex">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1a6aff]">
              <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="text-xl font-semibold text-white">SiteBotGPT</span>
          </Link>
          <div>
            <h2 className="text-3xl font-bold leading-tight text-white">
              Reset your password
            </h2>
            <p className="mt-6 max-w-md text-slate-400">
              Enter the email you use to sign in. We&apos;ll send you a link to set a new password.
            </p>
          </div>
          <p className="text-sm text-slate-500">© SiteBotGPT. Enterprise-grade AI chatbots.</p>
        </div>

        <div className="flex w-full flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Forgot password?
            </h1>
            <p className="mt-2 text-slate-600">
              Enter your email and we&apos;ll send you a link to reset your password.
            </p>

            <div className="mt-8 space-y-6">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Check your email for a reset link. It may take a few minutes. If you don&apos;t see it, check your spam folder.
                </div>
              )}

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-slate-700">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@company.com"
                      className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#1a6aff] focus:ring-[#1a6aff]/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-[#1a6aff] text-base font-semibold shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb] disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              ) : (
                <Link href="/login" className="inline-block">
                  <Button variant="outline" className="h-12 rounded-xl border-slate-200 font-medium hover:bg-slate-50">
                    Back to sign in
                  </Button>
                </Link>
              )}
            </div>

            <p className="mt-8 text-center text-sm text-slate-600">
              <Link href="/login" className="font-semibold text-[#1a6aff] hover:text-[#0d5aeb] hover:underline">
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
