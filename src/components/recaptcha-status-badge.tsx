"use client";

import { useRecaptchaStatus } from "@/hooks/use-recaptcha-status";

/**
 * Simple badge component to show reCAPTCHA status
 * Use this anywhere in your frontend to display status
 */
export function RecaptchaStatusBadge() {
  const { enabled, loading } = useRecaptchaStatus();

  if (loading) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-2.5 py-1 text-xs text-gray-600">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gray-400" />
        Checking...
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        enabled
          ? "bg-green-100 text-green-700"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          enabled ? "bg-green-500" : "bg-gray-400"
        }`}
      />
      reCAPTCHA: {enabled ? "Enabled" : "Disabled"}
    </span>
  );
}
