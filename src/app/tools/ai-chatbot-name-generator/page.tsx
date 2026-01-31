"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIChatbotNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Chatbot Name Generator"
      description="Create the perfect name for your AI assistant with our chatbot name generator. Get creative, memorable, and brand-aligned suggestions."
      breadcrumbTitle="AI Chatbot Name Generator"
      currentPath="/tools/ai-chatbot-name-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-chatbot-name-generator"
        buttonLabel="Generate names"
        fields={[
          { key: "brand", label: "Brand / company (optional)", type: "text", placeholder: "Your company or brand name" },
          { key: "industry", label: "Industry (optional)", type: "text", placeholder: "e.g., E-commerce, Healthcare" },
          { key: "style", label: "Style", type: "select", options: [
            { value: "friendly", label: "Friendly" },
            { value: "professional", label: "Professional" },
            { value: "playful", label: "Playful" },
            { value: "tech", label: "Tech / Modern" },
          ] },
          { key: "count", label: "Number of names", type: "number", defaultValue: 5 },
        ]}
      />
    </ToolPageLayout>
  );
}
