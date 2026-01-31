import { NextResponse } from "next/server";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB

function csvToMarkdownTable(csv: string): string {
  const lines = csv.trim().split(/\r?\n/);
  if (lines.length === 0) return "";

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if ((c === "," && !inQuotes) || (c === "\t" && !inQuotes)) {
        result.push(current.trim());
        current = "";
      } else {
        current += c;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rows = lines.map(parseRow);
  if (rows.length === 0) return "";

  const colCount = Math.max(...rows.map((r) => r.length));
  const pad = (r: string[]) => {
    const copy = [...r];
    while (copy.length < colCount) copy.push("");
    return copy;
  };

  const header = pad(rows[0]);
  const separator = header.map(() => "---");
  const body = rows.slice(1).map((r) => pad(r));

  const toRow = (cells: string[]) =>
    "| " + cells.map((c) => c.replace(/\|/g, "\\|").replace(/\n/g, " ")).join(" | ") + " |";

  const md = [toRow(header), toRow(separator), ...body.map(toRow)].join("\n");
  return md;
}

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: "File too large. Maximum size is 2 MB." }, { status: 400 });
    }

    const csv = await file.text();
    const markdown = csvToMarkdownTable(csv);

    return NextResponse.json({
      markdown,
      filename: file.name.replace(/\.csv$/i, "") + ".md",
    });
  } catch (err) {
    console.error("[convert-csv-to-markdown]", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Conversion failed" },
      { status: 500 }
    );
  }
}
