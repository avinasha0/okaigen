import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function jsonToMarkdown(obj: unknown, indent = 0): string {
  const pad = "  ".repeat(indent);
  if (obj === null) return "`null`";
  if (typeof obj === "boolean") return `\`${obj}\``;
  if (typeof obj === "number") return String(obj);
  if (typeof obj === "string") return obj;

  if (Array.isArray(obj)) {
    if (obj.length === 0) return "- (empty array)";
    return obj
      .map((item, i) => {
        if (typeof item === "object" && item !== null && !Array.isArray(item)) {
          return `${pad}- **[${i}]**\n${jsonToMarkdown(item, indent + 1)}`;
        }
        return `${pad}- ${jsonToMarkdown(item, indent + 1)}`;
      })
      .join("\n");
  }

  if (typeof obj === "object") {
    const entries = Object.entries(obj);
    if (entries.length === 0) return "*(empty object)*";
    return entries
      .map(([k, v]) => {
        const key = `**${k}**:`;
        if (typeof v === "object" && v !== null) {
          return `${pad}- ${key}\n${jsonToMarkdown(v, indent + 1)}`;
        }
        return `${pad}- ${key} ${jsonToMarkdown(v, indent + 1)}`;
      })
      .join("\n");
  }

  return String(obj);
}

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    let jsonStr: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File | null;
      if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });
      if (file.size > MAX_SIZE) return NextResponse.json({ error: "File too large. Max 2 MB." }, { status: 400 });
      jsonStr = await file.text();
    } else {
      const body = await req.json().catch(() => ({}));
      jsonStr = typeof body.json === "string" ? body.json
        : typeof body.text === "string" ? body.text
        : typeof body.content === "string" ? body.content
        : typeof body.paste === "string" ? body.paste
        : JSON.stringify(body.content ?? body ?? {});
    }

    const parsed = JSON.parse(jsonStr);
    const markdown = `# JSON Output\n\n${jsonToMarkdown(parsed)}`;

    return NextResponse.json({ markdown });
  } catch (err) {
    console.error("[convert-json-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Invalid JSON or conversion failed" },
      { status: 500 }
    );
  }
}
