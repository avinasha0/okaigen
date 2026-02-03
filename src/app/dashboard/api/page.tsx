"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlan } from "@/contexts/plan-context";

type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
};

export default function ApiKeysPage() {
  const { hasApiAccess } = usePlan();
  const [keys, setKeys] = useState<ApiKeyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newName, setNewName] = useState("");
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [createdKeyId, setCreatedKeyId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState<string | null>(null);

  useEffect(() => {
    if (hasApiAccess) {
      fetch("/api/api-keys")
        .then((r) => r.json())
        .then((data) => setKeys(data.keys ?? []))
        .catch(() => setKeys([]))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [hasApiAccess]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || creating) return;
    setCreating(true);
    try {
      const res = await fetch("/api/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim() })});
      const data = await res.json();
      if (!res.ok) {
        alert(data.error ?? "Failed to create API key");
        setCreating(false);
        return;
      }
      setCreatedSecret(data.secret);
      setCreatedKeyId(data.key?.id ?? null);
      setNewName("");
      setKeys((prev) => (data.key ? [{ ...data.key, lastUsedAt: null }, ...prev] : prev));
    } catch {
      alert("Failed to create API key");
    } finally {
      setCreating(false);
    }
  }

  async function handleRevoke(id: string) {
    if (revoking) return;
    if (!confirm("Revoke this API key? It will stop working immediately.")) return;
    setRevoking(id);
    try {
      const res = await fetch(`/api/api-keys/${id}`, { method: "DELETE" });
      if (res.ok) setKeys((prev) => prev.filter((k) => k.id !== id));
      else alert("Failed to revoke key");
    } catch {
      alert("Failed to revoke key");
    } finally {
      setRevoking(null);
    }
  }

  function dismissSecret() {
    setCreatedSecret(null);
    setCreatedKeyId(null);
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "";

  if (!hasApiAccess) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 md:px-8">
        <h1 className="mb-2 text-2xl font-bold text-zinc-900">API access</h1>
        <p className="mb-6 text-zinc-600">
          Programmatic API access is available on Scale and Enterprise plans. Create API keys to call the chat API from your backend or scripts.
        </p>
        <Card>
          <CardHeader>
            <CardTitle>Upgrade for API access</CardTitle>
            <CardDescription>
              Upgrade to Scale or Enterprise to create API keys and integrate with your apps.
            </CardDescription>
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
      <h1 className="mb-2 text-2xl font-bold text-zinc-900">API access</h1>
      <p className="mb-6 text-zinc-600">
        Create API keys to call the chat API from your backend, scripts, or integrations. Keys are shown once at creation.
      </p>

      {createdSecret && (
        <Card className="mb-6 border-amber-300 bg-amber-50 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-200 text-amber-800" aria-hidden>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </span>
              API key created
            </CardTitle>
            <CardDescription className="text-base font-semibold text-amber-800">
              Copy now; you won&apos;t see it again. The full secret is only shown once and is never returned by the API.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                readOnly
                value={createdSecret}
                className="font-mono text-sm"
                aria-label="API key secret (copy now)"
              />
              <Button
                variant="outline"
                onClick={() => navigator.clipboard.writeText(createdSecret)}
              >
                Copy
              </Button>
            </div>
            <Button variant="secondary" onClick={dismissSecret}>
              I&apos;ve saved the key
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create API key</CardTitle>
          <CardDescription>Give the key a name (e.g. Production, Development) to identify it later.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-3">
            <div className="flex-1">
              <Label htmlFor="key-name" className="sr-only">Name</Label>
              <Input
                id="key-name"
                placeholder="e.g. Production"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={255}
                className="max-w-xs"
              />
            </div>
            <Button type="submit" disabled={!newName.trim() || creating}>
              {creating ? "Creating..." : "Create key"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Your API keys</CardTitle>
          <CardDescription>Revoke any key you no longer need. Key prefix is shown; the secret is only visible at creation.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-zinc-500">Loading...</p>
          ) : keys.length === 0 ? (
            <p className="text-sm text-zinc-500">No API keys yet. Create one above.</p>
          ) : (
            <ul className="space-y-3">
              {keys.map((k) => (
                <li
                  key={k.id}
                  className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-zinc-200 bg-zinc-50/50 px-4 py-3"
                >
                  <div>
                    <span className="font-medium text-zinc-900">{k.name}</span>
                    <span className="ml-2 font-mono text-sm text-zinc-500">{k.keyPrefix}…</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    {k.lastUsedAt && (
                      <span>Last used {new Date(k.lastUsedAt).toLocaleDateString()}</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-rose-600 hover:text-rose-700"
                      onClick={() => handleRevoke(k.id)}
                      disabled={revoking === k.id}
                    >
                      {revoking === k.id ? "Revoking..." : "Revoke"}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Using the API</CardTitle>
          <CardDescription>Send a POST request to the chat endpoint with your API key and botId.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-zinc-600">
            <strong>Endpoint:</strong> <code className="rounded bg-zinc-100 px-1 py-0.5">{baseUrl}/api/chat</code>
          </p>
          <p className="text-sm text-zinc-600">
            <strong>Headers:</strong> <code className="rounded bg-zinc-100 px-1 py-0.5">Authorization: Bearer YOUR_API_KEY</code> or <code className="rounded bg-zinc-100 px-1 py-0.5">x-api-key: YOUR_API_KEY</code>
          </p>
          <p className="text-sm text-zinc-600">
            <strong>Body (JSON):</strong> <code className="rounded bg-zinc-100 px-1 py-0.5">&#123; &quot;botId&quot;: &quot;your_bot_id&quot;, &quot;message&quot;: &quot;Hello&quot; &#125;</code>
          </p>
          <pre className="overflow-x-auto rounded-lg border border-zinc-200 bg-zinc-900 p-4 text-sm text-zinc-100">
{`curl -X POST ${baseUrl}/api/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"botId": "YOUR_BOT_ID", "message": "Hello"}'`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}
