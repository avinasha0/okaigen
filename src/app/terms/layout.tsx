import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Terms & Conditions",
  description: "Terms and conditions for using SiteBotGPT. Please read these terms carefully before using our AI chatbot service.",
  path: "/terms",
  keywords: ["terms", "conditions", "legal", "agreement"]});

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
