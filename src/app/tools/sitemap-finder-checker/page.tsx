"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { UrlToolUI } from "@/components/url-tool-ui";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";

export default function SitemapFinderCheckerPage() {
  return (
    <ToolPageLayout
      title="Sitemap Finder & Checker"
      description="Find and validate all sitemaps on any website instantly. Discover hidden sitemaps, check validity, and extract total URL counts. Perfect for SEO audits and website analysis."
      breadcrumbTitle="Sitemap Finder & Checker"
      currentPath="/tools/sitemap-finder-checker"
      otherTools={ALL_SEO_TOOLS}
    >
      <UrlToolUI
        apiPath="/api/tools/sitemap-finder-checker"
        title="Website URL"
        placeholder="https://example.com"
      />
    </ToolPageLayout>
  );
}
