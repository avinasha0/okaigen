import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Contact Us | Get in Touch",
  description: "Contact SiteBotGPT. Questions about AI chatbots, pricing, or support? Send us a message and we'll get back to you soon.",
  path: "/contact",
  keywords: ["contact", "support", "help", "inquiry"],
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}
