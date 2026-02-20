import { notFound } from "next/navigation";
import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { marked } from "marked";

import { CANONICAL_BASE } from "@/lib/seo";

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n/;

function parseFrontmatter(raw: string): { title?: string; description?: string; body: string } {
  const match = raw.match(FRONTMATTER_RE);
  if (!match) return { body: raw };
  const body = raw.slice(match[0].length);
  const block = match[1];
  let title: string | undefined;
  let description: string | undefined;
  for (const line of block.split("\n")) {
    const t = line.match(/^title:\s*(?:"([^"]*)"|'([^']*)'|(.+))$/);
    if (t) title = (t[1] ?? t[2] ?? t[3] ?? "").trim();
    const d = line.match(/^description:\s*(?:"([^"]*)"|'([^']*)'|(.+))$/);
    if (d) description = (d[1] ?? d[2] ?? d[3] ?? "").trim();
  }
  return { title, description, body };
}

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
  const raw = readLearnFile(slug);
  if (!raw) return { title: "Not Found" };

  const { title: fmTitle, description: fmDesc, body } = parseFrontmatter(raw);
  const fromContent = getMetadataFromContent(body || raw, slug);
  const title = fmTitle ?? fromContent.title;
  const description = fmDesc ?? fromContent.description;

  return {
    title,
    description,
    alternates: {
      canonical: `${CANONICAL_BASE}/learn/${slug}`,
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
  const raw = readLearnFile(slug);
  if (!raw) notFound();

  const { body } = parseFrontmatter(raw);
  const content = body !== undefined ? body : raw;
  const html = await marked.parse(content);
  return <div dangerouslySetInnerHTML={{ __html: String(html) }} />;
}
