"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function BillingPortalButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stripe/create-portal-session", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }
      if (data.url) {
        window.location.href = data.url;
        return;
      }
      setError("No billing URL returned");
    } catch {
      setError("Failed to open billing portal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="outline"
        onClick={handleClick}
        disabled={loading}
        className="bg-white"
      >
        {loading ? "Opening…" : "Manage billing"}
      </Button>
      {error && (
        <p className="text-sm text-red-600">
          {error}
          {error.includes("Subscribe") && (
            <a href="/dashboard/pricing" className="ml-1 underline">
              Go to pricing
            </a>
          )}
        </p>
      )}
    </div>
  );
}
