"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
import * as Select from "@radix-ui/react-select";

export default function BotEditPage() {
  const router = useRouter();
  const params = useParams();
  const botId = params.botId as string;
  const [bot, setBot] = useState<{
    id: string;
    name: string;
    greetingMessage: string;
    tone: string;
    confidenceThreshold: number;
    leadCaptureTrigger: string;
    humanFallbackMessage: string;
    quickPrompts: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/bots/${botId}`)
      .then((r) => r.json())
      .then(setBot)
      .catch(() => router.push("/dashboard"));
  }, [botId, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!bot) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: bot.name,
          greetingMessage: bot.greetingMessage,
          tone: bot.tone,
          confidenceThreshold: bot.confidenceThreshold,
          leadCaptureTrigger: bot.leadCaptureTrigger,
          humanFallbackMessage: bot.humanFallbackMessage,
          quickPrompts: bot.quickPrompts,
        }),
      });
      if (!res.ok) throw new Error("Failed to update");
      router.push(`/dashboard/bots/${botId}`);
      router.refresh();
    } catch {
      setError("Failed to update");
      setLoading(false);
    }
  }

  if (!bot) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 md:px-8">
      <Link
        href={`/dashboard/bots/${botId}`}
        className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to {bot.name}
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Bot behavior</CardTitle>
          <CardDescription>Customize how your bot greets and responds</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-700">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Bot name</Label>
              <Input
                id="name"
                value={bot.name}
                onChange={(e) => setBot({ ...bot, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="greeting">Greeting message</Label>
              <Input
                id="greeting"
                value={bot.greetingMessage}
                onChange={(e) =>
                  setBot({ ...bot, greetingMessage: e.target.value })
                }
                placeholder="Hi! How can I help?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tone">Tone</Label>
              <select
                id="tone"
                value={bot.tone}
                onChange={(e) => setBot({ ...bot, tone: e.target.value })}
                className="flex h-10 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              >
                <option value="formal">Formal</option>
                <option value="friendly">Friendly</option>
                <option value="casual">Casual</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="threshold">
                Confidence threshold ({(bot.confidenceThreshold * 100).toFixed(0)}%)
              </Label>
              <input
                id="threshold"
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={bot.confidenceThreshold}
                onChange={(e) =>
                  setBot({
                    ...bot,
                    confidenceThreshold: parseFloat(e.target.value),
                  })
                }
                className="w-full"
              />
              <p className="text-xs text-gray-500">
                Lower = more likely to answer. Higher = more likely to say &quot;I
                don&apos;t know&quot;
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="fallback">Fallback message (when unsure)</Label>
              <Input
                id="fallback"
                value={bot.humanFallbackMessage}
                onChange={(e) =>
                  setBot({ ...bot, humanFallbackMessage: e.target.value })
                }
                placeholder="I'm not sure. Would you like to leave your contact?"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="quickPrompts">Quick prompts (one per line)</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={async () => {
                    try {
                      const r = await fetch(`/api/bots/${botId}/suggest-prompts`);
                      const data = await r.json();
                      if (data.prompts?.length) {
                        setBot({
                          ...bot,
                          quickPrompts: JSON.stringify(data.prompts),
                        });
                      }
                    } catch {
                      /* ignore */
                    }
                  }}
                >
                  Generate from content
                </Button>
              </div>
              <textarea
                id="quickPrompts"
                rows={4}
                value={
                  bot.quickPrompts
                    ? (() => {
                        try {
                          return (JSON.parse(bot.quickPrompts) as string[]).join("\n");
                        } catch {
                          return "";
                        }
                      })()
                    : ""
                }
                onChange={(e) =>
                  setBot({
                    ...bot,
                    quickPrompts: e.target.value
                      ? JSON.stringify(
                          e.target.value
                            .split("\n")
                            .map((s) => s.trim())
                            .filter(Boolean)
                        )
                      : null,
                  })
                }
                placeholder={"What do you offer?\nHow can I contact you?\nTell me about your services"}
                className="flex w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <p className="text-xs text-slate-500">
                Clickable questions shown when chat opens. One per line. Use &quot;Generate from content&quot; to auto-create from your trained content.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="leadCapture">Lead capture</Label>
              <select
                id="leadCapture"
                value={bot.leadCaptureTrigger}
                onChange={(e) =>
                  setBot({ ...bot, leadCaptureTrigger: e.target.value })
                }
                className="flex h-10 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              >
                <option value="uncertain">When uncertain (below confidence threshold)</option>
                <option value="always">Always ask for email</option>
                <option value="never">Never</option>
              </select>
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
