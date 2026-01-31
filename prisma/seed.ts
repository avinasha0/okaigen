import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingFree = await prisma.plan.findFirst({ where: { name: "Free" } });
  if (existingFree) {
    console.log("Plans already seeded");
    return;
  }

  const freePlan = await prisma.plan.create({
    data: {
      name: "Free",
      dailyLimit: 100,
      botLimit: 3,
      storageLimit: 50,
      price: 0,
      isActive: true,
    },
  });

  const proPlan = await prisma.plan.create({
    data: {
      name: "Pro",
      dailyLimit: 10000,
      botLimit: 100,
      storageLimit: 500,
      price: 49,
      isActive: true,
    },
  });

  console.log("Seeded plans:", freePlan.name, proPlan.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
