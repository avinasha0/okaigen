import { prisma } from "./db";

const START_OF_TODAY = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

export type PlanUsage = {
  planName: string;
  usedMessages: number;
  totalMessages: number;
  usedBots: number;
  totalBots: number;
};

/** Get user's plan and current usage. Assigns default Free plan if user has none. */
export async function getPlanUsage(userId: string): Promise<PlanUsage | null> {
  let userPlan = await prisma.userPlan.findUnique({
    where: { userId },
    include: { plan: true },
  });

  if (!userPlan) {
    const freePlan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    if (!freePlan) return null;
    userPlan = await prisma.userPlan.create({
      data: { userId, planId: freePlan.id },
      include: { plan: true },
    });
  }

  const plan = userPlan.plan;
  const botIds = await prisma.bot.findMany({
    where: { userId },
    select: { id: true },
  });
  const botIdList = botIds.map((b) => b.id);

  const startOfToday = START_OF_TODAY();
  const messagesResult = await prisma.usageLog.aggregate({
    where: {
      botId: { in: botIdList },
      type: "message",
      createdAt: { gte: startOfToday },
    },
    _sum: { count: true },
  });

  const usedMessages = messagesResult._sum.count ?? 0;
  const usedBots = botIds.length;

  return {
    planName: plan.name,
    usedMessages,
    totalMessages: plan.dailyLimit,
    usedBots,
    totalBots: plan.botLimit,
  };
}
