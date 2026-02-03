import { PrismaClient } from "@prisma/client";
import { PLAN_NAMES, getPlanLimitsForDb, type PlanName } from "../src/lib/plans-config";

const prisma = new PrismaClient();

const PRICES: Record<PlanName, number> = {
  Starter: 0,
  Growth: 49,
  Scale: 149,
  Enterprise: 999};

async function main() {
  const existingFree = await prisma.Plan.findFirst({ where: { name: "Free" } });
  if (existingFree) {
    await prisma.Plan.update({
      where: { id: existingFree.id },
      data: { name: "Starter", dailyLimit: 10, botLimit: 1 }});
    console.log("Migrated plan Free → Starter");
  }

  const existingPro = await prisma.Plan.findFirst({ where: { name: "Pro" } });
  if (existingPro) {
    await prisma.Plan.update({
      where: { id: existingPro.id },
      data: { name: "Growth", dailyLimit: 70, botLimit: 3 }});
    console.log("Migrated plan Pro → Growth");
  }

  const stripePriceIds: Record<string, { monthly?: string; yearly?: string }> = {
    Growth: { monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY, yearly: process.env.STRIPE_PRICE_GROWTH_YEARLY },
    Scale: { monthly: process.env.STRIPE_PRICE_SCALE_MONTHLY, yearly: process.env.STRIPE_PRICE_SCALE_YEARLY }};
  const razorpayPlanIds: Record<string, { monthly?: string; yearly?: string }> = {
    Growth: { monthly: process.env.RAZORPAY_PLAN_GROWTH_MONTHLY, yearly: process.env.RAZORPAY_PLAN_GROWTH_YEARLY },
    Scale: { monthly: process.env.RAZORPAY_PLAN_SCALE_MONTHLY, yearly: process.env.RAZORPAY_PLAN_SCALE_YEARLY }};
  const paypalPlanIds: Record<string, { monthly?: string; yearly?: string }> = {
    Growth: { monthly: process.env.PAYPAL_PLAN_GROWTH_MONTHLY, yearly: process.env.PAYPAL_PLAN_GROWTH_YEARLY },
    Scale: { monthly: process.env.PAYPAL_PLAN_SCALE_MONTHLY, yearly: process.env.PAYPAL_PLAN_SCALE_YEARLY }};

  for (const name of PLAN_NAMES) {
    const limits = getPlanLimitsForDb(name);
    const price = PRICES[name];
    const stripeIds = stripePriceIds[name as keyof typeof stripePriceIds];
    const razorpayIds = razorpayPlanIds[name as keyof typeof razorpayPlanIds];
    const paypalIds = paypalPlanIds[name as keyof typeof paypalPlanIds];

    const existing = await prisma.Plan.findFirst({ where: { name } });
    const planData = {
      dailyLimit: limits.dailyLimit,
      botLimit: limits.botLimit,
      storageLimit: limits.storageLimit,
      teamMemberLimit: limits.teamMemberLimit,
      price,
      stripePriceIdMonthly: stripeIds?.monthly || null,
      stripePriceIdYearly: stripeIds?.yearly || null,
      razorpayPlanIdMonthly: razorpayIds?.monthly || null,
      razorpayPlanIdYearly: razorpayIds?.yearly || null,
      paypalPlanIdMonthly: paypalIds?.monthly || null,
      paypalPlanIdYearly: paypalIds?.yearly || null,
      isActive: true};
    if (existing) {
      await prisma.Plan.update({
        where: { id: existing.id },
        data: planData});
      console.log(`Plan ${name} updated`);
    } else {
      await prisma.Plan.create({
        data: {name, 
          ...planData,
          updatedAt: new Date()}});
      console.log(`Plan ${name} created`);
    }
  }

  console.log("Plans: Starter, Growth, Scale, Enterprise");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
