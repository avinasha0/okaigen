import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Documentation | SiteBotGPT",
  description:
    "SiteBotGPT documentation: how to use the chat widget, dashboard, bots, sources, analytics, leads, API, webhooks, and free tools.",
  path: "/docs",
  keywords: ["documentation", "help", "guide", "chatbot", "widget", "API"],
});

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
