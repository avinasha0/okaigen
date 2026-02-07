import { MetadataRoute } from "next";

/**
 * robots.txt: allow public pages; disallow dashboard, login, API.
 * Sitemap URL must use https://www.sitebotgpt.com for consistency.
 */
const DISALLOW = ["/dashboard", "/api", "/login"];
const SITEMAP_URL = "https://www.sitebotgpt.com/sitemap.xml";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: "Googlebot", allow: "/", disallow: DISALLOW },
    ],
    sitemap: SITEMAP_URL,
  };
}
