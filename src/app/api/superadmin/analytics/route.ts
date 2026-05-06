import { NextResponse } from "next/server";
import { z } from "zod";
import { requireSuperadmin } from "@/lib/superadmin";
import { APP_CONFIG_KEYS, getAppConfig, setAppConfig } from "@/lib/app-config";

export const runtime = "nodejs";

const upsertSchema = z.object({
  measurementId: z
    .string()
    .trim()
    .optional()
    .nullable()
    .transform((v) => (typeof v === "string" && v.length > 0 ? v : null)),
});

export async function GET() {
  const gate = await requireSuperadmin();
  if (!gate.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const measurementId = await getAppConfig(APP_CONFIG_KEYS.gaMeasurementId);
  return NextResponse.json({ measurementId });
}

export async function PUT(req: Request) {
  const gate = await requireSuperadmin();
  if (!gate.ok) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = upsertSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.issues }, { status: 400 });
  }

  await setAppConfig(APP_CONFIG_KEYS.gaMeasurementId, parsed.data.measurementId);
  return NextResponse.json({ ok: true });
}

