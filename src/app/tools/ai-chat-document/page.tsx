"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ChatWithContentUI } from "@/components/chat-with-content-ui";
import { ALL_CHAT_TOOLS } from "@/lib/tools-data";

export default function AIChatDocumentPage() {
  return (
    <ToolPageLayout
      title="AI Chat with Your Document & Data"
      description="Upload PDF, Word, or TXT, or paste text. Ask questions and get answers from your content."
      breadcrumbTitle="AI Chat with Document"
      currentPath="/tools/ai-chat-document"
      otherTools={ALL_CHAT_TOOLS}
    >
      <ChatWithContentUI
        apiPath="/api/tools/ai-chat-document"
        variant="fileOrPaste"
        contentPlaceholder="Paste text or upload PDF, DOCX, DOC, TXT..."
        accept=".pdf,.doc,.docx,.txt"
      />
    </ToolPageLayout>
  );
}
