"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertHtmlToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert HTML to Markdown"
      description="Paste your HTML or upload an HTML file and convert it to clean Markdown. Perfect for content migration, documentation, and blog posts. Free to use. No sign up required."
      breadcrumbTitle="Convert HTML to Markdown"
      currentPath="/tools/convert-html-to-markdown"
    >
      <ConvertToolUI
        inputType="fileOrPaste"
        accept=".html,.htm,text/html"
        apiPath="/api/tools/convert-html-to-markdown"
        placeholder="<html><body><h1>Your HTML here</h1><p>...</p></body></html>"
        inputLabel="Choose an HTML file or paste below"
      />
    </ToolPageLayout>
  );
}
