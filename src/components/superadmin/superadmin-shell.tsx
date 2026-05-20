"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  LayoutDashboard,
  Mail,
  Menu,
  Shield,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { SignOutButton } from "@/components/sign-out-button";

const NAV = [
  { href: "/superadmin", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/superadmin/smtp", label: "SMTP", icon: Mail, exact: false },
  { href: "/superadmin/analytics", label: "Analytics", icon: BarChart3, exact: false },
] as const;

export function SuperadminShell({
  userEmail,
  children,
}: {
  userEmail?: string | null;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRefMobile = useRef<HTMLDivElement>(null);
  const profileRefDesktop = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node;
      const inside =
        (profileRefMobile.current?.contains(target) ?? false) ||
        (profileRefDesktop.current?.contains(target) ?? false);
      if (!inside) setProfileOpen(false);
    }
    if (profileOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [profileOpen]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function isActive(href: string, exact: boolean) {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <header className="fixed inset-x-0 top-0 z-50 flex h-14 items-center gap-3 border-b border-violet-500/20 bg-slate-950 px-4 md:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-white/5 hover:text-white"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link href="/superadmin" className="flex min-w-0 flex-1 items-center gap-2">
          <Shield className="h-5 w-5 shrink-0 text-violet-400" />
          <span className="truncate text-sm font-semibold text-white">Admin Console</span>
        </Link>
        <div className="relative shrink-0" ref={profileRefMobile}>
          <button
            type="button"
            onClick={() => setProfileOpen((o) => !o)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-500/20 text-sm font-medium text-violet-200"
            aria-label="Account menu"
            aria-expanded={profileOpen}
          >
            {(userEmail?.[0] ?? "A").toUpperCase()}
          </button>
          {profileOpen && (
            <div className="absolute right-0 top-full z-[100] mt-2 w-56 rounded-xl border border-white/10 bg-slate-900 py-2 shadow-xl">
              <div className="truncate px-4 py-2 text-sm text-slate-300">{userEmail ?? "Admin"}</div>
              <div className="border-t border-white/10 px-2 pt-2">
                <SignOutButton className="w-full rounded-lg px-3 py-2 text-left text-sm text-slate-400 hover:bg-white/10 hover:text-white" />
              </div>
            </div>
          )}
        </div>
      </header>

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-slate-950 transition-transform duration-200 ease-out md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-white/10 px-4">
          <Link href="/superadmin" className="flex min-w-0 items-center gap-2.5">
            <span className="relative flex h-8 w-[120px] shrink-0 overflow-hidden">
              <Image
                src="/sitebotgpt_logowhite1.jpg"
                alt="SiteBotGPT"
                fill
                className="object-contain object-left"
                sizes="120px"
              />
            </span>
          </Link>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-lg p-2 text-slate-400 hover:bg-white/5 hover:text-white md:hidden"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="border-b border-white/10 px-4 py-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1">
            <Shield className="h-3.5 w-3.5 text-violet-400" />
            <span className="text-xs font-semibold uppercase tracking-wide text-violet-300">Superadmin</span>
          </div>
          <p className="mt-2 text-xs leading-relaxed text-slate-500">Platform-wide settings and metrics</p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-slate-500">Menu</p>
          {NAV.map(({ href, label, icon: Icon, exact }) => {
            const active = isActive(href, exact);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-violet-500/15 text-white ring-1 ring-violet-500/25"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                )}
              >
                <Icon
                  className={cn("h-5 w-5 shrink-0", active ? "text-violet-400" : "text-slate-500 group-hover:text-slate-300")}
                />
                {label}
                {active && <ChevronRight className="ml-auto h-4 w-4 text-violet-400/80" />}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 border-t border-white/10 p-3">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ChevronRight className="h-4 w-4 rotate-180" />
            Back to dashboard
          </Link>
          <div className="hidden px-3 py-2 md:block">
            <p className="truncate text-xs text-slate-500">{userEmail}</p>
            <SignOutButton className="mt-2 text-xs text-slate-400 hover:text-white" />
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col md:pl-64">
        <header className="sticky top-0 z-30 hidden h-14 items-center justify-end border-b border-zinc-200/80 bg-white/80 px-6 backdrop-blur-md md:flex">
          <div className="relative" ref={profileRefDesktop}>
            <button
              type="button"
              onClick={() => setProfileOpen((o) => !o)}
              className="flex items-center gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm shadow-sm transition-colors hover:border-zinc-300"
              aria-expanded={profileOpen}
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
                {(userEmail?.[0] ?? "A").toUpperCase()}
              </span>
              <span className="max-w-[200px] truncate text-zinc-700">{userEmail ?? "Admin"}</span>
            </button>
            {profileOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 rounded-xl border border-zinc-200 bg-white py-2 shadow-lg">
                <div className="truncate px-4 py-2 text-sm text-zinc-600">{userEmail ?? "Admin"}</div>
                <div className="border-t border-zinc-100 px-2 pt-2">
                  <SignOutButton className="w-full rounded-lg px-3 py-2 text-left text-sm text-zinc-600 hover:bg-zinc-50" />
                </div>
              </div>
            )}
          </div>
        </header>

        <main className="flex-1 pt-14 md:pt-0">
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
