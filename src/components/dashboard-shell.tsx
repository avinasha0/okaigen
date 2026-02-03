"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/sign-out-button";
import { PlanProvider, usePlan } from "@/contexts/plan-context";

export type PlanUsage = {
  planName: string;
  usedMessages: number;
  totalMessages: number;
  usedBots: number;
  totalBots: number;
  usedTeamMembers?: number;
  totalTeamMembers?: number;
};

function DashboardShellInner({
  userEmail,
  planUsage,
  children}: {
  userEmail: string | null | undefined;
  planUsage?: PlanUsage | null;
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRefMobile = useRef<HTMLDivElement>(null);
  const profileRefDesktop = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { isStarterPlan, canViewLeads: hasLeads, canViewAnalytics: hasAnalytics } = usePlan();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inside =
        (profileRefMobile.current && profileRefMobile.current.contains(target)) ||
        (profileRefDesktop.current && profileRefDesktop.current.contains(target));
      if (!inside) setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  const handleBotsClick = useCallback((e: React.MouseEvent) => {
    setSidebarOpen(false);
    if (pathname === "/dashboard") {
      e.preventDefault();
      document.getElementById("bots")?.scrollIntoView({ behavior: "smooth" });
    }
  }, [pathname]);

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Mobile header - dark bg so white logo is visible */}
      <header className="fixed left-0 right-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-zinc-800 bg-zinc-900 px-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Open menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/dashboard" className="flex h-14 min-w-0 flex-1 items-center" aria-label="SiteBotGPT dashboard">
          <span className="relative flex h-8 w-full max-w-[150px] shrink-0 overflow-hidden bg-transparent">
            <Image src="/sitebotgpt_logowhite1.jpg" alt="SiteBotGPT" fill className="object-contain object-left" sizes="150px" priority />
          </span>
        </Link>
        <div className="relative shrink-0" ref={profileRefMobile}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-800 hover:text-white"
            aria-label="Profile"
            aria-expanded={profileOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-white/10 bg-white/5 py-2 shadow-xl">
              <div className="truncate px-4 py-2 text-sm text-slate-300">{userEmail ?? "User"}</div>
              <div className="border-t border-white/10 px-2 pt-2">
                <SignOutButton className="w-full rounded px-3 py-2 text-left text-slate-400 hover:bg-white/10 hover:text-white" />
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Overlay when sidebar open on mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col overflow-hidden border-r border-white/10 bg-slate-900 transition-transform duration-200 ease-out md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-10 shrink-0 items-center justify-between border-b border-white/10 px-3 md:h-12 md:px-4">
          <Link href="/dashboard" className="flex h-10 w-full items-center md:h-12" aria-label="SiteBotGPT dashboard">
            <span className="relative flex h-6 w-full shrink-0 overflow-hidden bg-transparent md:h-8 md:max-w-[100px]">
              <Image src="/sitebotgpt_logowhite1.jpg" alt="SiteBotGPT" fill className="object-contain object-left" sizes="100px" priority />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-hidden px-3 py-4">
          <Link
            href="/dashboard"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Overview
          </Link>
          <Link
            href="/dashboard#bots"
            onClick={handleBotsClick}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Bots
          </Link>
          <Link
            href="/dashboard/leads"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="flex-1">Leads</span>
            {!hasLeads && (
              <span className="shrink-0 rounded bg-amber-500/20 p-1 text-amber-400" title="Upgrade to view leads">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            )}
          </Link>
          <Link
            href="/dashboard/analytics"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span className="flex-1">Analytics</span>
            {!hasAnalytics && (
              <span className="shrink-0 rounded bg-amber-500/20 p-1 text-amber-400" title="Upgrade to view analytics">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </span>
            )}
          </Link>
          <Link
            href="/dashboard/team"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Team
          </Link>
          <Link
            href="/dashboard/pricing"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Pricing
          </Link>
          <Link
            href="/dashboard/settings"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <svg className="h-5 w-5 shrink-0 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
        </nav>
        {planUsage && (
          <div className="border-t border-white/10 p-4">
            <div className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-slate-400">Plan</div>
            <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-3">
              <p className="text-sm font-medium text-white">{planUsage.planName}</p>
              <div className="mt-3 space-y-2">
                <div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Messages today</span>
                    <span>{planUsage.usedMessages.toLocaleString('en-US')} / {planUsage.totalMessages.toLocaleString('en-US')}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-[#1a6aff] transition-all"
                      style={{ width: `${Math.min(100, planUsage.totalMessages > 0 ? (planUsage.usedMessages / planUsage.totalMessages) * 100 : 0)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs text-slate-400">
                    <span>Bots</span>
                    <span>{planUsage.usedBots} / {planUsage.totalBots}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-500/80 transition-all"
                      style={{ width: `${Math.min(100, planUsage.totalBots > 0 ? (planUsage.usedBots / planUsage.totalBots) * 100 : 0)}%` }}
                    />
                  </div>
                </div>
                {planUsage.totalTeamMembers != null && planUsage.totalTeamMembers > 1 && (
                  <div>
                    <div className="flex justify-between text-xs text-slate-400">
                      <span>Team</span>
                      <span>{planUsage.usedTeamMembers ?? 0} / {planUsage.totalTeamMembers}</span>
                    </div>
                    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-amber-500/80 transition-all"
                        style={{ width: `${Math.min(100, planUsage.totalTeamMembers > 0 ? ((planUsage.usedTeamMembers ?? 0) / planUsage.totalTeamMembers) * 100 : 0)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
              <Link
                href="/dashboard/pricing"
                className="mt-2 flex items-center justify-center gap-1.5 text-xs font-medium text-[#1a6aff] hover:underline"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Upgrade plan
              </Link>
            </div>
          </div>
        )}
      </aside>

      {/* Main */}
      <main className="min-h-screen min-w-0 flex-1 pt-14 md:pt-0 md:pl-64">
        {/* Profile icon top right (desktop) */}
        <div className="absolute right-4 top-4 z-40 hidden md:block" ref={profileRefDesktop}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-600 shadow-sm hover:bg-zinc-50 hover:text-zinc-900"
            aria-label="Profile"
            aria-expanded={profileOpen}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-zinc-200 bg-white py-2 shadow-lg">
              <div className="truncate px-4 py-2 text-sm text-zinc-600">{userEmail ?? "User"}</div>
              <div className="border-t border-zinc-100 px-2 pt-2">
                <SignOutButton className="w-full rounded px-3 py-2 text-left text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900" />
              </div>
            </div>
          )}
        </div>
        {children}
      </main>
    </div>
  );
}

export function DashboardShell({
  userEmail,
  planUsage,
  children}: {
  userEmail: string | null | undefined;
  planUsage?: PlanUsage | null;
  children: React.ReactNode;
}) {
  return (
    <PlanProvider planUsage={planUsage}>
      <DashboardShellInner userEmail={userEmail} planUsage={planUsage}>
        {children}
      </DashboardShellInner>
    </PlanProvider>
  );
}
