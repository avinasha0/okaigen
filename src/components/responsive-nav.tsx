"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const navLinks = [
  { href: "/#features", label: "Features" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/tools", label: "Tools" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
];

export function ResponsiveNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center justify-start" aria-label="SiteBotGPT home">
          <span className="relative flex h-14 min-h-[56px] w-[200px] overflow-hidden bg-transparent sm:h-14 sm:min-h-[56px] sm:w-[200px] md:h-16 md:min-h-[64px] md:w-[260px] lg:w-[360px]">
            <Image src="/sitebotgpt_logob.png" alt="SiteBotGPT" fill className="object-contain object-left" sizes="(max-width: 640px) 200px, (max-width: 768px) 200px, (max-width: 1024px) 260px, 360px" priority />
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#1a6aff]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/login"
            className="rounded-lg border-2 border-[#1a6aff] bg-white px-4 py-2 text-sm font-semibold text-[#1a6aff] transition-colors hover:bg-[#1a6aff]/5"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white shadow-md shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb]"
          >
            Get started free
          </Link>
        </nav>

        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6aff] focus-visible:ring-offset-2 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile nav drawer */}
      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#1a6aff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6aff] focus-visible:ring-offset-2"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="rounded-lg border-2 border-[#1a6aff] px-4 py-3 text-center text-sm font-semibold text-[#1a6aff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6aff] focus-visible:ring-offset-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-[#1a6aff] px-4 py-3 text-center text-sm font-semibold text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a6aff] focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              Get started free
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
