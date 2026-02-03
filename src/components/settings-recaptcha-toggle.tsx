"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SettingsRecaptchaToggle() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch current status on mount
  useEffect(() => {
    fetchStatus();
  }, []);

  async function fetchStatus() {
    try {
      const res = await fetch("/api/admin/recaptcha-toggle");
      if (res.ok) {
        const data = await res.json();
        setEnabled(data.enabled);
      }
    } catch {
      // Silently fail - component will show loading state
    }
  }

  async function handleToggle() {
    if (enabled === null) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/recaptcha-toggle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled })});

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update setting");
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEnabled(data.enabled);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (enabled === null) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>reCAPTCHA Protection</CardTitle>
          <CardDescription>Enable or disable Google reCAPTCHA v3</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-600">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>reCAPTCHA Protection</CardTitle>
        <CardDescription>
          Enable or disable Google reCAPTCHA v3 for signup, login, contact form, and password reset.
          When disabled, forms will work normally without reCAPTCHA verification.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}
        <div className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3">
          <div>
            <p className="font-medium text-slate-900">
              reCAPTCHA v3 is {enabled ? "enabled" : "disabled"}
            </p>
            <p className="text-sm text-slate-500">
              {enabled
                ? "Forms are protected with Google reCAPTCHA verification"
                : "Forms work without reCAPTCHA verification"}
            </p>
          </div>
          <Button
            onClick={handleToggle}
            disabled={loading}
            variant={enabled ? "outline" : "default"}
            className={enabled ? "" : "bg-[#1a6aff] hover:bg-[#0d5aeb]"}
          >
            {loading ? "Updating..." : enabled ? "Disable" : "Enable"}
          </Button>
        </div>
        <p className="text-xs text-slate-500">
          Changes take effect immediately. No restart required.
        </p>
      </CardContent>
    </Card>
  );
}
