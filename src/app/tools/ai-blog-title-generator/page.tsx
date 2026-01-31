"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { AIGeneratorTool } from "@/components/ai-generator-tool";
import { ALL_AI_TOOLS } from "@/lib/tools-data";

export default function AIBlogTitleGeneratorPage() {
  return (
    <ToolPageLayout
      title="AI Blog Title Generator"
      description="Craft compelling blog titles with our AI-powered generator. Boost your content's click-through rates and engagement with catchy, memorable, SEO-friendly headlines."
      breadcrumbTitle="AI Blog Title Generator"
      currentPath="/tools/ai-blog-title-generator"
      otherTools={ALL_AI_TOOLS}
    >
      <AIGeneratorTool
        apiPath="/api/tools/ai-blog-title-generator"
        buttonLabel="Generate titles"
        fields={[
          { key: "topic", label: "Blog topic", type: "text", required: true, placeholder: "What is your blog post about?" },
          { key: "count", label: "Number of titles", type: "number", defaultValue: 5 },
          { key: "style", label: "Style", type: "select", options: [
            { value: "professional", label: "Professional" },
            { value: "clickbait", label: "Engaging / Click-worthy" },
            { value: "curiosity", label: "Curiosity-driven" },
            { value: "how-to", label: "How-to" },
            { value: "list", label: "List style" },
          ] },
        ]}
      />
    </ToolPageLayout>
  );
}
