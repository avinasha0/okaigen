"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";
import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

export default function EmailSignatureGeneratorPage() {
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");

  const n = name || "Your Name";
  const t = title || "Title";
  const c = company || "Company";
  const e = email || "email@example.com";
  const html = "<p style=\"font-family:Arial;font-size:14px\"><strong>" + n + "</strong><br>" + t + "<br>" + c + "<br><a href=\"mailto:" + e + "\">" + e + "</a></p>";

  return (
    <ToolPageLayout title="Email Signature Generator" description="Create professional email signatures." breadcrumbTitle="Email Signature Generator" currentPath="/tools/email-signature-generator" otherTools={ALL_SEO_TOOLS}>
      <div className="space-y-6">
        <div className="grid gap-6 sm:grid-cols-2">
          <div><label className="block text-sm font-medium text-slate-700">Name</label><input type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></div>
          <div><label className="block text-sm font-medium text-slate-700">Title</label><input type="text" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></div>
          <div><label className="block text-sm font-medium text-slate-700">Company</label><input type="text" value={company} onChange={(e) => setCompany(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></div>
          <div><label className="block text-sm font-medium text-slate-700">Email</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3" /></div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6" dangerouslySetInnerHTML={{ __html: html }} />
        <div className="rounded-2xl border border-slate-200 bg-white shadow-lg">
          <div className="flex justify-between border-b px-6 py-4"><h2 className="font-semibold">HTML</h2><CopyButton text={html} className="mt-0" /></div>
          <pre className="overflow-auto p-6 text-xs">{html}</pre>
        </div>
      </div>
    </ToolPageLayout>
  );
}
