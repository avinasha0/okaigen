"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ResponsiveNav } from "@/components/responsive-nav";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReCaptcha } from "@/components/recaptcha";

export default function ContactPage() {
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  useEffect(() => {
    const sub = searchParams.get("subject");
    if (sub) setSubject(decodeURIComponent(sub));
  }, [searchParams]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          recaptchaToken: recaptchaToken || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmittedEmail(email);
      setSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <ResponsiveNav />
      <main id="main-content" className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8" tabIndex={-1}>
        <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-6 shadow-sm sm:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Contact us
            </h1>
            <p className="mt-3 text-slate-600">
              Have a question or feedback? Fill out the form below. Your message is saved and emailed to our team; we&apos;ll reply to your email.
            </p>
          </div>

          {submitted ? (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="mt-4 text-lg font-semibold text-emerald-900">Message sent</h2>
              <p className="mt-2 text-sm text-emerald-700">
                Thanks for reaching out. We&apos;ll reply to <strong>{submittedEmail}</strong> shortly.
              </p>
              <Button
                variant="outline"
                className="mt-6"
                onClick={() => setSubmitted(false)}
              >
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                  {error}
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    maxLength={255}
                    className="rounded-lg border-slate-200 bg-white"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-email">Email</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-lg border-slate-200 bg-white"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-subject">Subject</Label>
                <Input
                  id="contact-subject"
                  type="text"
                  placeholder="What is this about?"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  required
                  maxLength={500}
                  className="rounded-lg border-slate-200 bg-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-message">Message</Label>
                <textarea
                  id="contact-message"
                  rows={5}
                  placeholder="Your message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  minLength={10}
                  maxLength={10000}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
                />
                <p className="text-xs text-slate-500">At least 10 characters. Max 10,000.</p>
              </div>
              <div className="flex justify-center">
                <ReCaptcha onChange={setRecaptchaToken} />
              </div>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-[#1a6aff] px-6 py-2.5 font-semibold text-white shadow-md shadow-[#1a6aff]/25 hover:bg-[#0d5aeb] disabled:opacity-60"
                >
                  {submitting ? "Sending..." : "Send message"}
                </Button>
                <Link
                  href="/"
                  className="text-sm text-slate-600 underline-offset-2 hover:text-[#1a6aff] hover:underline"
                >
                  Back to home
                </Link>
              </div>
            </form>
          )}
        </div>
        <p className="mt-8 text-center text-sm text-slate-500">
          You can also email us at{" "}
          <a href="mailto:support@sitebotgpt.com" className="text-[#1a6aff] hover:underline">
            support@sitebotgpt.com
          </a>
        </p>
      </main>
    </div>
  );
}
