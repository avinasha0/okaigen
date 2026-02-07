import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Features | AI Chatbot for Website — Personalization, Lead Capture, Analytics",
  description: "SiteBotGPT features: train on your content, embed in one snippet, capture leads, and analyze conversations. AI chatbot features for support and growth.",
  path: "/features",
  keywords: ["AI chatbot features", "website chatbot features", "lead capture chatbot", "chatbot analytics"],
});

export default function FeaturesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
