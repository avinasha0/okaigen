import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { marked } from "marked";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://sitebotgpt.com";

function getMetadataFromContent(content: string, slug: string) {
  const lines = content.split("\n");
  // Title: first H1 (# ...) or fallback to slug
  let title = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  for (const line of lines) {
    const m = line.match(/^#\s+(.+)$/);
    if (m) {
      title = m[1].trim();
      break;
    }
  }
  // Description: first 160 chars of plain text (strip markdown)
  let plain = content
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/^#+\s+/gm, "")
    .replace(/^---+$/gm, "")
    .replace(/\n+/g, " ")
    .trim();
  let description = plain.slice(0, 160).trim();
  if (plain.length > 160 && /\S/.test(plain[159])) {
    const lastSpace = description.lastIndexOf(" ");
    if (lastSpace > 120) description = description.slice(0, lastSpace);
  }
  return { title, description };
}

function readLearnFile(slug: string): string | null {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;
  const filePath = path.join(process.cwd(), "docs", "learn", `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf-8");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = readLearnFile(slug);
  if (!content) return { title: "Not Found" };

  const { title, description } = getMetadataFromContent(content, slug);

  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL.replace(/\/$/, "")}/learn/${slug}`,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function LearnPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const content = readLearnFile(slug);
  if (!content) notFound();

  const html = await marked.parse(content);
  return <div dangerouslySetInnerHTML={{ __html: String(html) }} />;
}
