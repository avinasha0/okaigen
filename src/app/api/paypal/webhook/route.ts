import { NextResponse } from "next/server";
import { assignPlanToUser, downgradeUserToStarter } from "@/lib/billing-assign-plan";
import { prisma } from "@/lib/db";

const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";
const PAYPAL_WEBHOOK_ID = process.env.PAYPAL_WEBHOOK_ID;

async function verifyPayPalWebhook(
  body: string,
  headers: Record<string, string | null>
): Promise<boolean> {
  if (!PAYPAL_WEBHOOK_ID || !process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
    return false;
  }
  const tokenRes = await fetch(`${PAYPAL_API_BASE}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(
        `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
      ).toString("base64")}`},
    body: "grant_type=client_credentials"});
  if (!tokenRes.ok) return false;
  const tokenData = (await tokenRes.json()) as { access_token?: string };
  const token = tokenData.access_token;
  if (!token) return false;

  const verifyRes = await fetch(`${PAYPAL_API_BASE}/v1/notifications/verify-webhook-signature`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`},
    body: JSON.stringify({
      auth_algo: headers["paypal-auth-algo"] ?? "",
      cert_url: headers["paypal-cert-url"] ?? "",
      transmission_id: headers["paypal-transmission-id"] ?? "",
      transmission_sig: headers["paypal-transmission-sig"] ?? "",
      transmission_time: headers["paypal-transmission-time"] ?? "",
      webhook_id: PAYPAL_WEBHOOK_ID,
      webhook_event: JSON.parse(body)})});
  if (!verifyRes.ok) return false;
  const verifyData = (await verifyRes.json()) as { verification_status?: string };
  return verifyData.verification_status === "SUCCESS";
}

export async function POST(request: Request) {
  if (!PAYPAL_WEBHOOK_ID) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const headers: Record<string, string | null> = {
    "paypal-auth-algo": request.headers.get("paypal-auth-algo"),
    "paypal-cert-url": request.headers.get("paypal-cert-url"),
    "paypal-transmission-id": request.headers.get("paypal-transmission-id"),
    "paypal-transmission-sig": request.headers.get("paypal-transmission-sig"),
    "paypal-transmission-time": request.headers.get("paypal-transmission-time")};

  const valid = await verifyPayPalWebhook(rawBody, headers);
  if (!valid) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let event: { event_type?: string; resource?: { id?: string; plan_id?: string; status?: string; custom_id?: string; billing_info?: { last_payment?: { time?: string } } } };
  try {
    event = JSON.parse(rawBody) as typeof event;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = event.event_type;
  const resource = event.resource;

  try {
    if (eventType === "BILLING.SUBSCRIPTION.ACTIVATED" && resource?.id && resource?.status === "ACTIVE") {
        const customId = resource.custom_id;
        const planId = resource.plan_id;
        if (!customId) {
          console.warn("PayPal webhook: no custom_id");
          return NextResponse.json({ received: true });
        }

        const plan = await prisma.Plan.findFirst({
          where: {
            isActive: true,
            OR: [
              { paypalPlanIdMonthly: planId },
              { paypalPlanIdYearly: planId },
            ]}});
        if (!plan) {
          console.warn("PayPal webhook: no plan for plan_id", planId);
          return NextResponse.json({ received: true });
        }

        let currentPeriodEnd: Date | undefined;
        if (resource.billing_info?.last_payment?.time) {
          currentPeriodEnd = new Date(resource.billing_info.last_payment.time);
        }

        await assignPlanToUser(customId, plan.name, {
          currentPeriodEnd,
          paypalSubscriptionId: resource.id});
    } else if (eventType === "BILLING.SUBSCRIPTION.CANCELLED" || eventType === "BILLING.SUBSCRIPTION.EXPIRED" || eventType === "BILLING.SUBSCRIPTION.SUSPENDED") {
      const customId = resource?.custom_id;
      if (customId) {
        await downgradeUserToStarter(customId);
      }
    }
  } catch (err) {
    console.error("PayPal webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
