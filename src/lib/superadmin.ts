import { auth } from "@/lib/auth";

function parseSuperadminEmails(): string[] {
  const raw = process.env.SUPERADMIN_EMAILS || process.env.SUPERADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export async function requireSuperadmin() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? "";
  const allow = parseSuperadminEmails();
  if (!email || allow.length === 0 || !allow.includes(email)) {
    return { ok: false as const, session };
  }
  return { ok: true as const, session };
}

