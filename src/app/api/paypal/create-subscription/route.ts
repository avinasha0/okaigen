import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPayPalAccessToken, paypalConfigured } from "@/lib/paypal";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";
import type { PlanName } from "@/lib/plans-config";

const ALLOWED_PLANS: PlanName[] = ["Growth", "Scale"];
const ALLOWED_INTERVALS = ["monthly", "yearly"] as const;
const PAYPAL_API_BASE = process.env.PAYPAL_API_BASE || "https://api-m.paypal.com";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to upgrade" }, { status: 401 });
  }

  if (!paypalConfigured()) {
    return NextResponse.json(
      { error: "PayPal is not configured. Use Stripe or Razorpay." },
      { status: 503 }
    );
  }

  let body: { planName?: string; interval?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const planName = body.planName as PlanName | undefined;
  const interval = body.interval as (typeof ALLOWED_INTERVALS)[number] | undefined;

  if (!planName || !ALLOWED_PLANS.includes(planName)) {
    return NextResponse.json({ error: "Invalid plan. Choose Growth or Scale." }, { status: 400 });
  }
  if (!interval || !ALLOWED_INTERVALS.includes(interval)) {
    return NextResponse.json({ error: "Invalid interval. Use monthly or yearly." }, { status: 400 });
  }

  const plan = await prisma.plan.findFirst({
    where: { name: planName, isActive: true },
  });
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const paypalPlanId =
    interval === "yearly" ? plan.paypalPlanIdYearly : plan.paypalPlanIdMonthly;
  if (!paypalPlanId) {
    return NextResponse.json(
      { error: `PayPal plan for ${planName} (${interval}) is not set up. Add plan IDs in DB/seed.` },
      { status: 503 }
    );
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const token = await getPayPalAccessToken();
  if (!token) {
    return NextResponse.json({ error: "PayPal auth failed" }, { status: 503 });
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const payload = {
    plan_id: paypalPlanId,
    custom_id: ownerId,
    application_context: {
      brand_name: "SiteBotGPT",
      return_url: appUrl + "/dashboard/pricing?success=true",
      cancel_url: appUrl + "/dashboard/pricing?canceled=true",
    },
  };

  const res = await fetch(PAYPAL_API_BASE + "/v1/billing/subscriptions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.text();
    console.error("PayPal create subscription error:", res.status, err);
    return NextResponse.json(
      { error: "Could not create PayPal subscription" },
      { status: 500 }
    );
  }

  const data = (await res.json()) as {
    id?: string;
    links?: Array<{ rel: string; href: string }>;
  };
  const approveLink = data.links?.find((l) => l.rel === "approve");

  return NextResponse.json({
    subscriptionId: data.id,
    approvalUrl: approveLink?.href ?? null,
  });
}
