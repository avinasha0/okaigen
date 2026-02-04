"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SettingsBrandingForm({
  initialCustomBrandingName,
}: {
  initialCustomBrandingName: string | null;
}) {
  const [value, setValue] = useState(initialCustomBrandingName ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customBrandingName: value.trim() || null }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json().catch(() => ({}));
        alert(data.error ?? "Failed to save");
      }
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="customBrandingName" className="text-sm font-medium text-gray-700">
          Custom branding name
        </Label>
        <p className="mt-1 text-xs text-slate-500">
          Replace &quot;SiteBotGPT&quot; in the chat widget with your own name (e.g. your company name). Leave empty to show &quot;SiteBotGPT&quot;.
        </p>
        <Input
          id="customBrandingName"
          type="text"
          maxLength={100}
          placeholder="e.g. Acme Inc"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="mt-2 max-w-sm"
        />
      </div>
      <Button type="submit" disabled={saving}>
        {saving ? "Saving…" : saved ? "Saved" : "Save"}
      </Button>
      <p className="text-xs text-slate-500">
        To hide the &quot;Powered by&quot; line entirely (white-label), use the per-bot toggle on each bot&apos;s page under Embed code.
      </p>
    </form>
  );
}
