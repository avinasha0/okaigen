import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools/convert-webpage-to-markdown");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
