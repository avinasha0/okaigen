import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Try AI Chatbot Demo | Live Chat with Atlas",
  description: "Try our AI chatbot demo live. Ask questions about Atlas, features, pricing & embedding. No signup. See how it works in seconds.",
  path: "/demo",
  keywords: ["AI chatbot demo", "chatbot demo", "try chatbot", "live chatbot"],
});

export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return children;
}
