"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AILetterGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Letter Generator"
      description="Effortlessly create professional letters with our AI Letter Generator. Customize and generate polished letters for any occasion in just a few clicks."
      breadcrumbTitle="AI Letter Generator"
      currentPath="/tools/ai-letter-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-letter-generator"
        buttonLabel="Generate letter"
        fields={[
          { key: "type", label: "Letter type", type: "select", required: true, options: [
            { value: "cover", label: "Cover letter" },
            { value: "thank-you", label: "Thank you letter" },
            { value: "formal", label: "Formal business letter" },
            { value: "resignation", label: "Resignation letter" },
            { value: "reference", label: "Reference / recommendation" },
            { value: "custom", label: "Custom" },
          ] },
          { key: "context", label: "Details / context", type: "textarea", required: true, placeholder: "Describe the situation, key points to include, your background, etc.", rows: 5 },
          { key: "recipient", label: "Recipient (optional)", type: "text", placeholder: "e.g., Hiring Manager at Acme Corp" },
        ]}
      />
    </ToolPageLayout>
  );
}
