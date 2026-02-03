"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveNav } from "@/components/responsive-nav";
import { useCaptcha } from "@/hooks/use-captcha";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset link. Please request a new one from the forgot password page.");
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    setLoading(true);
    try {
      const recaptchaToken = await getCaptchaToken("reset-password");
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          token, 
          password,
          recaptchaToken,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }
      setSuccess(true);
      setTimeout(() => router.push("/login"), 2000);
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
            <h2 className="text-3xl font-bold leading-tight text-white">Set a new password</h2>
            <p className="mt-6 max-w-md text-slate-400">
              Choose a strong password you don&apos;t use elsewhere. You&apos;ll sign in with it from now on.
            </p>
          </div>
          <p className="text-sm text-slate-500">© SiteBotGPT. Enterprise-grade AI chatbots.</p>
        </div>

        <div className="flex w-full flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2 lg:px-12 xl:px-16">
          <div className="mx-auto w-full max-w-md">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Set new password
            </h1>
            <p className="mt-2 text-slate-600">
              Enter your new password below.
            </p>

            <div className="mt-8 space-y-6">
              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  Password updated. Redirecting you to sign in...
                </div>
              )}

              {!token ? (
                <p className="text-slate-600">
                  <Link href="/forgot-password" className="font-semibold text-[#1a6aff] hover:underline">
                    Request a new reset link
                  </Link>
                </p>
              ) : !success ? (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-slate-700">New password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                      placeholder="At least 8 characters"
                      className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#1a6aff] focus:ring-[#1a6aff]/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm" className="text-slate-700">Confirm password</Label>
                    <Input
                      id="confirm"
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      minLength={8}
                      placeholder="Same as above"
                      className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#1a6aff] focus:ring-[#1a6aff]/20"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="h-12 w-full rounded-xl bg-[#1a6aff] text-base font-semibold shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb] disabled:opacity-50"
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Update password"}
                  </Button>
                </form>
              ) : null}
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a6aff] border-t-transparent" />
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
