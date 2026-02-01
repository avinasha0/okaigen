"use client";

import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function AcceptContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Invalid invite link. Missing token.");
      return;
    }
  }, [token]);

  async function handleAccept() {
    if (!token) return;
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/team/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setMessage(data.message || "You've joined the team.");
      } else {
        setStatus("error");
        setMessage(data.error || "Failed to accept invitation");
      }
    } catch {
      setStatus("error");
      setMessage("Failed to accept invitation");
    }
  }

  if (!token) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Invalid invite link</CardTitle>
            <CardDescription>This invite link is missing a token. Ask the account owner to send a new invite.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>You&apos;ve joined the team</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === "error" && message) {
    return (
      <div className="mx-auto max-w-md px-4 py-12">
        <Card>
          <CardHeader>
            <CardTitle>Couldn&apos;t accept invitation</CardTitle>
            <CardDescription>{message}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <p className="text-sm text-slate-500">
              Make sure you&apos;re logged in with the email address the invitation was sent to.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Accept team invitation</CardTitle>
          <CardDescription>
            You&apos;ve been invited to join a team. Accept to get access to the account&apos;s bots and dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleAccept} disabled={status === "loading"} className="w-full">
            {status === "loading" ? "Accepting..." : "Accept invitation"}
          </Button>
          <p className="mt-4 text-center text-sm text-slate-500">
            You must be logged in with the email the invitation was sent to.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

export default function AcceptInvitePage() {
  return (
    <Suspense fallback={<div className="px-4 py-12 text-center text-slate-500">Loading...</div>}>
      <AcceptContent />
    </Suspense>
  );
}
