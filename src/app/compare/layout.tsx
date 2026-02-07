import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Compare | SiteBotGPT vs Other AI Website Chatbots",
  description: "How SiteBotGPT compares: train on your content, one-snippet embed, lead capture, and transparent pricing. Compare AI chatbot features for your website.",
  path: "/compare",
  keywords: ["AI chatbot comparison", "website chatbot comparison", "SiteBotGPT vs", "best AI chatbot"],
});

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return children;
}
