"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIPromptGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Prompt Generator"
      description="Create high-quality AI prompts with proven frameworks like APE, RACE, CREATE, and SPARK. Generate professional prompts for ChatGPT, Claude, and all AI models."
      breadcrumbTitle="AI Prompt Generator"
      currentPath="/tools/ai-prompt-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-prompt-generator"
        buttonLabel="Generate prompt"
        fields={[
          { key: "topic", label: "Topic or task", type: "text", required: true, placeholder: "What do you want the AI to do?" },
          { key: "purpose", label: "Purpose (optional)", type: "text", placeholder: "e.g., for a blog post, code review..." },
          { key: "framework", label: "Framework", type: "select", options: [
            { value: "general", label: "General" },
            { value: "APE", label: "APE (Action-Result-Purpose)" },
            { value: "RACE", label: "RACE (Role-Action-Context-Expectation)" },
            { value: "CREATE", label: "CREATE" },
            { value: "SPARK", label: "SPARK (Story-driven)" },
          ] },
        ]}
      />
    </ToolPageLayout>
  );
}
