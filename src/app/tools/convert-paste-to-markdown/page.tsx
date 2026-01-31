"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertPasteToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert Paste to Markdown"
      description="Paste any plain text (report, article, transcript, or notes) and convert it to clean Markdown. We apply smart formatting for headings, lists, and paragraphs. Free to use. No sign up required."
      breadcrumbTitle="Convert Paste to Markdown"
      currentPath="/tools/convert-paste-to-markdown"
    >
      <ConvertToolUI
        inputType="paste"
        apiPath="/api/tools/convert-paste-to-markdown"
        placeholder="Paste your text here..."
        inputLabel="Paste any text to convert to Markdown"
      />
    </ToolPageLayout>
  );
}
