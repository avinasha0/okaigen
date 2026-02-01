"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function NewBotPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [atLimit, setAtLimit] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/plan-usage")
      .then((r) => r.json())
      .then((data) => {
        if (data.usedBots != null && data.totalBots != null) {
          setAtLimit(data.usedBots >= data.totalBots);
        } else {
          setAtLimit(false);
        }
      })
      .catch(() => setAtLimit(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/bots", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim() || "My Bot",
          websiteUrl: websiteUrl.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (res.status === 402 && data.quotaExceeded) {
        setError(`${data.error} Upgrade at /pricing`);
        setLoading(false);
        return;
      }
      if (!res.ok) throw new Error(data.error || "Failed to create bot");
      router.push(`/dashboard/bots/${data.id}/setup`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create bot");
      setLoading(false);
    }
  }

  if (atLimit === null) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 md:px-8">
        <div className="py-12 text-center text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  if (atLimit) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 md:px-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Bot limit reached</CardTitle>
            <CardDescription>
              You&apos;ve reached your plan limit. Upgrade to create more bots and unlock additional features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/pricing">View plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 md:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to dashboard
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create a new bot</CardTitle>
          <CardDescription>
            Step 1: Give your bot a name and optionally add your website URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
                {error.includes("Upgrade") && (
                  <Link href="/pricing" className="ml-2 font-semibold underline hover:text-red-900">
                    View plans →
                  </Link>
                )}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Bot name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Support Bot"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">Website URL (optional)</Label>
              <Input
                id="url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                placeholder="https://yourwebsite.com"
              />
              <p className="text-xs text-gray-500">
                We&apos;ll crawl and index your website content
              </p>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
