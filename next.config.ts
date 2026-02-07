import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse", "pdfjs-dist"],
  async redirects() {
    return [
      { source: "/:path*", has: [{ type: "host", value: "sitebotgpt.com" }], destination: "https://www.sitebotgpt.com/:path*", permanent: true },
      { source: "/:path*", has: [{ type: "host", value: "www.sitebotgpt.com" }, { type: "header", key: "x-forwarded-proto", value: "http" }], destination: "https://www.sitebotgpt.com/:path*", permanent: true },
    ];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "50mb",
    },
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-avatar",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-progress",
      "@radix-ui/react-select",
      "@radix-ui/react-slot",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
    ],
  },
  compress: true,
};

export default nextConfig;
