import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";
import { getPlanUsage } from "@/lib/plan-usage";
import { hasWebhooks } from "@/lib/plans-config";
import { generateWebhookSecret, WEBHOOK_EVENTS } from "@/lib/webhooks";
import { generateId } from "@/lib/utils";
import { z } from "zod";

/** List webhooks for the current account (owner). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ownerId = await getEffectiveOwnerId(session.user.id);
  const webhooks = await prisma.Webhook.findMany({
    where: { userId: ownerId },
    select: { id: true, url: true, events: true, description: true, createdAt: true },
    orderBy: { createdAt: "desc" }});
  return NextResponse.json({ webhooks });
}

const createSchema = z.object({
  url: z.string().url("Valid HTTPS URL required").refine((u) => u.startsWith("https://"), "URL must be HTTPS"),
  events: z.array(z.enum(WEBHOOK_EVENTS as unknown as [string, ...string[]])).min(1, "Select at least one event"),
  description: z.string().max(500).optional()});

/** Create a webhook. Requires Scale or Enterprise plan. Returns secret once. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ownerId = await getEffectiveOwnerId(session.user.id);
  const planUsage = await getPlanUsage(ownerId);
  const planName = planUsage?.planName ?? "Starter";
  if (!hasWebhooks(planName)) {
    return NextResponse.json(
      { error: "Webhooks are not included in your plan. Upgrade to Scale or Enterprise." },
      { status: 403 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse({
    ...body,
    events: Array.isArray(body.events) ? body.events : (body.events ? String(body.events).split(",").map((e: string) => e.trim()) : [])});
  if (!parsed.success) {
    const msg = parsed.error.flatten().fieldErrors.events?.[0] ?? parsed.error.flatten().fieldErrors.url?.[0] ?? "Invalid input";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const secret = generateWebhookSecret();
  const webhook = await prisma.Webhook.create({
    data: {userId: ownerId,
      url: parsed.data.url,
      secret,
      events: parsed.data.events.join(","),
      description: parsed.data.description ?? null},
    select: { id: true, url: true, events: true, description: true, createdAt: true }});
  return NextResponse.json({
    webhook: { ...webhook },
    secret, // Only returned once
  });
}
