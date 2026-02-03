import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getRazorpay, razorpayConfigured } from "@/lib/razorpay";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";
import type { PlanName } from "@/lib/plans-config";

const ALLOWED_PLANS: PlanName[] = ["Growth", "Scale"];
const ALLOWED_INTERVALS = ["monthly", "yearly"] as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to upgrade" }, { status: 401 });
  }

  if (!razorpayConfigured()) {
    return NextResponse.json(
      { error: "Razorpay is not configured. Use Stripe or PayPal for international." },
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

  const plan = await prisma.Plan.findFirst({
    where: { name: planName, isActive: true }});
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const razorpayPlanId =
    interval === "yearly" ? plan.razorpayPlanIdYearly : plan.razorpayPlanIdMonthly;
  if (!razorpayPlanId) {
    return NextResponse.json(
      { error: `Razorpay plan for ${planName} (${interval}) is not set up. Add plan IDs in DB/seed.` },
      { status: 503 }
    );
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const razorpay = getRazorpay();
  if (!razorpay) {
    return NextResponse.json({ error: "Razorpay not configured" }, { status: 503 });
  }

  // total_count: 12 for monthly (12 cycles), 1 for yearly (1 cycle)
  const totalCount = interval === "yearly" ? 1 : 12;

  try {
    const subscription = await razorpay.subscriptions.create({
      plan_id: razorpayPlanId,
      total_count: totalCount,
      customer_notify: 1,
      notes: { userId: ownerId, planName }});

    return NextResponse.json({
      subscriptionId: subscription.id,
      shortUrl: subscription.short_url});
  } catch (e) {
    console.error("Razorpay create subscription error:", e);
    return NextResponse.json(
      { error: "Could not create Razorpay subscription" },
      { status: 500 }
    );
  }
}
