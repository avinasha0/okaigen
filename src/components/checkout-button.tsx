"use client";

import { useState } from "react";
import type { PlanName } from "@/lib/plans-config";
import { CheckoutPaymentModal } from "@/components/checkout-payment-modal";

const PAID_PLANS: PlanName[] = ["Growth", "Scale"];

type CheckoutButtonProps = {
  planName: string;
  interval: "monthly" | "yearly";
  currentPlanName?: string | null;
  variant?: "primary" | "secondary";
  children: React.ReactNode;
  className?: string;
};

export function CheckoutButton({
  planName,
  interval,
  currentPlanName,
  variant = "primary",
  children,
  className = "",
}: CheckoutButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const isPaid = PAID_PLANS.includes(planName as PlanName);
  const isCurrent = currentPlanName === planName;

  function handleClick(e: React.MouseEvent) {
    if (!isPaid || isCurrent) return;
    e.preventDefault();
    setShowModal(true);
  }

  if (planName === "Starter" || planName === "Enterprise") {
    return null;
  }

  if (isCurrent) {
    return (
      <div
        className={`flex w-full items-center justify-center rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3.5 text-sm font-semibold text-slate-500 ${className}`}
      >
        Current plan
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center justify-center rounded-xl px-4 py-3.5 text-sm font-semibold transition-all ${
          variant === "primary"
            ? "bg-[#1a6aff] text-white shadow-lg shadow-[#1a6aff]/25 hover:bg-[#0d5aeb]"
            : "border-2 border-slate-300 text-slate-700 hover:border-[#1a6aff] hover:bg-[#1a6aff]/5 hover:text-[#1a6aff]"
        } ${className}`}
      >
        {children}
      </button>
      {showModal && (
        <CheckoutPaymentModal
          planName={planName}
          interval={interval}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
