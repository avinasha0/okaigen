import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

/** Stripe webhook: do not parse body as JSON so we can verify signature with raw body. */
export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    console.error("Stripe or STRIPE_WEBHOOK_SECRET not configured");
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 }
    );
  }

  const rawBody = await request.text();
  const sig = request.headers.get("stripe-signature");
  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("Stripe webhook signature verification failed:", message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;
        const userId = (session.client_reference_id || session.metadata?.userId) as string | undefined;
        if (!userId) {
          console.error("checkout.session.completed: no client_reference_id or metadata.userId");
          break;
        }
        await linkSubscriptionToUser(stripe, userId, session.customer as string, session.subscription as string);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          await syncUserPlanFromSubscription(stripe, userId, sub);
        }
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (userId) {
          await downgradeUserToStarter(userId);
        }
        break;
      }
      case "customer.created": {
        // Optional: if we created customer in checkout, we already get customer id from session
        break;
      }
      default:
        // Unhandled event type
        break;
    }
  } catch (err) {
    console.error("Stripe webhook handler error:", err);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ received: true });
}

async function linkSubscriptionToUser(
  stripe: Stripe,
  userId: string,
  customerId: string,
  subscriptionId: string
) {
  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId },
  });

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["items.data.price"],
  });
  await syncUserPlanFromSubscription(stripe, userId, subscription);
}

async function syncUserPlanFromSubscription(stripe: Stripe, userId: string, sub: Stripe.Subscription) {
  if (sub.status !== "active" && sub.status !== "trialing") return;

  const priceId =
    typeof sub.items.data[0]?.price === "object"
      ? sub.items.data[0].price.id
      : (sub.items.data[0]?.price as string);
  if (!priceId) return;

  const plan = await prisma.plan.findFirst({
    where: {
      isActive: true,
      OR: [
        { stripePriceIdMonthly: priceId },
        { stripePriceIdYearly: priceId },
      ],
    },
  });
  if (!plan) {
    console.warn("Stripe webhook: no plan found for price id", priceId);
    return;
  }

  const periodEnd = (sub as { current_period_end?: number }).current_period_end;
  const currentPeriodEnd = periodEnd ? new Date(periodEnd * 1000) : null;

  await prisma.userPlan.upsert({
    where: { userId },
    create: {
      userId,
      planId: plan.id,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      currentPeriodEnd,
    },
    update: {
      planId: plan.id,
      stripeSubscriptionId: sub.id,
      stripePriceId: priceId,
      currentPeriodEnd,
    },
  });
}

async function downgradeUserToStarter(userId: string) {
  const starterPlan = await prisma.plan.findFirst({
    where: { name: "Starter", isActive: true },
  });
  if (!starterPlan) return;

  await prisma.userPlan.upsert({
    where: { userId },
    create: {
      userId,
      planId: starterPlan.id,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodEnd: null,
    },
    update: {
      planId: starterPlan.id,
      stripeSubscriptionId: null,
      stripePriceId: null,
      currentPeriodEnd: null,
    },
  });
}
