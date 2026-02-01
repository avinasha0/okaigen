import { prisma } from "./db";

const START_OF_TODAY = () => {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
};

import { getEffectiveOwnerId } from "./team";

export type PlanUsage = {
  planName: string;
  usedMessages: number;
  totalMessages: number;
  usedBots: number;
  totalBots: number;
  usedTeamMembers: number;
  totalTeamMembers: number;
};

/** Get plan and usage for the effective account (owner). Members see owner's plan/usage. */
export async function getPlanUsage(userId: string): Promise<PlanUsage | null> {
  const ownerId = await getEffectiveOwnerId(userId);

  let userPlan = await prisma.userPlan.findUnique({
    where: { userId: ownerId },
    include: { plan: true },
  });

  if (!userPlan) {
    const defaultPlan = await prisma.plan.findFirst({
      where: { isActive: true },
      orderBy: { price: "asc" },
    });
    if (!defaultPlan) return null;
    userPlan = await prisma.userPlan.create({
      data: { userId: ownerId, planId: defaultPlan.id },
      include: { plan: true },
    });
  }

  const plan = userPlan.plan;
  const botIds = await prisma.bot.findMany({
    where: { userId: ownerId },
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

  const memberCount = await prisma.accountMember.count({
    where: { accountOwnerId: ownerId },
  });
  const usedTeamMembers = 1 + memberCount;
  const totalTeamMembers = plan.teamMemberLimit ?? 1;

  return {
    planName: plan.name,
    usedMessages,
    totalMessages: plan.dailyLimit,
    usedBots,
    totalBots: plan.botLimit,
    usedTeamMembers,
    totalTeamMembers,
  };
}
