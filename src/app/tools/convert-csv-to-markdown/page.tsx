"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertCsvToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert CSV to Markdown"
      description="Upload your CSV file and convert it to a Markdown table. Perfect for documentation, README files, and data presentation. Free to use. No sign up required."
      breadcrumbTitle="Convert CSV to Markdown"
      currentPath="/tools/convert-csv-to-markdown"
    >
      <ConvertToolUI
        inputType="file"
        accept=".csv,text/csv,text/plain"
        apiPath="/api/tools/convert-csv-to-markdown"
        inputLabel="Choose a CSV file or drag & drop here"
      />
    </ToolPageLayout>
  );
}
