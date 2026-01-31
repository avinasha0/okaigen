"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertGoogleDocsToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert Google Docs to Markdown"
      description="Enter any public Google Docs URL and convert it to Markdown instantly. Perfect for documentation, content migration, and archiving. Free to use. No sign up required."
      breadcrumbTitle="Convert Google Docs to Markdown"
      currentPath="/tools/convert-google-docs-to-markdown"
    >
      <ConvertToolUI
        inputType="url"
        apiPath="/api/tools/convert-google-docs-to-markdown"
        placeholder="https://docs.google.com/document/d/DOCUMENT_ID/edit"
        inputLabel="Enter your Google Docs URL (document must be shared for viewing)"
      />
    </ToolPageLayout>
  );
}
