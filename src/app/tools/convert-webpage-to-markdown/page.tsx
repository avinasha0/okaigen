"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertWebpageToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert Webpage to Markdown"
      description="Enter any webpage URL and convert it to Markdown instantly. Perfect for documentation, content migration, and archiving. Free to use. No sign up required."
      breadcrumbTitle="Convert Webpage to Markdown"
      currentPath="/tools/convert-webpage-to-markdown"
    >
      <ConvertToolUI
        inputType="url"
        apiPath="/api/tools/convert-webpage-to-markdown"
        placeholder="https://example.com/page"
        inputLabel="Enter the webpage URL to convert"
      />
    </ToolPageLayout>
  );
}
