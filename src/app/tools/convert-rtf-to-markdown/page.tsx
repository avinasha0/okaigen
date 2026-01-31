"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertRtfToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert RTF to Markdown"
      description="Upload any RTF document and convert it to Markdown. Perfect for documents created in WordPad, older Word versions, or email clients. Free to use. No sign up required."
      breadcrumbTitle="Convert RTF to Markdown"
      currentPath="/tools/convert-rtf-to-markdown"
    >
      <ConvertToolUI
        inputType="file"
        accept=".rtf,application/rtf,text/rtf"
        apiPath="/api/tools/convert-rtf-to-markdown"
        inputLabel="Choose an RTF file or drag & drop here"
      />
    </ToolPageLayout>
  );
}
