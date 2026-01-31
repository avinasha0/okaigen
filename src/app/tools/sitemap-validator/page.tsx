"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";
import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

export default function SitemapValidatorPage() {
  const [mode, setMode] = useState<"url" | "xml">("url");
  const [url, setUrl] = useState("");
  const [xml, setXml] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const body = mode === "url" ? { url: url.trim() } : { xml: xml.trim() };
      const res = await fetch("/api/tools/sitemap-validator", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setResult(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolPageLayout title="Sitemap Validator" description="Validate your XML sitemap for errors and SEO compliance." breadcrumbTitle="Sitemap Validator" currentPath="/tools/sitemap-validator" otherTools={ALL_SEO_TOOLS}>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex gap-4">
          <label className="flex items-center gap-2"><input type="radio" checked={mode === "url"} onChange={() => setMode("url")} /> URL</label>
          <label className="flex items-center gap-2"><input type="radio" checked={mode === "xml"} onChange={() => setMode("xml")} /> Paste XML</label>
        </div>
        {mode === "url" ? (
          <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com/sitemap.xml" className="w-full rounded-xl border border-slate-300 px-4 py-3" required={mode === "url"} />
        ) : (
          <textarea value={xml} onChange={(e) => setXml(e.target.value)} placeholder="Paste sitemap XML..." rows={8} className="w-full rounded-xl border border-slate-300 px-4 py-3 font-mono text-sm" required={mode === "xml"} />
        )}
        {error && <p className="text-red-600">{error}</p>}
        <button type="submit" disabled={loading} className="rounded-xl bg-[#1a6aff] px-6 py-3 text-white font-semibold">{loading ? "Validating..." : "Validate"}</button>
        {result && (
          <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
            <div className="flex justify-between border-b px-6 py-4"><h2 className="font-semibold">Report</h2><CopyButton text={result} className="mt-0" /></div>
            <pre className="max-h-[400px] overflow-auto p-6 text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </form>
    </ToolPageLayout>
  );
}
