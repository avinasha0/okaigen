import { MetadataRoute } from "next";

const BASE = process.env.NEXT_PUBLIC_APP_URL || "https://okaigen.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/api", "/login"] },
      { userAgent: "Googlebot", allow: "/", disallow: ["/dashboard", "/api", "/login"] },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  };
}
