"use client";

import { useState, useCallback } from "react";
import { CopyButton } from "@/components/copy-button";

type InputType = "file" | "url" | "paste" | "html" | "fileOrPaste";

interface ConvertToolUIProps {
  inputType: InputType;
  accept?: string;
  apiPath: string;
  placeholder?: string;
  buttonLabel?: string;
  inputLabel?: string;
  downloadFilename?: (file: File | null, textInput: string) => string;
}

export function ConvertToolUI({
  inputType,
  accept,
  apiPath,
  placeholder = "Paste or type your content here...",
  buttonLabel = "Convert to Markdown",
  inputLabel,
  downloadFilename = (f, textInput) => {
    if (f) return (f.name.replace(/\.[^.]+$/, "") || "converted") + ".md";
    try {
      if (textInput) {
        const u = new URL(textInput);
        const name = u.pathname.split("/").filter(Boolean).pop();
        return (name?.replace(/\.[^.]+$/, "") || "converted") + ".md";
      }
    } catch {}
    return "converted.md";
  },
}: ConvertToolUIProps) {
  const [file, setFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const reset = useCallback(() => {
    setFile(null);
    setTextInput("");
    setMarkdown("");
    setError("");
  }, []);

  const doConvert = async () => {
    setLoading(true);
    setError("");
    try {
      let res: Response;
      if ((inputType === "file" || inputType === "fileOrPaste") && file) {
        const formData = new FormData();
        formData.append("file", file);
        res = await fetch(apiPath, { method: "POST", body: formData });
      } else if (inputType === "url" && textInput.trim()) {
        const key = apiPath.includes("notion") ? "url" : apiPath.includes("google") ? "url" : "url";
        res = await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            url: textInput.trim(),
            notion: textInput.trim(),
            googleDoc: textInput.trim(),
            webpage: textInput.trim(),
          }),
        });
      } else if ((inputType === "paste" || inputType === "html" || inputType === "fileOrPaste") && textInput.trim()) {
        res = await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            inputType === "html" ? { html: textInput, content: textInput } : { text: textInput, content: textInput, paste: textInput }
          ),
        });
      } else {
        setError("Please provide input first");
        setLoading(false);
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Conversion failed");
      setMarkdown(data.markdown);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Conversion failed");
    } finally {
      setLoading(false);
    }
  };

  const downloadMarkdown = () => {
    if (!markdown) return;
    const name = downloadFilename(file, textInput);
    const blob = new Blob([markdown], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = name.endsWith(".md") ? name : `${name}.md`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const f = e.dataTransfer.files[0];
      if (f) {
        const ok = !accept || accept.split(",").some((a) => {
          const t = a.trim();
          return f.type.includes(t) || f.name.toLowerCase().endsWith(t.replace(/^\*\./, "."));
        });
        if (ok) {
          setFile(f);
          setError("");
        } else {
          setError(`Please upload a supported file (${accept})`);
        }
      }
    },
    [accept]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      setError("");
    }
  };

  const hasInput = (inputType === "file" || inputType === "fileOrPaste") ? (!!file || !!textInput.trim()) : !!textInput.trim();

  return (
    <div className="space-y-6">
      {(inputType === "file" || inputType === "fileOrPaste") && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
          onDragLeave={(e) => { e.preventDefault(); setDragActive(false); }}
          className={`rounded-2xl border-2 border-dashed p-12 text-center transition-colors ${
            dragActive ? "border-[#1a6aff] bg-[#1a6aff]/5" : "border-slate-300 bg-slate-50/50 hover:border-slate-400"
          }`}
        >
          <input type="file" accept={accept} onChange={handleFileChange} className="hidden" id="file-upload" />
          {inputType === "fileOrPaste" && <p className="mt-2 text-xs text-slate-500">or paste below</p>}
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-xl bg-[#1a6aff]/10">
              <svg className="h-8 w-8 text-[#1a6aff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="mt-4 text-sm font-medium text-slate-700">
              {inputLabel || `Choose a file or drag & drop here`}
            </p>
            <p className="mt-1 text-xs text-slate-500">{accept || "Supported formats"}</p>
            {file && (
              <p className="mt-4 text-sm font-medium text-emerald-600">
                Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
              </p>
            )}
          </label>
        </div>
      )}

      {(inputType === "url" || inputType === "paste" || inputType === "html" || inputType === "fileOrPaste") && (
        <div>
          <label htmlFor="text-input" className="block text-sm font-medium text-slate-700">
            {inputLabel || (inputType === "url" ? "Enter URL" : "Paste your content")}
          </label>
          <textarea
            id="text-input"
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder={placeholder}
            rows={inputType === "url" ? 2 : 8}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
          />
        </div>
      )}

      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

      <div className="flex flex-wrap gap-3">
        <button
          onClick={doConvert}
          disabled={!hasInput || loading}
          className="rounded-xl bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#1a6aff]/25 transition-all hover:bg-[#0d5aeb] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Converting..." : buttonLabel}
        </button>
        <button
          onClick={reset}
          className="rounded-xl border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Reset
        </button>
      </div>

      {markdown && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Markdown output</h2>
            <div className="flex gap-2">
              <CopyButton text={markdown} className="mt-0 border-slate-300" />
              <button
                onClick={downloadMarkdown}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download .md
              </button>
            </div>
          </div>
          <pre className="max-h-[400px] overflow-auto whitespace-pre-wrap p-6 font-sans text-sm text-slate-700">
            {markdown}
          </pre>
        </div>
      )}
    </div>
  );
}
