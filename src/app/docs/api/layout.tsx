import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "API Documentation | Chat & Embed",
  description: "SiteBotGPT API reference: Chat API, authentication with API keys, embed widget, request/response formats, and code examples.",
  path: "/docs/api",
  keywords: ["API", "documentation", "chat API", "embed", "integration"]});

export default function DocsApiLayout({ children }: { children: React.ReactNode }) {
  return children;
}
