"use client";

import { useState, useRef } from "react";

type Variant = "text" | "url" | "file" | "fileOrPaste";

interface ChatWithContentUIProps {
  apiPath: string;
  variant: Variant;
  contentLabel?: string;
  contentPlaceholder?: string;
  accept?: string;
}

export function ChatWithContentUI({
  apiPath,
  variant,
  contentLabel = "Content",
  contentPlaceholder = "Paste your text here...",
  accept = ".pdf,.doc,.docx,.txt"}: ChatWithContentUIProps) {
  const [content, setContent] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!question.trim()) {
      setError("Enter a question");
      return;
    }
    if (variant === "text" || variant === "url" || variant === "fileOrPaste") {
      if (variant === "text" && !content.trim()) {
        setError("Paste some text first");
        return;
      }
      if (variant === "url" && !content.trim()) {
        setError("Enter a website URL");
        return;
      }
      if (variant === "fileOrPaste" && !content.trim() && !file) {
        setError("Paste text or upload a file");
        return;
      }
    }
    if ((variant === "file" || (variant === "fileOrPaste" && file)) && !file) {
      setError("Upload a file");
      return;
    }

    setLoading(true);
    try {
      if (variant === "file" || (variant === "fileOrPaste" && file)) {
        const form = new FormData();
        form.append("file", file!);
        form.append("question", question.trim());
        const res = await fetch(apiPath, { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setAnswer(data.answer || "");
      } else {
        const payload = variant === "url" ? { url: content.trim(), question: question.trim() } : { content: content.trim(), question: question.trim() };
        const res = await fetch(apiPath, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)});
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed");
        setAnswer(data.answer || "");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {(variant === "text" || variant === "url" || variant === "fileOrPaste") && (
        <div>
          <label className="block text-sm font-medium text-slate-700">{contentLabel}</label>
          {variant === "url" ? (
            <input
              type="url"
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(""); }}
              placeholder="https://example.com"
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            />
          ) : (
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setError(""); }}
              placeholder={contentPlaceholder}
              rows={8}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
            />
          )}
        </div>
      )}
      {variant === "file" && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Upload file</label>
          <input
            ref={fileRef}
            type="file"
            accept={accept}
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(""); }}
            className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
          />
          {file && <p className="mt-1 text-sm text-slate-600">{file.name}</p>}
        </div>
      )}
      {variant === "fileOrPaste" && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700">Paste text or upload file</label>
            <textarea
              value={content}
              onChange={(e) => { setContent(e.target.value); setFile(null); setError(""); }}
              placeholder={contentPlaceholder}
              rows={6}
              className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3"
            />
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept={accept}
              onChange={(e) => { setFile(e.target.files?.[0] ?? null); if (e.target.files?.[0]) setContent(""); setError(""); }}
              className="w-full rounded-xl border border-slate-300 px-4 py-3"
            />
            {file && <p className="mt-1 text-sm text-slate-600">{file.name}</p>}
          </div>
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">Your question</label>
        <input
          type="text"
          value={question}
          onChange={(e) => { setQuestion(e.target.value); setError(""); }}
          placeholder="Ask anything about the content..."
          className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 focus:border-[#1a6aff] focus:outline-none focus:ring-2 focus:ring-[#1a6aff]/20"
        />
      </div>
      {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="rounded-xl bg-[#1a6aff] px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-[#0d5aeb] disabled:opacity-50"
      >
        {loading ? "Thinking..." : "Ask"}
      </button>
      {answer && (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-lg">
          <h3 className="mb-3 font-semibold text-slate-900">Answer</h3>
          <p className="whitespace-pre-wrap text-slate-700">{answer}</p>
        </div>
      )}
    </form>
  );
}
