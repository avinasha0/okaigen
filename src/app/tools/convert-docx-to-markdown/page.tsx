"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertDocxToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert DOCX to Markdown"
      description="Upload any Word document (.doc or .docx) and convert it to Markdown instantly. Supports both legacy .doc (Word 97–2003) and modern .docx. Free to use. No sign up required."
      breadcrumbTitle="Convert DOCX to Markdown"
      currentPath="/tools/convert-docx-to-markdown"
    >
      <ConvertToolUI
        inputType="file"
        accept=".docx,.doc,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/msword"
        apiPath="/api/tools/convert-docx-to-markdown"
        inputLabel="Choose a Word file (.doc or .docx) or drag & drop here"
      />
    </ToolPageLayout>
  );
}
