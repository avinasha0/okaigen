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
import { usePlan } from "@/contexts/plan-context";

interface Bot {
  id: string;
  name: string;
}

export default function AnalyticsPage() {
  const { canViewAnalytics } = usePlan();
  const [bots, setBots] = useState<Bot[]>([]);

  useEffect(() => {
    if (!canViewAnalytics) return;
    fetch("/api/bots")
      .then((r) => r.json())
      .then((data) => setBots(Array.isArray(data) ? data : data?.bots ?? []))
      .catch(console.error);
  }, [canViewAnalytics]);

  if (!canViewAnalytics) {
    return (
      <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Analytics</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Usage, top questions, and source stats per bot
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Analytics not available on your plan</CardTitle>
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

  return (
    <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Analytics</h1>
        <p className="mt-0.5 text-sm text-slate-500">
          View usage and insights per bot
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Choose a bot</CardTitle>
          <CardDescription>
            Analytics are per bot. Select a bot to see its usage, top questions, and source stats.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {bots.length === 0 ? (
            <p className="py-4 text-center text-sm text-slate-500">
              No bots yet. <Link href="/dashboard/bots/new" className="text-[#1a6aff] hover:underline">Create a bot</Link> to see analytics.
            </p>
          ) : (
            <ul className="space-y-2">
              {bots.map((bot) => (
                <li key={bot.id}>
                  <Link
                    href={`/dashboard/bots/${bot.id}/analytics`}
                    className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 text-sm font-medium text-slate-800 transition-colors hover:border-[#1a6aff] hover:bg-slate-50"
                  >
                    <span>{bot.name}</span>
                    <span className="text-slate-400">View analytics →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
