import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { FooterWrapper } from "@/components/footer-wrapper";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { SkipToMainContent } from "@/components/skip-to-main-content";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-heading",
  display: "swap",
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://okaigen.com";

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
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable} ${inter.className}`}>
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
