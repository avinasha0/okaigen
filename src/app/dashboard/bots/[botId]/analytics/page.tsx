"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { usePlan } from "@/contexts/plan-context";

interface AnalyticsData {
  totalChats: number;
  totalLeads: number;
  dailyUsage: { date: string; count: number }[];
  topQuestions: { question: string; count: number }[];
  sourcesUsed: { title: string | null; url: string | null; chunkCount: number }[];
}

export default function AnalyticsPage() {
  const params = useParams();
  const botId = params.botId as string;
  const { canViewAnalytics } = usePlan();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (!canViewAnalytics) return;
    fetch(`/api/bots/${botId}/analytics?days=${days}`)
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, [botId, days, canViewAnalytics]);

  if (!canViewAnalytics) {
    return (
      <div className="px-4 py-4 sm:px-6 md:px-8">
        <Link
          href={`/dashboard/bots/${botId}`}
          className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to bot
        </Link>
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Analytics</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analytics not available on Starter</CardTitle>
            <CardDescription>
              Analytics are still captured. Upgrade to view usage, top questions, and source stats in your dashboard.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/dashboard/pricing">Upgrade to view analytics</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="px-4 py-4 sm:px-6 md:px-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-8 w-40 animate-pulse rounded-lg bg-zinc-200" />
          <div className="h-10 w-32 animate-pulse rounded-lg bg-zinc-100" />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
              <div className="mt-2 h-9 w-16 animate-pulse rounded bg-zinc-200" />
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="mt-4 h-32 animate-pulse rounded bg-zinc-100" />
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.dailyUsage.map((d) => d.count), 1);

  return (
    <div className="px-4 py-4 sm:px-6 md:px-8">
      <Link
        href={`/dashboard/bots/${botId}`}
        className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to bot
      </Link>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Analytics</h1>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value, 10))}
          className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm sm:w-auto"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardDescription>Total chats</CardDescription>
            <CardTitle className="text-3xl">{data.totalChats}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Leads captured</CardDescription>
            <CardTitle className="text-3xl">{data.totalLeads}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Daily usage</CardTitle>
          <CardDescription>Messages per day</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-32 items-end gap-0.5 overflow-x-auto sm:gap-1">
            {data.dailyUsage.map((d) => (
              <div
                key={d.date}
                className="flex-1 rounded-t bg-gray-200 transition-colors hover:bg-gray-300"
                style={{
                  height: `${(d.count / maxCount) * 100}%`,
                  minHeight: d.count > 0 ? "4px" : "0",
                }}
                title={`${d.date}: ${d.count}`}
              />
            ))}
          </div>
          <div className="mt-2 flex justify-between text-xs text-gray-500">
            <span>
              {data.dailyUsage[0]?.date}
            </span>
            <span>
              {data.dailyUsage[data.dailyUsage.length - 1]?.date}
            </span>
          </div>
        </CardContent>
      </Card>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Top questions</CardTitle>
            <CardDescription>Most common visitor questions</CardDescription>
          </CardHeader>
          <CardContent>
            {data.topQuestions.length === 0 ? (
              <p className="text-sm text-gray-500">No data yet</p>
            ) : (
              <ul className="space-y-3">
                {data.topQuestions.map((q, i) => (
                  <li
                    key={i}
                    className="flex justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <span className="truncate pr-2">{q.question}</span>
                    <span className="text-gray-500">{q.count}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Sources used</CardTitle>
            <CardDescription>Content chunks per source</CardDescription>
          </CardHeader>
          <CardContent>
            {data.sourcesUsed.length === 0 ? (
              <p className="text-sm text-gray-500">No sources</p>
            ) : (
              <ul className="space-y-3">
                {data.sourcesUsed.map((s, i) => (
                  <li
                    key={i}
                    className="flex justify-between rounded-lg border border-gray-200 px-3 py-2 text-sm"
                  >
                    <span className="truncate pr-2">
                      {s.title || s.url || "Untitled"}
                    </span>
                    <span className="text-gray-500">{s.chunkCount}</span>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
