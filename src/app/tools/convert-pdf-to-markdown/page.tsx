"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertPdfToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert PDF to Markdown"
      description="Upload any PDF document and convert it to Markdown instantly. Perfect for documentation, note-taking, and content migration. Free to use. No sign up required."
      breadcrumbTitle="Convert PDF to Markdown"
      currentPath="/tools/convert-pdf-to-markdown"
    >
      <ConvertToolUI
        inputType="file"
        accept=".pdf,application/pdf"
        apiPath="/api/tools/convert-pdf-to-markdown"
        inputLabel="Choose a PDF file or drag & drop here"
      />
    </ToolPageLayout>
  );
}
