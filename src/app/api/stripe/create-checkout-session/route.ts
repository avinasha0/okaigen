import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { auth } from "@/lib/auth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";
import type { PlanName } from "@/lib/plans-config";

const ALLOWED_PLANS: PlanName[] = ["Growth", "Scale"];
const ALLOWED_INTERVALS = ["monthly", "yearly"] as const;

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Sign in to upgrade" }, { status: 401 });
  }

  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Billing is not configured. Contact support." },
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
    return NextResponse.json(
      { error: "Invalid plan. Choose Growth or Scale." },
      { status: 400 }
    );
  }
  if (!interval || !ALLOWED_INTERVALS.includes(interval)) {
    return NextResponse.json(
      { error: "Invalid interval. Use monthly or yearly." },
      { status: 400 }
    );
  }

  const plan = await prisma.plan.findFirst({
    where: { name: planName, isActive: true }});
  if (!plan) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const priceId =
    interval === "yearly"
      ? plan.stripePriceIdYearly
      : plan.stripePriceIdMonthly;
  if (!priceId) {
    return NextResponse.json(
      {
        error: `Checkout for ${planName} (${interval}) is not set up. Add Stripe Price IDs in Dashboard and run db:seed.`},
      { status: 503 }
    );
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const user = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { stripeCustomerId: true, email: true, name: true }});
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing is not configured" },
      { status: 503 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/pricing?success=true`,
    cancel_url: `${appUrl}/dashboard/pricing?canceled=true`,
    client_reference_id: ownerId,
    subscription_data: {
      metadata: { userId: ownerId, planName },
      trial_period_days: undefined},
    allow_promotion_codes: true};

  if (user.stripeCustomerId) {
    sessionParams.customer = user.stripeCustomerId;
  } else {
    sessionParams.customer_email = user.email;
    sessionParams.customer_creation = "always";
  }

  try {
    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    return NextResponse.json({
      url: checkoutSession.url,
      sessionId: checkoutSession.id});
  } catch (e) {
    console.error("Stripe checkout error:", e);
    return NextResponse.json(
      { error: "Could not create checkout session" },
      { status: 500 }
    );
  }
}
