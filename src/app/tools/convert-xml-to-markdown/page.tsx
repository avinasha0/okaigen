"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ConvertToolUI } from "@/components/convert-tool-ui";

export default function ConvertXmlToMarkdownPage() {
  return (
    <ToolPageLayout
      title="Convert XML to Markdown"
      description="Paste your XML or upload an XML file and convert it to Markdown. Perfect for data transformation, documentation, and content migration. Free to use. No sign up required."
      breadcrumbTitle="Convert XML to Markdown"
      currentPath="/tools/convert-xml-to-markdown"
    >
      <ConvertToolUI
        inputType="fileOrPaste"
        accept=".xml,text/xml,application/xml"
        apiPath="/api/tools/convert-xml-to-markdown"
        placeholder='<?xml version="1.0"?><root><item>content</item></root>'
        inputLabel="Choose an XML file or paste below"
      />
    </ToolPageLayout>
  );
}
