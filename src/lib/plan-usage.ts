import { unstable_cache } from "next/cache";
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

async function getPlanUsageUncached(userId: string): Promise<PlanUsage | null> {
  try {
    const ownerId = await getEffectiveOwnerId(userId);
    if (!ownerId) return null;

    let userPlan;
    try {
      userPlan = await prisma.userPlan.findUnique({
        where: { userId: ownerId },
        include: { plan: true },
      });
    } catch (dbError: unknown) {
      console.error("Failed to get user plan:", dbError);
      return null;
    }

    if (!userPlan) {
      let defaultPlan;
      try {
        defaultPlan = await prisma.plan.findFirst({
          where: { isActive: true },
          orderBy: { price: "asc" },
        });
      } catch (dbError: unknown) {
        console.error("Failed to get default plan:", dbError);
        return null;
      }
      if (!defaultPlan) return null;
      
      try {
        userPlan = await prisma.userPlan.create({
          data: { userId: ownerId, planId: defaultPlan.id },
          include: { plan: true },
        });
      } catch (dbError: unknown) {
        console.error("Failed to create user plan:", dbError);
        return null;
      }
    }

    const plan = userPlan.plan;
    
    let botIds;
    try {
      botIds = await prisma.bot.findMany({
        where: { userId: ownerId },
        select: { id: true },
      });
    } catch (dbError: unknown) {
      console.error("Failed to get bots:", dbError);
      botIds = [];
    }
    const botIdList = botIds.map((b) => b.id);

    const startOfToday = START_OF_TODAY();
    let messagesResult;
    try {
      messagesResult = await prisma.usageLog.aggregate({
        where: {
          botId: { in: botIdList },
          type: "message",
          createdAt: { gte: startOfToday },
        },
        _sum: { count: true },
      });
    } catch (dbError: unknown) {
      console.error("Failed to get usage logs:", dbError);
      messagesResult = { _sum: { count: null } };
    }

    const usedMessages = messagesResult._sum.count ?? 0;
    const usedBots = botIds.length;

    let memberCount = 0;
    try {
      memberCount = await prisma.accountMember.count({
        where: { accountOwnerId: ownerId },
      });
    } catch (dbError: unknown) {
      // Handle database connection errors gracefully
      console.error("Failed to get team member count:", dbError);
      // Default to 0 if database is unreachable
      memberCount = 0;
    }
    
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
  } catch (error: unknown) {
    // Log database connection errors but don't crash
    console.error("getPlanUsage error:", error);
    // Return null to allow app to continue functioning
    return null;
  }
}

/** Get plan and usage for the effective account (owner). Cached 60s to speed up dashboard navigation. */
export function getPlanUsage(userId: string): Promise<PlanUsage | null> {
  return unstable_cache(
    (id: string) => getPlanUsageUncached(id),
    ["plan-usage", userId],
    { revalidate: 60 }
  )(userId);
}
