"use client";

import Link from "next/link";
import { ToolPageLayout } from "@/components/tool-page-layout";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";

export default function SourceSyncPage() {
  return (
    <ToolPageLayout
      title="SourceSync.ai"
      description="Sync your content sources for AI training. Keep your chatbot knowledge base up to date across websites, documents, and integrations."
      breadcrumbTitle="SourceSync.ai"
      currentPath="/tools/sourcesync"
      otherTools={ALL_SEO_TOOLS}
    >
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#1a6aff]/5 to-white p-8">
          <h2 className="text-xl font-bold text-slate-900">What is SourceSync?</h2>
          <p className="mt-4 text-slate-700">
            SourceSync helps you keep your AI chatbot&apos;s knowledge base in sync with your content sources. When your website, documentation, or other sources update, SourceSync ensures your chatbot has the latest information.
          </p>
          <ul className="mt-6 space-y-2 text-slate-700">
            <li className="flex items-center gap-2">
              <span className="text-[#1a6aff]">✓</span> Automatic content sync from websites
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#1a6aff]">✓</span> Document upload and refresh
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#1a6aff]">✓</span> Schedule-based updates
            </li>
            <li className="flex items-center gap-2">
              <span className="text-[#1a6aff]">✓</span> Integration with SiteBotGPT
            </li>
          </ul>
        </div>
        <div className="text-center">
          <p className="text-slate-600">SourceSync is built into SiteBotGPT. Create a bot and add your sources to get started.</p>
          <Link href="/signup" className="mt-6 inline-flex rounded-xl bg-[#1a6aff] px-8 py-3 font-semibold text-white shadow-lg hover:bg-[#0d5aeb]">
            Get started with SiteBotGPT
          </Link>
        </div>
      </div>
    </ToolPageLayout>
  );
}
