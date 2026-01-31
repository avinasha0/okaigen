"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";

export default function Page() {
  return (
    <ToolPageLayout
      title="AI Chatbot Conversation Analysis"
      description="Analyze chatbot conversations to find knowledge gaps and improvements."
      breadcrumbTitle="AI Chatbot Conversation Analysis"
      currentPath="/tools/ai-chatbot-conversation-analysis"
      otherTools={ALL_SEO_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-chatbot-conversation-analysis"
        buttonLabel="Analyze"
        fields={[{ key: "conversations", label: "Conversation logs", type: "textarea", required: true, rows: 10 }]}
      />
    </ToolPageLayout>
  );
}
