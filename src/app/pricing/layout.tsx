import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Pricing | AI Chatbot Plans & Pricing",
  description: "SiteBotGPT pricing: Free tier, Growth, Scale & Enterprise. Start free. Pay as you grow. Transparent pricing for AI chatbots.",
  path: "/pricing",
  keywords: ["chatbot pricing", "AI chatbot cost", "chatbot plans", "free chatbot"],
});

export default function PricingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
