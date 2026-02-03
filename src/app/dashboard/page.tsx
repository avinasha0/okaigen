import Link from "next/link";
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
  CardTitle,
} from "@/components/ui/card";
import { NewBotButton } from "@/components/new-bot-button";
import { SupportRequestForm } from "@/components/support-request-form";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const ownerId = await getEffectiveOwnerId(session.user.id);

  const [bots, planUsage] = await Promise.all([
    prisma.bot.findMany({
      where: { userId: ownerId },
      select: {
        id: true,
        name: true,
        createdAt: true,
        _count: { select: { chunk: true, chat: true, lead: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    getPlanUsage(session.user.id),
  ]);

  const canCreateBot = planUsage ? planUsage.usedBots < planUsage.totalBots : true;
  const { canViewLeads, canViewAnalytics } = planUsage
    ? await import("@/lib/plans-config").then((m) => ({
        canViewLeads: m.canViewLeads(planUsage.planName),
        canViewAnalytics: m.canViewAnalytics(planUsage.planName),
      }))
    : { canViewLeads: false, canViewAnalytics: false };

  const totals = bots.reduce(
    (acc, b) => ({
      bots: acc.bots + 1,
      chunks: acc.chunks + b._count.chunk,
      chats: acc.chats + b._count.chat,
      leads: acc.leads + b._count.lead,
    }),
    { bots: 0, chunks: 0, chats: 0, leads: 0 }
  );

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

        {/* Bots section */}
        <div id="bots">
          <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-base font-semibold text-zinc-900 sm:text-lg">Your assistants</h2>
            <NewBotButton canCreate={canCreateBot} planUsage={planUsage} variant="outline" size="sm" />
          </div>

          {bots.length === 0 ? (
            <Card className="border-zinc-200 bg-white">
              <CardHeader>
                <CardTitle className="text-zinc-900">No bots yet</CardTitle>
                <CardDescription className="text-zinc-500">
                  Create your first bot to get started. Add your website URL or
                  upload documents to train your AI assistant.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewBotButton canCreate={canCreateBot} planUsage={planUsage} />
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden border-zinc-200 bg-white">
              <div className="divide-y divide-zinc-100">
                {bots.map((bot) => (
                  <div
                    key={bot.id}
                    className="flex flex-col gap-4 p-4 transition-colors hover:bg-zinc-50/80 sm:p-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/dashboard/bots/${bot.id}`}
                        className="font-medium text-zinc-900 hover:text-[#1a6aff] hover:underline"
                      >
                        {bot.name}
                      </Link>
                      <p className="mt-1 text-sm text-zinc-500">
                        {bot._count.chunk} chunks · {bot._count.chat} chats ·{" "}
                        {bot._count.lead} leads
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link 
                        href={!canViewAnalytics ? "/dashboard/analytics" : `/dashboard/bots/${bot.id}/analytics`}
                        className="flex-1 min-w-[100px] sm:flex-none"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full sm:w-auto inline-flex items-center gap-1.5 ${!canViewAnalytics ? "border-amber-200 bg-amber-50/50 text-zinc-500" : "border-zinc-300 text-zinc-700"}`}
                          title={!canViewAnalytics ? "Upgrade to view analytics" : undefined}
                        >
                          {!canViewAnalytics && (
                            <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          )}
                          Analytics
                        </Button>
                      </Link>
                      <Link 
                        href={`/dashboard/bots/${bot.id}/chats`}
                        className="flex-1 min-w-[100px] sm:flex-none"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full border-zinc-300 text-zinc-700 sm:w-auto"
                        >
                          Chats
                        </Button>
                      </Link>
                      <Link 
                        href={!canViewLeads ? "/dashboard/leads" : `/dashboard/bots/${bot.id}/leads`}
                        className="flex-1 min-w-[100px] sm:flex-none"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className={`w-full sm:w-auto inline-flex items-center gap-1.5 ${!canViewLeads ? "border-amber-200 bg-amber-50/50 text-zinc-500" : "border-zinc-300 text-zinc-700"}`}
                          title={!canViewLeads ? "Upgrade to view leads" : undefined}
                        >
                          {!canViewLeads && (
                            <svg className="h-3.5 w-3.5 shrink-0 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                            </svg>
                          )}
                          Leads
                        </Button>
                      </Link>
                      <Link 
                        href={`/dashboard/bots/${bot.id}`}
                        className="flex-1 min-w-[100px] sm:flex-none"
                      >
                        <Button
                          size="sm"
                          className="w-full bg-[#1a6aff] hover:bg-[#1557e0] sm:w-auto"
                        >
                          Open
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Support section */}
        <div className="mt-8">
          <SupportRequestForm />
        </div>
      </div>
    </div>
  );
}

