"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

export type FieldType = "textarea" | "text" | "select" | "number";

export interface FieldConfig {
  key: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  options?: { value: string; label: string }[];
  defaultValue?: string | number;
  rows?: number;
}

interface AIGeneratorToolProps {
  apiPath: string;
  buttonLabel?: string;
  fields: FieldConfig[];
}

export function AIGeneratorTool({ apiPath, buttonLabel = "Generate", fields }: AIGeneratorToolProps) {
  const [values, setValues] = useState<Record<string, string | number>>(() => {
    const init: Record<string, string | number> = {};
    for (const f of fields) {
      if (f.defaultValue !== undefined) init[f.key] = f.defaultValue;
      else if (f.type === "number") init[f.key] = 5;
      else if (f.type === "select" && f.options?.length) init[f.key] = f.options[0].value;
      else init[f.key] = "";
    }
    return init;
  });
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key: string, value: string | number) => {
    setValues((p) => ({ ...p, [key]: value }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, unknown> = {};
    for (const f of fields) {
      const v = values[f.key];
      if (f.required && (v === undefined || v === "")) {
        setError(`${f.label} is required`);
        return;
      }
      if (v !== undefined && v !== "") {
        payload[f.key] = f.type === "number" ? Number(v) : String(v);
      }
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(apiPath, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)});
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      setResult(data.result || "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {fields.map((f) => (
        <div key={f.key}>
          <label htmlFor={f.key} className="block text-sm font-medium text-slate-700">
            {f.label} {f.required && "*"}
          </label>
          {f.type === "textarea" && (
            <textarea
              id={f.key}
              value={String(values[f.key] ?? "")}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              rows={f.rows ?? 4}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            />
          )}
          {f.type === "text" && (
            <input
              type="text"
              id={f.key}
              value={String(values[f.key] ?? "")}
              onChange={(e) => handleChange(f.key, e.target.value)}
              placeholder={f.placeholder}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            />
          )}
          {f.type === "select" && (
            <select
              id={f.key}
              value={String(values[f.key] ?? "")}
              onChange={(e) => handleChange(f.key, e.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            >
              {f.options?.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          )}
          {f.type === "number" && (
            <input
              type="number"
              id={f.key}
              min={3}
              max={15}
              value={Number(values[f.key] ?? 5)}
              onChange={(e) => handleChange(f.key, e.target.valueAsNumber || 5)}
              className="mt-2 w-full max-w-[120px] rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            />
          )}
        </div>
      ))}

      {error && (
        <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Generating..." : buttonLabel}
      </button>

      {result && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Result</h2>
            <CopyButton text={result} className="mt-0 border-slate-300" />
          </div>
          <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap p-6 font-sans text-sm text-slate-700">
            {result}
          </pre>
        </div>
      )}
    </form>
  );
}
