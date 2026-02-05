import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { FooterWrapper } from "@/components/footer-wrapper";
import { CookieConsentBanner } from "@/components/cookie-consent-banner";
import { SkipToMainContent } from "@/components/skip-to-main-content";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter"});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  variable: "--font-jakarta"});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "SiteBotGPT | AI Chatbot for Website & Customer Support",
    template: "%s | SiteBotGPT"},
  description: "Train an AI chatbot on your website, docs & PDFs. Answer visitor questions 24/7. Forever free plan available. No code. Embed in minutes. AI support for your business.",
  keywords: ["AI chatbot", "website chatbot", "chatbot builder", "customer support chatbot", "AI support agent"],
  authors: [{ name: "SiteBotGPT", url: BASE_URL }],
  icons: {
    icon: [
      { url: `${BASE_URL}/favicon.ico`, type: "image/x-icon", sizes: "any" },
      { url: `${BASE_URL}/favicon.png`, type: "image/png", sizes: "32x32" },
    ],
    shortcut: [{ url: `${BASE_URL}/favicon.ico`, type: "image/x-icon" }],
    apple: [{ url: `${BASE_URL}/favicon.png`, type: "image/png", sizes: "180x180" }],
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "SiteBotGPT"},
  robots: { index: true, follow: true }};

export default function RootLayout({
  children}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="font-sans antialiased overflow-x-hidden">
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
