"use client";

import { useState } from "react";
import { CopyButton } from "@/components/copy-button";

const PLATFORMS = [
  { id: "wordpress", label: "WordPress" },
  { id: "wix", label: "Wix" },
  { id: "squarespace", label: "Squarespace" },
  { id: "shopify", label: "Shopify" },
  { id: "gtm", label: "Google Tag Manager" },
  { id: "manual", label: "Manual / HTML" },
] as const;

const INSTRUCTIONS: Record<(typeof PLATFORMS)[number]["id"], string[]> = {
  wordpress: [
    "Easiest: Install the 'Insert Headers and Footers' plugin (Plugins → Add New → search for it).",
    "Go to Settings → Insert Headers and Footers in your WordPress sidebar.",
    "Paste the embed code in the 'Scripts in Footer' box.",
    "Click Save. The chat will appear on your site.",
    "No plugin: Go to Appearance → Theme File Editor → footer.php, scroll to the bottom, paste the code before the last few lines, and click Update File.",
  ],
  wix: [
    "Log in to your Wix account and open your site in the editor.",
    "Click Settings (gear icon) in the left sidebar.",
    "Click Custom Code under Advanced.",
    "Click + Add Code and choose 'Body - end'.",
    "Paste the embed code, give it a name (e.g. 'Atlas Chat'), and click Apply.",
  ],
  squarespace: [
    "Log in to Squarespace and go to your site.",
    "Click Settings, then Advanced, then Code Injection.",
    "In the Footer section, paste the embed code.",
    "Click Save.",
  ],
  shopify: [
    "Log in to your Shopify admin.",
    "Go to Online Store → Themes → Actions → Edit code.",
    "Under Layout, click theme.liquid.",
    "Scroll to the very bottom of the file. Paste the embed code before the last line.",
    "Click Save.",
  ],
  gtm: [
    "Log in to Google Tag Manager and open your container.",
    "Click New → Tag. Name it (e.g. 'SiteBotGPT Chat Widget').",
    "Choose Tag type: Custom HTML.",
    "Paste the embed code in the HTML field.",
    "Set Trigger to 'All Pages' (or the pages where you want the chat).",
    "Save and publish your container.",
  ],
  manual: [
    "Open your website's HTML file (or your hosting file manager).",
    "Scroll to the very bottom of the file.",
    "Paste the embed code before the last line.",
    "Save the file. The chat bubble will appear on your site.",
  ]};

function buildDownloadContent(platformId: string, embedCode: string): string {
  const label = PLATFORMS.find((p) => p.id === platformId)?.label || "Your site";
  const steps = INSTRUCTIONS[platformId as keyof typeof INSTRUCTIONS] || INSTRUCTIONS.manual;
  return [
    `SiteBotGPT - How to add the chat widget to ${label}`,
    "",
    "EMBED CODE (copy and paste this):",
    "--------------------------------",
    embedCode,
    "",
    "STEPS:",
    "------",
    ...steps.map((s, i) => `${i + 1}. ${s}`),
    "",
    "Need help? Log in to your dashboard for more options.",
  ].join("\n");
}

export function EmbedInstructions({ embedCode }: { embedCode: string }) {
  const [platform, setPlatform] = useState<(typeof PLATFORMS)[number]["id"]>("wordpress");
  const steps = INSTRUCTIONS[platform];

  function handleDownload() {
    const content = buildDownloadContent(platform, embedCode);
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sitebotgpt-embed-instructions-${platform}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="platform" className="block text-sm font-medium text-zinc-700">
          How to add to your site
        </label>
        <select
          id="platform"
          value={platform}
          onChange={(e) => setPlatform(e.target.value as (typeof PLATFORMS)[number]["id"])}
          className="mt-1.5 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900 focus:border-[#1a6aff] focus:outline-none focus:ring-1 focus:ring-[#1a6aff]"
        >
          {PLATFORMS.map((p) => (
            <option key={p.id} value={p.id}>
              {p.label}
            </option>
          ))}
        </select>
      </div>
      <div className="rounded-lg border border-zinc-200 bg-zinc-50/50 p-4">
        <p className="mb-3 text-sm font-medium text-zinc-800">
          Step-by-step for {PLATFORMS.find((p) => p.id === platform)?.label}:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-sm text-zinc-600">
          {steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>
      <div>
        <p className="mb-2 text-sm font-medium text-zinc-800">Embed code</p>
        <pre className="overflow-x-auto rounded-lg bg-zinc-100 p-3 text-xs break-all sm:p-4">
          <code>{embedCode}</code>
        </pre>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <CopyButton text={embedCode} label="Copy embed code" labelCopied="Copied!" className="border-transparent bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white hover:bg-[#0d5aeb] hover:text-white" />
          <button
            type="button"
            onClick={handleDownload}
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download instructions
          </button>
        </div>
      </div>
      <p className="text-sm text-zinc-500">
        Paste the code once (in the place described above). The chat bubble will appear on your site.
      </p>
    </div>
  );
}
