"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface SimpleNavProps {
  links: { href: string; label: string }[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function SimpleNav({ links, ctaLabel = "Start free", ctaHref = "/signup" }: SimpleNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 min-w-0 max-w-6xl items-center justify-between gap-4 px-4">
        <Link href="/" className="flex min-w-0 shrink items-center justify-start" aria-label="SiteBotGPT home">
          <span className="relative flex h-12 min-h-[48px] w-full max-w-[140px] shrink overflow-hidden bg-transparent sm:max-w-[180px] sm:h-14 sm:min-h-[56px] md:max-w-[260px] md:h-16 md:min-h-[64px] md:w-[260px] md:shrink-0 lg:w-[360px]">
            <Image src="/sitebotgpt.jpg" alt="SiteBotGPT" fill className="object-contain object-left" sizes="(max-width: 640px) 140px, (max-width: 768px) 180px, (max-width: 1024px) 260px, 360px" priority unoptimized />
          </span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex lg:gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-semibold text-slate-600 transition-colors hover:text-[#1a6aff]"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={ctaHref}
            className="rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0d5aeb]"
          >
            {ctaLabel}
          </Link>
        </nav>

        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 md:hidden"
          aria-label="Toggle menu"
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

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="flex flex-col gap-1 px-4 py-4">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-4 py-3 text-sm text-slate-600 transition-colors hover:bg-slate-50 hover:text-[#1a6aff]"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={ctaHref}
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-[#1a6aff] px-4 py-3 text-center text-sm font-medium text-white"
            >
              {ctaLabel}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
