"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlan } from "@/contexts/plan-context";

const EVENTS: { value: string; label: string }[] = [
  { value: "lead.captured", label: "Lead captured" },
  { value: "chat.message", label: "Chat message" },
];

type WebhookRow = {
  id: string;
  url: string;
  events: string;
  description: string | null;
  createdAt: string;
};

export default function WebhooksPage() {
  const { hasWebhooks } = usePlan();
  const [webhooks, setWebhooks] = useState<WebhookRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [url, setUrl] = useState("");
  const [events, setEvents] = useState<string[]>([]);
  const [description, setDescription] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (hasWebhooks) {
      fetch("/api/webhooks")
        .then((r) => r.json())
        .then((data) => setWebhooks(data.webhooks ?? []))
        .catch(() => setWebhooks([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [hasWebhooks]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || events.length === 0 || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), events, description: description.trim() || undefined }),
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to create webhook");
        setCreating(false);
        return;
      }
      setCreatedSecret(data.secret);
      setUrl("");
      setEvents([]);
      setDescription("");
      setWebhooks((prev) => (data.webhook ? [data.webhook, ...prev] : prev));
    } catch {
      alert("Failed to create webhook");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (revoking) return;
    if (!confirm("Remove this webhook? It will stop receiving events.")) return;
    setRevoking(id);
    try {
      const res = await fetch(`/api/webhooks/${id}`, { method: "DELETE" });
      if (res.ok) setWebhooks((prev) => prev.filter((w) => w.id !== id));
      else alert("Failed to remove webhook");
    } catch {
      alert("Failed to remove webhook");
    } finally {
      setRevoking(null);
    }
  }

  function toggleEvent(ev: string) {
    setEvents((prev) => (prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]));
  }

  if (!hasWebhooks) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:px-8">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">Webhooks</h1>
        <p className="mb-6 text-zinc-600">
          Receive HTTP callbacks when leads are captured or chat messages are sent. Available on Scale and Enterprise plans.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Upgrade for webhooks</CardTitle>
            <CardDescription>Upgrade to Scale or Enterprise to add webhook endpoints.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/dashboard/pricing">
              <Button className="bg-[#1a6aff] hover:bg-[#0d5aeb]">View plans</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 md:px-8">
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">Webhooks</h1>
      <p className="mb-6 text-zinc-600">
        Receive HTTP POST requests when events occur. Verify requests using the signing secret (shown once).
      </p>

      {createdSecret && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardHeader>
            <CardTitle className="text-amber-900">Webhook created</CardTitle>
            <CardDescription>Copy the signing secret now. You won&apos;t see it again. Use it to verify X-Webhook-Signature.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input readOnly value={createdSecret} className="font-mono text-sm" />
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(createdSecret)}>Copy</Button>
            </div>
            <Button variant="secondary" onClick={() => setCreatedSecret(null)}>Done</Button>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add webhook</CardTitle>
          <CardDescription>Endpoint must be HTTPS. Select which events to receive.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <Label htmlFor="webhook-url">Endpoint URL</Label>
              <Input
                id="webhook-url"
                type="url"
                placeholder="https://your-server.com/webhooks/sitebotgpt"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
                className="mt-1 max-w-xl"
              />
            </div>
            <div>
              <Label>Events</Label>
              <div className="mt-2 flex flex-wrap gap-3">
                {EVENTS.map((ev) => (
                  <label key={ev.value} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={events.includes(ev.value)}
                      onChange={() => toggleEvent(ev.value)}
                      className="rounded border-zinc-300"
                    />
                    <span className="text-sm text-zinc-700">{ev.label}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="webhook-desc">Description (optional)</Label>
              <Input
                id="webhook-desc"
                placeholder="e.g. Production CRM"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={500}
                className="mt-1 max-w-md"
              />
            </div>
            <Button type="submit" disabled={!url.trim() || events.length === 0 || creating}>
              {creating ? "Adding..." : "Add webhook"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Your webhooks</CardTitle>
          <CardDescription>Remove any endpoint you no longer use.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : webhooks.length === 0 ? (
            <p className="text-sm text-zinc-500">No webhooks yet. Add one above.</p>
          ) : (
            <ul className="space-y-3">
              {webhooks.map((w) => (
                <li key={w.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-3">
                  <div>
                    <p className="font-medium text-zinc-900">{w.url}</p>
                    <p className="text-xs text-zinc-500">{w.events} {w.description && `· ${w.description}`}</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-rose-600 hover:text-rose-700"
                    onClick={() => handleRevoke(w.id)}
                    disabled={revoking === w.id}
                  >
                    {revoking === w.id ? "Removing..." : "Remove"}
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <p className="mt-6 text-sm text-zinc-500">
        <Link href="/docs/api#webhooks" className="text-[#1a6aff] hover:underline">API docs: Webhooks</Link>
      </p>
    </div>
  );
}
