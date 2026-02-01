"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandIcon } from "@/components/brand-icon";

/** Blue CTA card: dashboard variant (upgrade) vs marketing variant (get started free). */
export function FooterCtaSection() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  return (
    <div className="flex flex-col items-center text-center">
      <div className="mb-6 text-white sm:mb-8">
        <BrandIcon size="3xl" className="h-16 w-16 sm:h-20 sm:w-20 lg:h-24 lg:w-24" />
      </div>

      {isDashboard ? (
        <>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Unlock more power for your chatbot
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            Get API access, webhooks, advanced analytics, and higher limits. Scale conversations and capture every lead.
          </p>
          <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-white px-6 py-3.5 text-sm font-semibold text-[#1a6aff] transition hover:bg-white/95 active:scale-[0.98] sm:px-8 sm:py-4 sm:text-base"
            >
              View plans
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
          <p className="mt-8 text-sm text-white/90">
            No credit card required • Cancel anytime
          </p>
        </>
      ) : (
        <>
          <h2 className="font-heading text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
            Ready to automate your support?
          </h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">
            Try an AI chatbot trained on your content. Set up in minutes, not days.
          </p>
          <div className="mt-8 flex w-full max-w-sm flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-white px-6 py-3.5 text-sm font-semibold text-[#1a6aff] transition hover:bg-white/95 active:scale-[0.98] sm:px-8 sm:py-4 sm:text-base"
            >
              Get started free
              <svg className="h-4 w-4 sm:h-5 sm:w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/demo"
              className="inline-flex items-center justify-center gap-2 rounded-lg border-2 border-white bg-transparent px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-white/10 active:scale-[0.98] sm:px-8 sm:py-4 sm:text-base"
            >
              Book a demo
            </Link>
          </div>
          <ul className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-white/90 sm:gap-x-8">
            <li className="inline-flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No credit card required
            </li>
            <li className="inline-flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Forever free plan available
            </li>
            <li className="inline-flex items-center gap-2">
              <svg className="h-5 w-5 shrink-0 text-emerald-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Cancel anytime
            </li>
          </ul>
        </>
      )}
    </div>
  );
}
