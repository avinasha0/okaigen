"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { UrlToolUI } from "@/components/url-tool-ui";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";

export default function SitemapUrlExtractorPage() {
  return (
    <ToolPageLayout
      title="Sitemap URL Extractor"
      description="Extract all URLs from any website's sitemap.xml file. Perfect for SEO analysis, content auditing, and website crawling. Fast, free, no sign up required."
      breadcrumbTitle="Sitemap URL Extractor"
      currentPath="/tools/sitemap-url-extractor"
      otherTools={ALL_SEO_TOOLS}
    >
      <UrlToolUI
        apiPath="/api/tools/sitemap-url-extractor"
        title="Sitemap URL"
        placeholder="https://example.com/sitemap.xml"
      />
    </ToolPageLayout>
  );
}
