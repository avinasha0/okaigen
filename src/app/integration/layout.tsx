import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Integrations | Connect Your Tools",
  description: "Integrate SiteBotGPT with your favorite apps and platforms. More integrations coming soon.",
  path: "/integration",
  keywords: ["integrations", "connect", "Zapier", "Slack", "API"]});

export default function IntegrationLayout({ children }: { children: React.ReactNode }) {
  return children;
}
