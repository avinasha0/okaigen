"use client";

import { useState } from "react";
import Link from "next/link";
import { PLANS } from "@/lib/plans";

export default function DashboardPricingPage() {
  const [yearly, setYearly] = useState(false);

  return (
    <div className="min-w-0 px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">
          Upgrade your plan
        </h1>
        <p className="mt-0.5 text-sm text-slate-500">
          Choose a plan that fits your needs. You can change or cancel anytime.
        </p>
      </div>

      {/* Billing toggle */}
      <div className="mb-8 flex flex-wrap items-center gap-4">
        <span className={`text-sm font-medium ${!yearly ? "text-slate-900" : "text-slate-500"}`}>
          Monthly
        </span>
        <button
          type="button"
          onClick={() => setYearly(!yearly)}
          className={`relative h-8 w-14 rounded-full transition-colors ${
            yearly ? "bg-[#1a6aff]" : "bg-slate-300"
          }`}
          aria-pressed={yearly}
        >
          <span
            className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-transform ${
              yearly ? "left-7" : "left-1"
            }`}
          />
        </button>
        <span className={`text-sm font-medium ${yearly ? "text-slate-900" : "text-slate-500"}`}>
          Yearly
        </span>
        <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          Save 20%
        </span>
      </div>

      {/* Plans grid */}
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 xl:grid-cols-4">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`relative flex flex-col rounded-2xl border-2 bg-white p-6 shadow-sm transition-all sm:p-8 ${
              plan.highlight
                ? "border-[#1a6aff] ring-2 ring-[#1a6aff]/20"
                : "border-slate-200 hover:border-slate-300"
            }`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-[#1a6aff] px-4 py-1.5 text-xs font-semibold text-white shadow">
                  Most popular
                </span>
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1 text-sm text-slate-500">{plan.description}</p>
              <div className="mt-6 flex items-baseline gap-1">
                {plan.monthlyPrice !== null ? (
                  <>
                    <span className="text-4xl font-extrabold text-slate-900">
                      ${yearly ? plan.yearlyPrice : plan.monthlyPrice}
                    </span>
                    <span className="text-slate-500">/mo</span>
                    {yearly && plan.monthlyPrice > 0 && (
                      <span className="ml-2 text-xs text-slate-400">billed yearly</span>
                    )}
                  </>
                ) : (
                  <span className="text-3xl font-extrabold text-slate-900">Custom</span>
                )}
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f, i) => {
                  const isExcluded = typeof f === "object" && f.excluded;
                  const label = typeof f === "string" ? f : f.text;
                  return (
                    <li
                      key={typeof f === "string" ? f : `${f.text}-${i}`}
                      className={`flex items-start gap-3 text-sm ${isExcluded ? "text-slate-400" : "text-slate-600"}`}
                    >
                      {isExcluded ? (
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-slate-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      ) : (
                        <svg
                          className="mt-0.5 h-5 w-5 shrink-0 text-[#1a6aff]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                          aria-hidden
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                      {label}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="mt-8">
              <Link
                href={plan.href}
                className={`flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
                  plan.highlight
                    ? "bg-[#1a6aff] text-white shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb]"
                    : "border-2 border-slate-300 text-slate-700 hover:border-[#1a6aff] hover:bg-[#1a6aff]/5 hover:text-[#1a6aff]"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-sm text-slate-500">
        No credit card required • Cancel anytime
      </p>
    </div>
  );
}
