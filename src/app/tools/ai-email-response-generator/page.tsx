"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIEmailResponseGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Email Response Generator"
      description="Enhance your email productivity with our AI Email Response Generator. Craft personalized, thoughtful, and professional replies in seconds."
      breadcrumbTitle="AI Email Response Generator"
      currentPath="/tools/ai-email-response-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-email-response-generator"
        buttonLabel="Generate reply"
        fields={[
          { key: "email", label: "Email to respond to", type: "textarea", required: true, placeholder: "Paste the email you need to reply to...", rows: 6 },
          { key: "tone", label: "Tone", type: "select", options: [
            { value: "professional", label: "Professional" },
            { value: "friendly", label: "Friendly" },
            { value: "formal", label: "Formal" },
            { value: "concise", label: "Concise" },
          ] },
        ]}
      />
    </ToolPageLayout>
  );
}
