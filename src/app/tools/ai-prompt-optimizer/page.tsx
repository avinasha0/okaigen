"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIPromptOptimizerPage() {
  return (
    <ToolPageLayout
      title="AI Prompt Optimizer"
      description="Transform your existing prompts into powerful, framework-based instructions. Select a proven framework and watch your prompts become clearer and more effective."
      breadcrumbTitle="AI Prompt Optimizer"
      currentPath="/tools/ai-prompt-optimizer"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-prompt-optimizer"
        buttonLabel="Optimize prompt"
        fields={[
          { key: "prompt", label: "Your current prompt", type: "textarea", required: true, placeholder: "Paste your prompt to optimize...", rows: 6 },
          { key: "framework", label: "Framework", type: "select", options: [
            { value: "general", label: "General best practices" },
            { value: "APE", label: "APE" },
            { value: "RACE", label: "RACE" },
            { value: "CREATE", label: "CREATE" },
            { value: "SPARK", label: "SPARK" },
          ] },
        ]}
      />
    </ToolPageLayout>
  );
}
