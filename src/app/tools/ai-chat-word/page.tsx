"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ChatWithContentUI } from "@/components/chat-with-content-ui";
import { ALL_CHAT_TOOLS } from "@/lib/tools-data";

export default function AIChatWordPage() {
  return (
    <ToolPageLayout
      title="AI Chat with Your Word Document & Data"
      description="Upload a Word document (.doc or .docx) and ask questions. The AI reads the content and answers from your document. Max 5 MB."
      breadcrumbTitle="AI Chat with Word"
      currentPath="/tools/ai-chat-word"
      otherTools={ALL_CHAT_TOOLS}
    >
      <ChatWithContentUI
        apiPath="/api/tools/ai-chat-word"
        variant="file"
        contentLabel="Word document"
        accept=".doc,.docx"
      />
    </ToolPageLayout>
  );
}
