import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getPlanUsage } from "@/lib/plan-usage";
import { DashboardShell } from "@/components/dashboard-shell";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const planUsage = session.user.id ? await getPlanUsage(session.user.id) : null;

  const showWarning = planUsage && (
    planUsage.usedMessages >= planUsage.totalMessages ||
    planUsage.usedBots >= planUsage.totalBots
  );

  const nearLimitWarning = planUsage && (
    (planUsage.usedMessages / planUsage.totalMessages >= 0.8 && planUsage.usedMessages < planUsage.totalMessages) ||
    (planUsage.usedBots / planUsage.totalBots >= 0.8 && planUsage.usedBots < planUsage.totalBots)
  );

  return (
    <DashboardShell userEmail={session.user.email} planUsage={planUsage}>
      {showWarning && (
        <div className="border-b border-red-200 bg-red-50 px-4 py-3 sm:px-6 md:px-8">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-red-800">Quota limit reached</h3>
              <p className="mt-1 text-sm text-red-700">
                {planUsage.usedMessages >= planUsage.totalMessages && `Daily message limit reached (${planUsage.usedMessages.toLocaleString()} / ${planUsage.totalMessages.toLocaleString()}). `}
                {planUsage.usedBots >= planUsage.totalBots && `Bot limit reached (${planUsage.usedBots} / ${planUsage.totalBots}). `}
                <Link href="/pricing" className="font-semibold underline hover:text-red-900">Upgrade your plan</Link> to continue.
              </p>
            </div>
          </div>
        </div>
      )}
      {!showWarning && nearLimitWarning && (
        <div className="border-b border-amber-200 bg-amber-50 px-4 py-3 sm:px-6 md:px-8">
          <div className="flex items-start gap-3">
            <svg className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800">Approaching quota limit</h3>
              <p className="mt-1 text-sm text-amber-700">
                You're approaching your plan limits. <Link href="/pricing" className="font-semibold underline hover:text-amber-900">Consider upgrading</Link> to avoid interruptions.
              </p>
            </div>
          </div>
        </div>
      )}
      <div className="min-h-screen">{children}</div>
    </DashboardShell>
  );
}
