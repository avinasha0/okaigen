import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools");

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
