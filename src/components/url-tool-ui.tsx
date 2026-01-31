"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

interface UrlToolUIProps {
  apiPath: string;
  title?: string;
  placeholder?: string;
  extraFields?: { key: string; label: string; type: "number" | "select"; options?: { value: string; label: string }[]; default?: number }[];
}

export function UrlToolUI({ apiPath, title = "Website URL", placeholder = "https://example.com", extraFields = [] }: UrlToolUIProps) {
  const [url, setUrl] = useState("");
  const [extra, setExtra] = useState<Record<string, string | number>>(() => {
    const o: Record<string, string | number> = {};
    extraFields.forEach((f) => (o[f.key] = f.default ?? (f.type === "number" ? 50 : "")));
    return o;
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError("URL is required");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const body: Record<string, unknown> = { url: url.trim() };
      extraFields.forEach((f) => (body[f.key] = extra[f.key]));
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result || data.xml || JSON.stringify(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-slate-700">{title}</label>
        <input
          type="url"
          value={url}
          onChange={(e) => { setUrl(e.target.value); setError(""); }}
          placeholder={placeholder}
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
        />
      </div>
      {extraFields.map((f) => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-slate-700">{f.label}</label>
          {f.type === "number" ? (
            <input
              type="number"
              min={1}
              max={500}
              value={Number(extra[f.key] ?? 50)}
              onChange={(e) => setExtra((p) => ({ ...p, [f.key]: e.target.valueAsNumber || 50 }))}
              className="mt-2 max-w-[120px] rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            />
          ) : (
            <select
              value={String(extra[f.key] ?? "")}
              onChange={(e) => setExtra((p) => ({ ...p, [f.key]: e.target.value }))}
              className="mt-2 w-full max-w-xs rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            >
              {f.options?.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          )}
        </div>
      ))}
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] disabled:opacity-50"
      >
        {loading ? "Processing..." : "Analyze"}
      </button>
      {result && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Result</h2>
            <CopyButton text={result} className="mt-0 border-slate-300" />
          </div>
          <pre className="max-h-[500px] overflow-auto whitespace-pre-wrap p-6 font-sans text-sm text-slate-700">
            {result}
          </pre>
        </div>
      )}
    </form>
  );
}
