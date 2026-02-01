import { PrismaClient } from "@prisma/client";
import { PLAN_NAMES, getPlanLimitsForDb, type PlanName } from "../src/lib/plans-config";

const prisma = new PrismaClient();

const PRICES: Record<PlanName, number> = {
  Starter: 0,
  Growth: 49,
  Scale: 149,
  Enterprise: 999,
};

async function main() {
  const existingFree = await prisma.plan.findFirst({ where: { name: "Free" } });
  if (existingFree) {
    await prisma.plan.update({
      where: { id: existingFree.id },
      data: { name: "Starter", dailyLimit: 10, botLimit: 1 },
    });
    console.log("Migrated plan Free → Starter");
  }

  const existingPro = await prisma.plan.findFirst({ where: { name: "Pro" } });
  if (existingPro) {
    await prisma.plan.update({
      where: { id: existingPro.id },
      data: { name: "Growth", dailyLimit: 70, botLimit: 3 },
    });
    console.log("Migrated plan Pro → Growth");
  }

  for (const name of PLAN_NAMES) {
    const limits = getPlanLimitsForDb(name);
    const price = PRICES[name];
    const existing = await prisma.plan.findFirst({ where: { name } });
    if (existing) {
      await prisma.plan.update({
        where: { id: existing.id },
        data: {
          dailyLimit: limits.dailyLimit,
          botLimit: limits.botLimit,
          storageLimit: limits.storageLimit,
          teamMemberLimit: limits.teamMemberLimit,
          price,
          isActive: true,
        },
      });
      console.log(`Plan ${name} updated`);
    } else {
      await prisma.plan.create({
        data: {
          name,
          dailyLimit: limits.dailyLimit,
          botLimit: limits.botLimit,
          storageLimit: limits.storageLimit,
          teamMemberLimit: limits.teamMemberLimit,
          price,
          isActive: true,
        },
      });
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
