import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Refund Policy",
  description: "SiteBotGPT refund policy. Information about refunds, cancellations, and billing for our AI chatbot plans.",
  path: "/refund",
  keywords: ["refund", "cancellation", "billing", "money-back"]});

export default function RefundLayout({ children }: { children: React.ReactNode }) {
  return children;
}
