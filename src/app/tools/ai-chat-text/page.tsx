"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ChatWithContentUI } from "@/components/chat-with-content-ui";
import { ALL_CHAT_TOOLS } from "@/lib/tools-data";

export default function AIChatTextPage() {
  return (
    <ToolPageLayout
      title="AI Chat with Your Text Data"
      description="Paste any text and ask questions. The AI answers using only your content—perfect for analyzing articles, notes, or documents."
      breadcrumbTitle="AI Chat with Text"
      currentPath="/tools/ai-chat-text"
      otherTools={ALL_CHAT_TOOLS}
    >
      <ChatWithContentUI
        apiPath="/api/tools/ai-chat-text"
        variant="text"
        contentLabel="Your text"
        contentPlaceholder="Paste your text, article, notes, or any content here..."
      />
    </ToolPageLayout>
  );
}
