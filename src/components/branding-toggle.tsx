"use client";

import Link from "next/link";
import { useState } from "react";

export function BrandingToggle({
  botId,
  initialRemoveBranding,
  hasBrandingAccess,
}: {
  botId: string;
  initialRemoveBranding: boolean;
  hasBrandingAccess: boolean;
}) {
  const [removeBranding, setRemoveBranding] = useState(initialRemoveBranding);
  const [saving, setSaving] = useState(false);

  async function handleToggle(checked: boolean) {
    setSaving(true);
    try {
      const res = await fetch(`/api/bots/${botId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ removeBranding: checked }),
      });
      if (res.ok) {
        setRemoveBranding(checked);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to update");
      }
    } catch {
      alert("Failed to update");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium text-slate-900">Remove SiteBotGPT branding</p>
        <p className="text-sm text-slate-500">
          Hide &quot;Powered by&quot; in the chat widget (white-label). Custom branding name is set in{" "}
          <Link href="/dashboard/settings" className="font-medium text-[#1a6aff] hover:underline">
            Settings → Branding
          </Link>
          .
          {!hasBrandingAccess && " Scale and Enterprise include this; Growth can add it as an add-on."}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {hasBrandingAccess ? (
          <label className="relative inline-flex cursor-pointer items-center">
            <input
              type="checkbox"
              checked={removeBranding}
              disabled={saving}
              onChange={(e) => handleToggle(e.target.checked)}
              className="peer sr-only"
            />
            <div className="peer h-6 w-11 rounded-full bg-slate-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-slate-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#1a6aff] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-disabled:opacity-50" />
            <span className="ml-3 text-sm font-medium text-slate-700">
              {removeBranding ? "Hidden" : "Shown"}
            </span>
          </label>
        ) : (
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
          >
            Get access in Settings
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
}
