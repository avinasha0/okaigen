import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Privacy Policy",
  description: "SiteBotGPT privacy policy. Learn how we collect, use, and protect your data when you use our AI chatbot platform.",
  path: "/privacy",
  keywords: ["privacy", "policy", "data", "GDPR"]});

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
