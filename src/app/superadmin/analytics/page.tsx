"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { SuperadminPageHeader } from "@/components/superadmin/page-header";
import { SuperadminAlertBanner } from "@/components/superadmin/alert-banner";

type ApiState =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; message: string }
  | { kind: "success"; message: string };

export default function SuperadminAnalyticsPage() {
  const [measurementId, setMeasurementId] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [state, setState] = useState<ApiState>({ kind: "idle" });

  const isValid = useMemo(() => {
    const v = measurementId.trim();
    return v.length === 0 || /^G-[A-Z0-9]+$/i.test(v);
  }, [measurementId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/superadmin/analytics", { cache: "no-store" });
        if (!res.ok) throw new Error(`Failed to load (${res.status})`);
        const data = (await res.json()) as { measurementId: string | null };
        if (cancelled) return;
        setMeasurementId(data.measurementId ?? "");
        setLoaded(true);
      } catch (e) {
        if (cancelled) return;
        setState({ kind: "error", message: e instanceof Error ? e.message : "Failed to load" });
        setLoaded(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function save() {
    setState({ kind: "loading" });
    try {
      const res = await fetch("/api/superadmin/analytics", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ measurementId }),
      });
      if (!res.ok) throw new Error(`Save failed (${res.status})`);
      setState({
        kind: "success",
        message: "Saved. Changes apply on the next page load — no redeploy required.",
      });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Save failed" });
    }
  }

  return (
    <>
      <SuperadminPageHeader
        title="Google Analytics"
        description="Set the GA4 Measurement ID injected across the public site and application shell."
        breadcrumbs={[
          { label: "Superadmin", href: "/superadmin" },
          { label: "Analytics" },
        ]}
      />

      {state.kind === "error" ? (
        <div className="mb-6">
          <SuperadminAlertBanner variant="error" message={state.message} />
        </div>
      ) : null}
      {state.kind === "success" ? (
        <div className="mb-6">
          <SuperadminAlertBanner variant="success" message={state.message} />
        </div>
      ) : null}

      <Card className="border-zinc-200/80 shadow-sm">
        <CardHeader className="border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-500/10 text-violet-600">
              <BarChart3 className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg">GA4 Measurement ID</CardTitle>
              <CardDescription>
                Format: <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs">G-XXXXXXXXXX</code>. Leave empty to
                disable tracking.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-5 pt-6">
          <div className="max-w-md space-y-2">
            <Label htmlFor="measurementId">Measurement ID</Label>
            <Input
              id="measurementId"
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              disabled={!loaded || state.kind === "loading"}
            />
            {!isValid ? (
              <p className="text-xs text-red-600">Expected format: G-XXXXXXXXXX (letters and numbers after G-)</p>
            ) : null}
          </div>

          <Button onClick={save} disabled={!loaded || state.kind === "loading" || !isValid}>
            {state.kind === "loading" ? "Saving…" : "Save measurement ID"}
          </Button>

          {!loaded && state.kind !== "error" ? (
            <p className="text-sm text-zinc-400">Loading current configuration…</p>
          ) : null}
        </CardContent>
      </Card>
    </>
  );
}
