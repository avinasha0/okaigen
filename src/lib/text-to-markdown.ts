/**
 * Convert plain text (e.g. from PDF extraction) to structured Markdown.
 * Applies heuristics for headings, lists, and paragraphs.
 */
export function textToMarkdown(text: string): string {
  if (!text?.trim()) return "";

  const lines = text.split(/\r?\n/);
  const result: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      result.push("");
      i++;
      continue;
    }

    // Detect numbered list: "1. ", "2. ", etc.
    const numberedMatch = trimmed.match(/^(\d{1,3})[.)]\s+/);
    if (numberedMatch) {
      result.push(trimmed);
      i++;
      continue;
    }

    // Detect bullet list: "- ", "* ", "• "
    if (/^[-*•]\s+/.test(trimmed) || /^\d+[.)]\s+/.test(trimmed)) {
      result.push(trimmed);
      i++;
      continue;
    }

    // Potential heading: short line (< 60 chars), may end with colon, or is title case
    const isShort = trimmed.length < 60;
    const endsWithColon = trimmed.endsWith(":");
    const looksLikeTitle =
      isShort &&
      /^[A-Z]/.test(trimmed) &&
      !trimmed.endsWith(".") &&
      !trimmed.endsWith(",");

    if (isShort && (endsWithColon || looksLikeTitle) && !trimmed.match(/^\d+[.)]/)) {
      result.push("");
      result.push(`## ${trimmed.replace(/:$/, "")}`);
      result.push("");
      i++;
      continue;
    }

    // Regular paragraph - ensure blank line before if not first
    if (result.length > 0 && result[result.length - 1] !== "") {
      result.push("");
    }
    result.push(trimmed);
    i++;
  }

  return result.join("\n").replace(/\n{3}/g, "\n\n").trim();
}
