import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";

/**
 * robots.txt rules:
 * - /dashboard, /api, /login: disallowed (private app, API, auth).
 * - /signup: allowed so crawlers and users can discover the signup landing page
 *   (e.g. "SiteBotGPT sign up"); we keep it indexable for acquisition.
 */
const DISALLOW = ["/dashboard", "/api", "/login"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOW },
      { userAgent: "Googlebot", allow: "/", disallow: DISALLOW },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
