"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import type { PlanUsage } from "@/lib/plan-usage";

interface NewBotButtonProps {
  canCreate: boolean;
  planUsage: PlanUsage | null;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
}

export function NewBotButton({ canCreate, planUsage, variant = "default", size = "default" }: NewBotButtonProps) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    if (!canCreate) {
      e.preventDefault();
      setShowModal(true);
    } else {
      router.push("/dashboard/bots/new");
    }
  };

  const buttonText = size === "sm" ? "Add bot" : "New bot";
  const buttonClass = variant === "outline" 
    ? "w-full border-zinc-300 sm:w-auto"
    : "w-full bg-[#1a6aff] hover:bg-[#1557e0] sm:w-auto";

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={buttonClass}
        onClick={handleClick}
      >
        {buttonText}
      </Button>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setShowModal(false)}>
          <div className="relative mx-4 max-w-md rounded-2xl bg-white p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 text-zinc-400 hover:text-zinc-600"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h3 className="mb-2 text-xl font-semibold text-zinc-900">Bot limit reached</h3>
            <p className="mb-6 text-sm text-zinc-600">
              You've reached your plan limit of <strong>{planUsage?.totalBots ?? 0} bot{planUsage?.totalBots !== 1 ? 's' : ''}</strong>. 
              {' '}Upgrade your plan to create more bots and unlock additional features.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/pricing" className="flex-1">
                <Button className="w-full bg-[#1a6aff] hover:bg-[#1557e0]">
                  View plans
                </Button>
              </Link>
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
