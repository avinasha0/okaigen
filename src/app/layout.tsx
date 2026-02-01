import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://okaigen.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SiteBotGPT | AI Chatbot for Website & Customer Support",
    template: "%s | SiteBotGPT",
  },
  description: "Train an AI chatbot on your website, docs & PDFs. Answer visitor questions 24/7. Free trial, no code. Embed in minutes. Start free today. AI support for your business.",
  keywords: ["AI chatbot", "website chatbot", "chatbot builder", "customer support chatbot", "AI support agent"],
  authors: [{ name: "SiteBotGPT", url: BASE_URL }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SiteBotGPT",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
