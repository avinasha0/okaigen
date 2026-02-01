"use client";

import { useState } from "react";
import type { PlanName } from "@/lib/plans-config";

type Gateway = "stripe" | "razorpay" | "paypal";

const GATEWAYS: { id: Gateway; label: string; region: string; api: string }[] = [
  { id: "razorpay", label: "Razorpay", region: "India (INR)", api: "/api/razorpay/create-subscription" },
  { id: "paypal", label: "PayPal", region: "International", api: "/api/paypal/create-subscription" },
  { id: "stripe", label: "Stripe", region: "International (card)", api: "/api/stripe/create-checkout-session" },
];

type CheckoutPaymentModalProps = {
  planName: string;
  interval: "monthly" | "yearly";
  onClose: () => void;
};

export function CheckoutPaymentModal({
  planName,
  interval,
  onClose,
}: CheckoutPaymentModalProps) {
  const [loading, setLoading] = useState<Gateway | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleGateway(gateway: Gateway) {
    const g = GATEWAYS.find((x) => x.id === gateway);
    if (!g) return;
    setLoading(gateway);
    setError(null);
    try {
      const res = await fetch(g.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planName, interval }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }
      const url = data.url ?? data.shortUrl ?? data.approvalUrl ?? data.approval_url;
      if (url) {
        window.location.href = url;
        return;
      }
      setError("No checkout URL returned");
    } catch {
      setError("Checkout failed");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
      >
        <h2 id="payment-modal-title" className="text-lg font-semibold text-slate-900">
          Choose payment method
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {planName} · {interval === "yearly" ? "Yearly" : "Monthly"}
        </p>
        <div className="mt-6 space-y-3">
          {GATEWAYS.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => handleGateway(g.id)}
              disabled={!!loading}
              className="flex w-full items-center justify-between rounded-xl border-2 border-slate-200 bg-slate-50 px-4 py-3 text-left transition-colors hover:border-[#1a6aff] hover:bg-[#1a6aff]/5 disabled:opacity-70"
            >
              <span>
                <span className="font-medium text-slate-900">{g.label}</span>
                <span className="ml-2 text-sm text-slate-500">({g.region})</span>
              </span>
              {loading === g.id ? (
                <span className="text-sm text-slate-500">Redirecting…</span>
              ) : (
                <span className="text-[#1a6aff]">→</span>
              )}
            </button>
          ))}
        </div>
        {error && (
          <p className="mt-4 text-center text-sm text-red-600">{error}</p>
        )}
        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-xl border border-slate-300 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
