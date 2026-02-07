import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Use Cases | AI Chatbot for Support, Lead Capture & FAQs",
  description: "How teams use AI chatbots: customer support, lead capture, FAQ automation, SaaS, e-commerce, agencies, EdTech. One bot, many use cases.",
  path: "/use-cases",
  keywords: ["AI chatbot use cases", "website chatbot use cases", "customer support chatbot", "lead capture chatbot"],
});

export default function UseCasesLayout({ children }: { children: React.ReactNode }) {
  return children;
}
