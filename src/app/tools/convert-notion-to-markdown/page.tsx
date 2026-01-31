"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertNotionToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert Notion to Markdown"
      description="Enter any public Notion page URL and convert it to Markdown instantly. Perfect for documentation, content migration, and archiving. Free to use. No sign up required."
      breadcrumbTitle="Convert Notion to Markdown"
      currentPath="/tools/convert-notion-to-markdown"
    >
      <ConvertToolUI
        inputType="url"
        apiPath="/api/tools/convert-notion-to-markdown"
        placeholder="https://www.notion.so/Your-Page-Title-abc123"
        inputLabel="Enter your public Notion page URL"
      />
    </ToolPageLayout>
  );
}
