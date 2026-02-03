"use client";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ResponsiveNav } from "@/components/responsive-nav";
import { useRecaptcha } from "@/hooks/use-recaptcha";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { getToken } = useRecaptcha();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";
  const verified = searchParams.get("verified") === "1";
  const errorParam = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(errorParam === "invalid-or-expired" ? "Verification link expired or invalid. You can request a new one after signing up again or contact support." : errorParam === "missing-token" ? "Missing verification token." : "");
  const [loading, setLoading] = useState(false);

  // Prefetch dashboard so redirect after login is faster
  useEffect(() => {
    router.prefetch(callbackUrl);
  }, [callbackUrl, router]);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleCredentials(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError("Please enter your email");
      return;
    }
    if (!emailRegex.test(trimmedEmail)) {
      setError("Please enter a valid email address");
      return;
    }
    if (!password) {
      setError("Please enter your password");
      return;
    }
    setLoading(true);
    try {
      const recaptchaToken = await getToken("login");
      const res = await signIn("credentials", {
        email: trimmedEmail,
        password,
        recaptchaToken: recaptchaToken || undefined,
        redirect: false,
      });
      if (res?.error) {
        setError("Invalid email or password");
        setLoading(false);
        return;
      }
      router.replace(callbackUrl);
      router.refresh();
    } catch {
      setError("Something went wrong");
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setError("");
    await signIn("google", { callbackUrl });
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
            AI-powered customer support,
            <br />
            <span className="bg-gradient-to-r from-[#1a6aff] to-blue-400 bg-clip-text text-transparent">
              built for scale
            </span>
          </h2>
          <p className="mt-6 max-w-md text-slate-400">
            Join teams using SiteBotGPT to automate support, capture leads, and deliver instant answers
            from your own content.
          </p>
          <ul className="mt-10 space-y-4">
            {["Train on your website & docs", "One-line embed", "Analytics & chat history"].map(
              (item) => (
                <li key={item} className="flex items-center gap-3 text-slate-300">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1a6aff]/20 text-[#1a6aff]">
                    <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
        <p className="text-sm text-slate-500">© SiteBotGPT. Enterprise-grade AI chatbots.</p>
      </div>

      {/* Right: Form */}
      <div id="main-content" className="flex w-full flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:w-1/2 lg:px-12 xl:px-16" tabIndex={-1}>
        <div className="mx-auto w-full max-w-md">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Welcome back</h1>
          <p className="mt-2 text-slate-600">Sign in to your account to continue</p>

          <div className="mt-8 space-y-6">
            {verified && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                Email verified. You can sign in now.
              </div>
            )}
            {error && (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                {error}
              </div>
            )}

            <form onSubmit={handleCredentials} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
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
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-slate-700">
                    Password
                  </Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm font-medium text-[#1a6aff] hover:text-[#0d5aeb] hover:underline"
                  >
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 rounded-xl border-slate-200 bg-white focus:border-[#1a6aff] focus:ring-[#1a6aff]/20"
                />
              </div>
              <Button
                type="submit"
                className="h-12 w-full rounded-xl bg-[#1a6aff] text-base font-semibold shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb] disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-4 text-sm text-slate-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-12 w-full rounded-xl border-slate-200 bg-white font-medium hover:bg-slate-50 hover:border-slate-300"
              onClick={handleGoogle}
            >
              <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign in with Google
            </Button>
          </div>

          <p className="mt-8 text-center text-sm text-slate-600">
            Don&apos;t have an account?{" "}
            <Link
              href={callbackUrl ? `/signup?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/signup"}
              className="font-semibold text-[#1a6aff] hover:text-[#0d5aeb] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-50">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#1a6aff] border-t-transparent" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
