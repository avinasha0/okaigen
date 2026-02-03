import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getStripe, stripeConfigured } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";

/** Create a Stripe Customer Portal session so the user can manage subscription and payment method. */
export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Sign in to manage billing" }, { status: 401 });
  }

  if (!stripeConfigured()) {
    return NextResponse.json(
      { error: "Billing is not configured. Contact support." },
      { status: 503 }
    );
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const user = await prisma.user.findUnique({
    where: { id: ownerId },
    select: { stripeCustomerId: true }});

  if (!user?.stripeCustomerId) {
    return NextResponse.json(
      { error: "No billing account found. Subscribe to a plan first." },
      { status: 400 }
    );
  }

  const stripe = getStripe();
  if (!stripe) {
    return NextResponse.json(
      { error: "Billing is not configured" },
      { status: 503 }
    );
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

  try {
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${appUrl}/dashboard/settings`});
    return NextResponse.json({
      url: portalSession.url});
  } catch (e) {
    console.error("Stripe portal error:", e);
    return NextResponse.json(
      { error: "Could not open billing portal" },
      { status: 500 }
    );
  }
}
