"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Progress from "@radix-ui/react-progress";
import { usePlan } from "@/contexts/plan-context";

export default function BotSetupPage() {
  const router = useRouter();
  const params = useParams();
  const botId = params.botId as string;
  const [bot, setBot] = useState<{
    id: string;
    name: string;
    sources: { id: string; type: string; title: string | null; status: string; error?: string | null }[];
    _count: { chunks: number };
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [addingUrl, setAddingUrl] = useState(false);
  const [newUrl, setNewUrl] = useState("");
  const [training, setTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { canUseDocumentTraining, canManualRefresh, refreshSchedule } = usePlan();
  const isStarterPlan = !canUseDocumentTraining;
  const refreshScheduleLabel =
    refreshSchedule === "manual"
      ? "Manual"
      : refreshSchedule === "weekly"
        ? "Auto (weekly)"
        : "Auto (daily)";

  useEffect(() => {
    fetch(`/api/bots/${botId}`)
      .then((r) => r.json())
      .then(setBot)
      .catch(() => router.push("/dashboard"));
  }, [botId, router]);

  async function handleAddUrl() {
    const url = newUrl.trim();
    if (!url) return;
    setAddingUrl(true);
    try {
      const res = await fetch(`/api/bots/${botId}/sources`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      if (!res.ok) throw new Error("Failed to add URL");
      const data = await res.json();
      setBot((prev) =>
        prev
          ? {
              ...prev,
              sources: [
                ...prev.sources,
                ...data.sources.map((s: { id: string; title: string }) => ({
                  id: s.id,
                  type: "url",
                  title: s.title,
                  status: "pending",
                })),
              ],
            }
          : null
      );
      setNewUrl("");
    } catch {
      alert("Failed to add URL");
    } finally {
      setAddingUrl(false);
    }
  }

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files?.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      for (let i = 0; i < files.length; i++) {
        formData.append("files", files[i]);
      }
      const res = await fetch(`/api/bots/${botId}/sources`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const data = await res.json();
      setBot((prev) =>
        prev
          ? {
              ...prev,
              sources: [
                ...prev.sources,
                ...data.sources.map((s: { id: string; title: string }) => ({
                  id: s.id,
                  type: "document",
                  title: s.title,
                  status: "pending",
                })),
              ],
            }
          : null
      );
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function startTraining() {
    setTraining(true);
    setTrainingProgress(10);
    try {
      const res = await fetch(`/api/bots/${botId}/train`, {
        method: "POST",
        credentials: "include",
      });
      setTrainingProgress(90);
      
      // Check if response is OK and has content
      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMessage = `Training failed (HTTP ${res.status} ${res.statusText})`;
        
        try {
          if (contentType?.includes("application/json")) {
            const errorData = await res.json();
            errorMessage = errorData.detail || errorData.error || errorMessage;
          } else {
            const text = await res.text();
            if (text) {
              errorMessage = `${errorMessage}: ${text.substring(0, 200)}`;
            }
          }
        } catch (parseErr) {
          // If parsing fails, keep the status-based error message
          console.error("Failed to parse error response:", parseErr);
        }
        
        throw new Error(errorMessage);
      }
      
      // Parse JSON response
      const contentType = res.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        const text = await res.text();
        throw new Error(`Invalid response format: ${text.substring(0, 100)}`);
      }
      
      const data = await res.json();
      setTrainingProgress(100);
      setBot((prev) =>
        prev
          ? {
              ...prev,
              _count: { chunks: prev._count.chunks + (data.chunksCreated || 0) },
              sources: prev.sources.map((s) =>
                s.status === "pending"
                  ? { ...s, status: "completed" }
                  : s
              ),
            }
          : null
      );
      setTimeout(() => router.push(`/dashboard/bots/${botId}`), 1500);
    } catch (err) {
      let msg = "Training failed";
      if (err instanceof Error) {
        msg = err.message;
        console.error("Training error:", err);
      } else {
        console.error("Training error (unknown):", err);
      }
      // Show detailed error to user
      alert(`Training Error\n\n${msg}\n\nCheck browser console for details.`);
      fetch(`/api/bots/${botId}`)
        .then((r) => r.json())
        .then(setBot)
        .catch(() => {});
    } finally {
      setTraining(false);
      setTrainingProgress(0);
    }
  }

  const hasPending = bot?.sources.some((s) => s.status === "pending") ?? false;
  const hasFailed = bot?.sources.some((s) => s.status === "failed") ?? false;
  const canTrain = hasPending || hasFailed;

  if (!bot) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 md:px-8">
      <Link
        href={`/dashboard/bots/${botId}`}
        className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to {bot.name}
      </Link>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Step 2: Add content (optional)</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-x-2 gap-y-1">
              {isStarterPlan
                ? "Add website URLs to train your bot (document upload available on higher plans)."
                : "Add website URLs or upload documents to expand your bot's knowledge"}
              <span className="text-xs text-slate-500">Refresh: {refreshScheduleLabel}</span>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <input
                type="url"
                placeholder="https://digitalxbrand.com/services.html"
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAddUrl()}
                className="flex-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
              <Button
                variant="outline"
                onClick={handleAddUrl}
                disabled={!newUrl.trim() || addingUrl}
              >
                {addingUrl ? "Adding..." : "Add URL"}
              </Button>
            </div>
            {!isStarterPlan && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept=".pdf,.docx,.doc,.txt,.md"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? "Uploading..." : "Upload documents"}
                </Button>
              </>
            )}
            {isStarterPlan && (
              <p className="text-xs text-slate-500">
                Your plan includes website training only. <Link href="/dashboard/pricing" className="text-[#1a6aff] hover:underline">Upgrade</Link> to add PDF, DOCX, TXT, MD.
              </p>
            )}
            {!isStarterPlan && (
              <p className="text-xs text-slate-500">
                Add specific pages (e.g. /services.html) if the crawler missed them
              </p>
            )}
            {bot.sources.length > 0 && (
              <ul className="mt-4 space-y-2">
                {bot.sources.map((s) => (
                  <li
                    key={s.id}
                    className="flex flex-col gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate">{s.title || s.type}</span>
                      <div className="flex items-center gap-2 shrink-0">
                        {(s.status === "completed" || s.status === "failed") && canManualRefresh && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-7 text-xs"
                            onClick={async () => {
                              try {
                                const r = await fetch(`/api/bots/${botId}/sources/retrain`, {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ sourceId: s.id }),
                                });
                                if (r.ok) {
                                  const data = await fetch(`/api/bots/${botId}`).then((x) => x.json());
                                  setBot(data);
                                } else if (r.status === 403) {
                                  alert("Manual refresh is not available on your plan. Upgrade to retrain sources.");
                                }
                              } catch {
                                /* ignore */
                              }
                            }}
                          >
                            Retrain
                          </Button>
                        )}
                        <span
                          className={
                            s.status === "completed"
                              ? "text-emerald-600"
                              : s.status === "failed"
                                ? "text-rose-600"
                                : "text-slate-500"
                          }
                        >
                          {s.status}
                        </span>
                      </div>
                    </div>
                    {s.status === "failed" && s.error && (
                      <p className="text-xs text-rose-600">{s.error}</p>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Step 3: Train your bot</CardTitle>
            <CardDescription>
              Index your content and generate embeddings. This may take a few
              minutes.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {training && (
              <div className="space-y-2">
                <Progress.Root
                  value={trainingProgress}
                  className="h-2 w-full overflow-hidden rounded-full bg-gray-200"
                >
                  <Progress.Indicator
                    className="h-full bg-gray-900 transition-all"
                    style={{ width: `${trainingProgress}%` }}
                  />
                </Progress.Root>
                <p className="text-sm text-gray-600">
                  Training in progress... Pages indexed, generating embeddings.
                </p>
              </div>
            )}
            <div className="flex gap-4">
              <Button
                onClick={startTraining}
                disabled={!canTrain || training}
              >
                {training ? "Training..." : hasFailed ? "Retry training" : "Start training"}
              </Button>
              {bot._count.chunks > 0 && (
                <p className="flex items-center text-sm text-gray-600">
                  {bot._count.chunks} chunks indexed
                </p>
              )}
            </div>
            {!canTrain && bot.sources.length === 0 && (
              <p className="text-sm text-amber-600">
                {isStarterPlan
                  ? "Add a website URL above to train your bot."
                  : "Add a website URL when creating the bot, or upload documents above."}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
