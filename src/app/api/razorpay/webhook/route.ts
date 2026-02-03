import { NextResponse } from "next/server";
import crypto from "crypto";
import { assignPlanToUser, downgradeUserToStarter } from "@/lib/billing-assign-plan";
import { prisma } from "@/lib/db";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

export async function POST(request: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const rawBody = await request.text();
  const signature = request.headers.get("x-razorpay-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing x-razorpay-signature" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", WEBHOOK_SECRET).update(rawBody).digest("hex");
  if (expected !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let payload: { event: string; payload?: { subscription?: { entity?: { id: string; plan_id: string; status: string; current_end?: number }; subscription_entity?: { id: string; plan_id: string; status: string; current_end?: number } }; subscription_entity?: { id: string; plan_id: string; status: string; current_end?: number } } };
  try {
    payload = JSON.parse(rawBody) as typeof payload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const event = payload.event;

  try {
    if (event === "subscription.activated" || event === "subscription.charged") {
      const subEntity =
        payload.payload?.subscription?.entity ??
        payload.payload?.subscription?.subscription_entity ??
        payload.payload?.subscription_entity;
      if (!subEntity?.id || subEntity.status !== "active") return NextResponse.json({ received: true });

      const subscriptionId = subEntity.id;
      const planId = subEntity.plan_id;
      const notes = (payload.payload as { subscription?: { entity?: { notes?: Record<string, string> } } })?.subscription?.entity?.notes;
      const userId = notes?.userId;
      const planName = notes?.planName;

      if (!userId || !planName) {
        console.warn("Razorpay webhook: missing userId or planName in notes");
        return NextResponse.json({ received: true });
      }

      const plan = await prisma.Plan.findFirst({
        where: {
          isActive: true,
          OR: [
            { razorpayPlanIdMonthly: planId },
            { razorpayPlanIdYearly: planId },
          ]}});
      if (!plan) {
        console.warn("Razorpay webhook: no plan for plan_id", planId);
        return NextResponse.json({ received: true });
      }

      const currentPeriodEnd = subEntity.current_end
        ? new Date(subEntity.current_end * 1000)
        : undefined;

      await assignPlanToUser(userId, plan.name, {
        currentPeriodEnd,
        razorpaySubscriptionId: subscriptionId});
    } else if (event === "subscription.cancelled" || event === "subscription.completed" || event === "subscription.expired") {
      const subEntity =
        payload.payload?.subscription?.entity ??
        payload.payload?.subscription?.subscription_entity ??
        payload.payload?.subscription_entity;
      const notes = (payload.payload as { subscription?: { entity?: { notes?: Record<string, string> } } })?.subscription?.entity?.notes;
      const userId = notes?.userId;
      if (userId) {
        await downgradeUserToStarter(userId);
      }
    }
  } catch (err) {
    console.error("Razorpay webhook error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
