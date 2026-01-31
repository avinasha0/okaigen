"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIReplyGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Reply Generator"
      description="Generate thoughtful, contextually appropriate replies to any message. Perfect for social media, emails, texts, and professional communication."
      breadcrumbTitle="AI Reply Generator"
      currentPath="/tools/ai-reply-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-reply-generator"
        buttonLabel="Generate reply"
        fields={[
          { key: "message", label: "Message to reply to", type: "textarea", required: true, placeholder: "Paste the message you want to reply to...", rows: 4 },
          { key: "tone", label: "Tone", type: "select", options: [
            { value: "professional", label: "Professional" },
            { value: "casual", label: "Casual" },
            { value: "friendly", label: "Friendly" },
            { value: "formal", label: "Formal" },
          ] },
          { key: "context", label: "Additional context (optional)", type: "textarea", placeholder: "Any context that might help..." },
        ]}
      />
    </ToolPageLayout>
  );
}
