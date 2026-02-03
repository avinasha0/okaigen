"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ReCaptcha } from "@/components/recaptcha";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function generateTicketNumber(): string {
  const date = new Date();
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TKT-${yyyy}${mm}${dd}-${random}`;
}

export function SupportRequestForm() {
  const [open, setOpen] = useState(false);
  const [ticketNumber] = useState(() => generateTicketNumber());
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const subject = "Support request";

  const handleOpen = useCallback(() => {
    setOpen(true);
    setSubmitted(false);
    setError("");
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: (name && name.trim()) || "Support User",
          email: email.trim(),
          subject: `${subject} [${ticketNumber}]`,
          message: `Ticket: ${ticketNumber}\n\n${(message.trim() || "No additional message.").slice(0, 10000)}`,
          recaptchaToken: recaptchaToken || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <Card className="border-zinc-200 bg-white">
        <CardHeader>
          <CardTitle className="text-base font-semibold text-zinc-900 sm:text-lg">Support</CardTitle>
          <CardDescription className="text-zinc-500">
            Raise a support request and we&apos;ll get back to you.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            type="button"
            variant="outline"
            className="border-zinc-300 text-zinc-700 hover:bg-zinc-50"
            onClick={handleOpen}
          >
            Raise Support Request
          </Button>
        </CardContent>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={handleClose} aria-hidden />
          <div className="relative z-10 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-semibold text-zinc-900">Support request</h3>
            {submitted ? (
              <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                <p className="font-medium">Request submitted.</p>
                <p className="mt-1">Ticket: {ticketNumber}. We&apos;ll reply to your email shortly.</p>
                <Button type="button" className="mt-4" onClick={handleClose}>
                  Close
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="support-subject">Subject</Label>
                  <Input
                    id="support-subject"
                    value={subject}
                    readOnly
                    className="mt-1 bg-zinc-50"
                  />
                </div>
                <div>
                  <Label htmlFor="support-ticket">Ticket number</Label>
                  <Input
                    id="support-ticket"
                    value={ticketNumber}
                    readOnly
                    className="mt-1 font-mono text-sm bg-zinc-50"
                  />
                </div>
                <div>
                  <Label htmlFor="support-name">Your name</Label>
                  <Input
                    id="support-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Optional"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="support-email">Your email</Label>
                  <Input
                    id="support-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Required for reply"
                    className="mt-1"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="support-message">Message</Label>
                  <textarea
                    id="support-message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your issue or question..."
                    rows={4}
                    className="mt-1 w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
                  />
                </div>
                {error && (
                  <p className="text-sm text-red-600">{error}</p>
                )}
                <div className="flex justify-center">
                  <ReCaptcha onChange={setRecaptchaToken} />
                </div>
                <div className="flex gap-2 pt-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? "Submitting..." : "Submit"}
                  </Button>
                  <Button type="button" variant="outline" onClick={handleClose}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
