"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AISaaSBrandNameGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI SaaS Brand Name Generator"
      description="Discover the ideal name for your SaaS business with our brand name generator. Get creative, memorable, and domain-friendly suggestions to launch your brand with confidence."
      breadcrumbTitle="AI SaaS Brand Name Generator"
      currentPath="/tools/ai-saas-brand-name-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-saas-brand-name-generator"
        buttonLabel="Generate names"
        fields={[
          { key: "description", label: "Product description", type: "textarea", required: true, placeholder: "Describe your SaaS product...", rows: 4 },
          { key: "industry", label: "Industry (optional)", type: "text", placeholder: "e.g., HR, Marketing, DevTools" },
          { key: "count", label: "Number of names", type: "number", defaultValue: 5 },
        ]}
      />
    </ToolPageLayout>
  );
}
