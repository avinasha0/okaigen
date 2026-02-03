import type { Metadata } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";
const SITE_NAME = "SiteBotGPT";

/** SEO best practices: title 50-60 chars, description 155-160 chars */
export function createMetadata({
  title,
  description,
  path = "",
  keywords = [],
  noIndex = false,
  image}: {
  title: string;
  description: string;
  path?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
}): Metadata {
  const url = `${BASE_URL}${path || ""}`;
  const displayTitle = title.includes("|") ? title : path ? `${title} | ${SITE_NAME}` : title;

  return {
    title: path ? title : displayTitle,
    description,
    keywords: keywords.length ? keywords : undefined,
    authors: [{ name: SITE_NAME, url: BASE_URL }],
    creator: SITE_NAME,
    metadataBase: new URL(BASE_URL),
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: displayTitle,
      description,
      images: image ? [{ url: image, alt: title }] : undefined},
    twitter: {
      card: "summary_large_image",
      title: displayTitle,
      description},
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
    alternates: path ? { canonical: url } : undefined};
}

/** High-value, lower-competition keywords for this niche */
export const SEO_KEYWORDS = {
  main: ["AI chatbot", "website chatbot", "chatbot builder", "customer support chatbot", "AI support agent"],
  tools: ["PDF to markdown", "convert PDF markdown", "free AI tools", "sitemap generator", "XML sitemap"],
  convert: ["docx to markdown", "HTML to markdown", "free converter", "document converter"],
  chatTools: ["chat with PDF", "AI document chat", "chat with website", "chat with text"]};
