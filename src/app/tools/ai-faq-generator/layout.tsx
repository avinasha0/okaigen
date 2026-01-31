import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools/ai-faq-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
