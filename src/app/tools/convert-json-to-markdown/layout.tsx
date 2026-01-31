import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools/convert-json-to-markdown");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
