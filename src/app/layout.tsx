import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/providers";
import { FooterWrapper } from "@/components/footer-wrapper";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { SkipToMainContent } from "@/components/skip-to-main-content";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SiteBotGPT | AI Chatbot for Website & Customer Support",
    template: "%s | SiteBotGPT",
  },
  description: "Train an AI chatbot on your website, docs & PDFs. Answer visitor questions 24/7. Forever free plan available. No code. Embed in minutes. AI support for your business.",
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <Providers>
          <SkipToMainContent />
          {children}
          <FooterWrapper />
          <CookieConsentBanner />
        </Providers>
      </body>
    </html>
  );
}
