"use client";

import { ToolPageLayout } from "@/components/tool-page-layout";
import { UrlToolUI } from "@/components/url-tool-ui";
import { ALL_SEO_TOOLS } from "@/lib/tools-data";

export default function XmlSitemapGeneratorPage() {
  return (
    <ToolPageLayout
      title="XML Sitemap Generator"
      description="Generate an XML sitemap for your website. Crawl and discover pages, then export as sitemap.xml."
      breadcrumbTitle="XML Sitemap Generator"
      currentPath="/tools/xml-sitemap-generator"
      otherTools={ALL_SEO_TOOLS}
    >
      <UrlToolUI apiPath="/api/tools/xml-sitemap-generator" placeholder="https://example.com" extraFields={[{ key: "maxPages", label: "Max pages", type: "number", default: 50 }]} />
    </ToolPageLayout>
  );
}
