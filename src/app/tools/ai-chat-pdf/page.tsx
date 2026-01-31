"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ChatWithContentUI } from "@/components/chat-with-content-ui";
import { ALL_CHAT_TOOLS } from "@/lib/tools-data";

export default function AIChatPDFPage() {
  return (
    <ToolPageLayout
      title="AI Chat with Your PDF Document & Data"
      description="Upload a PDF and ask questions. The AI reads the document and answers based on its content. Max 2 MB."
      breadcrumbTitle="AI Chat with PDF"
      currentPath="/tools/ai-chat-pdf"
      otherTools={ALL_CHAT_TOOLS}
    >
      <ChatWithContentUI
        apiPath="/api/tools/ai-chat-pdf"
        variant="file"
        contentLabel="PDF file"
        accept=".pdf"
      />
    </ToolPageLayout>
  );
}
