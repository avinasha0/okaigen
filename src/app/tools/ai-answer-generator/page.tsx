"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIAnswerGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Answer Generator"
      description="Unlock quick and accurate answers with our AI Answer Generator. Get instant responses to your queries, whether for research, problem-solving, or satisfying curiosity."
      breadcrumbTitle="AI Answer Generator"
      currentPath="/tools/ai-answer-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-answer-generator"
        buttonLabel="Get answer"
        fields={[
          { key: "question", label: "Your question", type: "textarea", required: true, placeholder: "Ask anything...", rows: 3 },
          { key: "context", label: "Context (optional)", type: "textarea", placeholder: "Any relevant context..." },
        ]}
      />
    </ToolPageLayout>
  );
}
