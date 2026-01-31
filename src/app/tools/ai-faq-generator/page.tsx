"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIFaqGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI FAQ Generator"
      description="Streamline your website's information with our AI-driven FAQ generator. Quickly create comprehensive, relevant question-and-answer sets to improve user experience and boost SEO."
      breadcrumbTitle="AI FAQ Generator"
      currentPath="/tools/ai-faq-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-faq-generator"
        buttonLabel="Generate FAQs"
        fields={[
          { key: "topic", label: "Topic or product", type: "textarea", required: true, placeholder: "Describe your topic, product, or service...", rows: 4 },
          { key: "count", label: "Number of FAQs", type: "number", defaultValue: 5 },
        ]}
      />
    </ToolPageLayout>
  );
}
