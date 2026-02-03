import type { Metadata } from "next";
import { createMetadata } from "@/lib/seo";

export const metadata: Metadata = createMetadata({
  title: "Sign Up | Free AI Chatbot Builder",
  description: "Create your free AI chatbot in minutes. Train on your website, docs & PDFs. No credit card. Start answering visitors 24/7.",
  path: "/signup",
  keywords: ["free chatbot", "create chatbot", "AI chatbot signup"]});

export default function SignupLayout({ children }: { children: React.ReactNode }) {
  return children;
}
