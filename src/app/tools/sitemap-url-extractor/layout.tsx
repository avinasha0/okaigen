import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools/sitemap-url-extractor");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
