import { createHmac } from "crypto";
import { prisma } from "@/lib/db";
import { getPlanUsage } from "@/lib/plan-usage";
import { hasWebhooks } from "@/lib/plans-config";

export const WEBHOOK_EVENTS = ["lead.captured", "chat.message"] as const;
export type WebhookEvent = (typeof WEBHOOK_EVENTS)[number];

/** Sign payload with webhook secret. Subscribers verify with X-Webhook-Signature: sha256=<hex> */
function signPayload(secret: string, payload: string): string {
  return createHmac("sha256", secret).update(payload).digest("hex");
}

/** Fire webhooks for the given account owner and event. Non-blocking; errors are logged. */
export async function triggerWebhooks(
  ownerId: string,
  event: WebhookEvent,
  payload: object
): Promise<void> {
  const planUsage = await getPlanUsage(ownerId);
  const planName = planUsage?.planName ?? "Starter";
  if (!hasWebhooks(planName)) return;

  const webhooks = await prisma.webhook.findMany({
    where: {
      userId: ownerId,
      events: { contains: event }}});

  const body = JSON.stringify({ event, ...payload });
  await Promise.allSettled(
    webhooks.map(async (wh) => {
      try {
        const signature = signPayload(wh.secret, body);
        const res = await fetch(wh.url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Signature": `sha256=${signature}`,
            "X-Webhook-Event": event},
          body,
          signal: AbortSignal.timeout(10000)});
        if (!res.ok) {
          console.warn(`Webhook ${wh.id} ${wh.url} returned ${res.status}`);
        }
      } catch (e) {
        console.warn(`Webhook ${wh.id} ${wh.url} failed:`, e);
      }
    })
  );
}

/** Generate a random webhook signing secret. */
export function generateWebhookSecret(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 32; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s;
}
