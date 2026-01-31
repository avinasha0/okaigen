"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { UrlToolUI } from "@/components/url-tool-ui";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";

export default function WebsiteUrlExtractorPage() {
  return (
    <ToolPageLayout
      title="Website URL Extractor"
      description="Crawl and extract all URLs from any website. Perfect for site mapping, content auditing, and comprehensive SEO analysis. Fast, free, no sign up required."
      breadcrumbTitle="Website URL Extractor"
      currentPath="/tools/website-url-extractor"
      otherTools={ALL_SEO_TOOLS}
    >
      <UrlToolUI
        apiPath="/api/tools/website-url-extractor"
        title="Website URL"
        placeholder="https://example.com"
        extraFields={[{ key: "maxUrls", label: "Max URLs to extract", type: "number", default: 100 }]}
      />
    </ToolPageLayout>
  );
}
