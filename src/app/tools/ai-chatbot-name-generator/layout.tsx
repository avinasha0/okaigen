import type { Metadata } from "next";
import { getToolMetadata } from "@/lib/tools-seo";

export const metadata: Metadata = getToolMetadata("/tools/ai-chatbot-name-generator");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
