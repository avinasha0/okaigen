"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertJsonToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert JSON to Markdown"
      description="Paste your JSON or upload a JSON file and convert it to well-formatted Markdown. Perfect for API documentation and data visualization. Free to use. No sign up required."
      breadcrumbTitle="Convert JSON to Markdown"
      currentPath="/tools/convert-json-to-markdown"
    >
      <ConvertToolUI
        inputType="fileOrPaste"
        accept=".json,application/json"
        apiPath="/api/tools/convert-json-to-markdown"
        placeholder='{"key": "value", "array": [1, 2, 3]}'
        inputLabel="Choose a JSON file or paste below"
        buttonLabel="Convert to Markdown"
      />
    </ToolPageLayout>
  );
}
