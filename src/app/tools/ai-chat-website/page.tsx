"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { ChatWithContentUI } from "@/components/chat-with-content-ui";
import { ALL_CHAT_TOOLS } from "@/lib/tools-data";

export default function AIChatWebsitePage() {
  return (
    <ToolPageLayout
      title="AI Chat with Your Website Data"
      description="Enter any webpage URL and ask questions about its content. The AI reads the page and answers based on what it finds."
      breadcrumbTitle="AI Chat with Website"
      currentPath="/tools/ai-chat-website"
      otherTools={ALL_CHAT_TOOLS}
    >
      <ChatWithContentUI
        apiPath="/api/tools/ai-chat-website"
        variant="url"
        contentLabel="Website URL"
        contentPlaceholder="https://example.com"
      />
    </ToolPageLayout>
  );
}
