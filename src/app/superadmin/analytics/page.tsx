"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

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
      setState({ kind: "success", message: "Saved. Deploy not required (takes effect on next request)." });
    } catch (e) {
      setState({ kind: "error", message: e instanceof Error ? e.message : "Save failed" });
    }
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Analytics</h1>
        <p className="mt-0.5 text-sm text-slate-500">Configure Google Analytics Measurement ID.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Google Analytics (GA4)</CardTitle>
          <CardDescription>Set the Measurement ID (looks like G-XXXXXXXXXX).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <div className="text-sm font-medium text-slate-700">Measurement ID</div>
            <Input
              value={measurementId}
              onChange={(e) => setMeasurementId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              spellCheck={false}
              autoCapitalize="none"
              autoCorrect="off"
              disabled={!loaded || state.kind === "loading"}
            />
            {!isValid ? <div className="text-xs text-rose-600">Expected format: G-XXXXXXXXXX</div> : null}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={save} disabled={!loaded || state.kind === "loading" || !isValid}>
              Save
            </Button>
            <Link className="text-sm font-medium text-[#1a6aff] hover:underline" href="/superadmin">
              Back to superadmin
            </Link>
          </div>

          {state.kind === "error" ? <div className="text-sm text-rose-600">{state.message}</div> : null}
          {state.kind === "success" ? <div className="text-sm text-emerald-700">{state.message}</div> : null}
        </CardContent>
      </Card>
    </div>
  );
}

