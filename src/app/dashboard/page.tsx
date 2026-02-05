import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getPlanUsage } from "@/lib/plan-usage";
import { getEffectiveOwnerId } from "@/lib/team";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from "@/components/ui/card";
import { NewBotButton } from "@/components/new-bot-button";
import { SupportRequestForm } from "@/components/support-request-form";
import { BotCounts } from "@/components/bot-counts";
import BotsSection from "./_components/bots-section";
import { unstable_cache } from "next/cache";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const ownerId = await getEffectiveOwnerId(session.user.id);

  const [planUsage, totalChunks, totalChats, totalLeads] = await Promise.all([
    getPlanUsage(session.user.id),
    unstable_cache(
      () => prisma.chunk.count({ where: { bot: { userId: ownerId } } }),
      ["dashboard-totals-chunks", ownerId],
      { revalidate: 10 }
    )(),
    unstable_cache(
      () => prisma.chat.count({ where: { bot: { userId: ownerId } } }),
      ["dashboard-totals-chats", ownerId],
      { revalidate: 10 }
    )(),
    unstable_cache(
      () => prisma.lead.count({ where: { bot: { userId: ownerId } } }),
      ["dashboard-totals-leads", ownerId],
      { revalidate: 10 }
    )(),
  ]);

  const canCreateBot = planUsage ? planUsage.usedBots < planUsage.totalBots : true;
  const { canViewLeads, canViewAnalytics } = planUsage
    ? await import("@/lib/plans-config").then((m) => ({
        canViewLeads: m.canViewLeads(planUsage.planName),
        canViewAnalytics: m.canViewAnalytics(planUsage.planName)}))
    : { canViewLeads: false, canViewAnalytics: false };

  const totals = {
    bots: await prisma.bot.count({ where: { userId: ownerId } }),
    chunks: totalChunks,
    chats: totalChats,
    leads: totalLeads,
  };

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-zinc-900 sm:text-2xl">
            Dashboard
          </h1>
          <p className="mt-0.5 text-sm text-zinc-500">
            Manage your AI assistants and view usage
          </p>
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* KPI cards */}
        <div className="mb-6 grid gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Total bots
              </CardTitle>
              <svg
                className="h-4 w-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-zinc-900">
                {totals.bots}
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Knowledge chunks
              </CardTitle>
              <svg
                className="h-4 w-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-zinc-900">
                {totals.chunks.toLocaleString('en-US')}
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Total chats
              </CardTitle>
              <svg
                className="h-4 w-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-zinc-900">
                {totals.chats.toLocaleString('en-US')}
              </div>
            </CardContent>
          </Card>
          <Card className="border-zinc-200 bg-white shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-zinc-500">
                Leads captured
              </CardTitle>
              <svg
                className="h-4 w-4 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold text-zinc-900">
                {totals.leads.toLocaleString('en-US')}
              </div>
            </CardContent>
          </Card>
        </div>

        <div id="bots">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">Your bots</h2>
            <NewBotButton canCreate={canCreateBot} planUsage={planUsage} variant="outline" size="sm" />
          </div>
          <Suspense
            fallback={
              <div className="overflow-hidden border-zinc-200 bg-white rounded-lg">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="p-4 sm:p-6 border-t border-zinc-100 first:border-t-0">
                    <div className="h-4 w-48 animate-pulse rounded bg-zinc-200" />
                    <div className="mt-2 h-3 w-64 animate-pulse rounded bg-zinc-200" />
                  </div>
                ))}
              </div>
            }
          >
            <BotsSection ownerId={ownerId} canCreateBot={canCreateBot} planUsage={planUsage} />
          </Suspense>
        </div>

        {/* Support section */}
        <div className="mt-8">
          <SupportRequestForm />
        </div>
      </div>
    </div>
  );
}
