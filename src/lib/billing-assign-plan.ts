import { prisma } from "./db";

/**
 * Assign a paid plan to a user by plan name (e.g. Growth, Scale).
 * Used by Stripe, Razorpay, and PayPal webhooks after successful payment.
 */
export async function assignPlanToUser(
  userId: string,
  planName: string,
  options: {
    currentPeriodEnd?: Date | null;
    stripeSubscriptionId?: string | null;
    razorpaySubscriptionId?: string | null;
    paypalSubscriptionId?: string | null;
  } = {}
) {
  const plan = await prisma.plan.findFirst({
    where: { name: planName, isActive: true }});
  if (!plan) {
    console.warn("assignPlanToUser: plan not found", planName);
    return;
  }

  await prisma.userPlan.upsert({
    where: { userId },
    create: {

      userId,
      planId: plan.id,
      currentPeriodEnd: options.currentPeriodEnd ?? null,
      stripeSubscriptionId: options.stripeSubscriptionId ?? null,
      razorpaySubscriptionId: options.razorpaySubscriptionId ?? null,
      paypalSubscriptionId: options.paypalSubscriptionId ?? null},
    update: {
      planId: plan.id,
      currentPeriodEnd: options.currentPeriodEnd ?? undefined,
      stripeSubscriptionId: options.stripeSubscriptionId ?? undefined,
      razorpaySubscriptionId: options.razorpaySubscriptionId ?? undefined,
      paypalSubscriptionId: options.paypalSubscriptionId ?? undefined}});
}

/**
 * Downgrade user to Starter (e.g. after subscription cancelled).
 */
export async function downgradeUserToStarter(userId: string) {
  const starterPlan = await prisma.plan.findFirst({
    where: { name: "Starter", isActive: true }});
  if (!starterPlan) return;

  await prisma.userPlan.upsert({
    where: { userId },
    create: {

      userId,
      planId: starterPlan.id,
      stripeSubscriptionId: null,
      razorpaySubscriptionId: null,
      paypalSubscriptionId: null,
      currentPeriodEnd: null},
    update: {
      planId: starterPlan.id,
      stripeSubscriptionId: null,
      razorpaySubscriptionId: null,
      paypalSubscriptionId: null,
      currentPeriodEnd: null}});
}
