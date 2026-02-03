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
    if (!ownerId) {
      console.error("getPlanUsage: No ownerId returned from getEffectiveOwnerId");
      return null;
    }

    let userPlan;
    try {
      userPlan = await prisma.userplan.findUnique({
        where: { userId: ownerId },
        include: { plan: true },
      });
    } catch (dbError: unknown) {
      console.error("Failed to get user plan:", dbError);
      return null;
    }

    if (!userPlan) {
      // Ensure Starter plan exists - create if missing
      let starterPlan = await prisma.plan.findFirst({
        where: { name: "Starter", isActive: true },
      });

      if (!starterPlan) {
        // Create Starter plan if it doesn't exist
        const { getPlanLimitsForDb } = await import("./plans-config");
        const limits = getPlanLimitsForDb("Starter");
        starterPlan = await prisma.plan.create({
          data: {
            name: "Starter",
            dailyLimit: limits.dailyLimit,
            botLimit: limits.botLimit,
            storageLimit: limits.storageLimit,
            teamMemberLimit: limits.teamMemberLimit,
            price: 0,
            isActive: true,
          },
        });
        console.log("Created missing Starter plan");
      }

      // Assign Starter plan to user
      try {
        userPlan = await prisma.userplan.create({
          data: { userId: ownerId, planId: starterPlan.id },
          include: { plan: true },
        });
        console.log(`Assigned Starter plan to user ${ownerId}`);
      } catch (createError: unknown) {
        // If create fails (e.g., race condition), try to fetch again
        if (createError instanceof Error && createError.message.includes("Unique constraint")) {
          userPlan = await prisma.userplan.findUnique({
            where: { userId: ownerId },
            include: { plan: true },
          });
        }
        if (!userPlan) {
          console.error("Failed to create user plan:", createError);
          return null;
        }
      }
    }

    // Ensure we have a valid plan
    if (!userPlan || !userPlan.plan) {
      console.error("getPlanUsage: userPlan or plan is null after assignment");
      return null;
    }

    const plan = userPlan.plan;
    
    let botIds: Array<{ id: string }>;
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
      messagesResult = await prisma.usagelog.aggregate({
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
      memberCount = await prisma.accountmember.count({
        where: { accountOwnerId: ownerId },
      });
    } catch (dbError: unknown) {
      console.error("Failed to get team member count:", dbError);
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
    console.error("getPlanUsage error:", error);
    // Log the full error for debugging
    if (error instanceof Error) {
      console.error("getPlanUsage error details:", error.message, error.stack);
    }
    return null;
  }
}

/** Get plan and usage for the effective account (owner). No caching to ensure plan changes are immediately reflected. */
export async function getPlanUsage(userId: string): Promise<PlanUsage | null> {
  // Permanent fix: No caching - always fetch fresh data from database
  // This ensures plan changes (via SQL or API) are immediately reflected
  // Plan data changes infrequently, so accuracy is more important than cache performance
  return getPlanUsageUncached(userId);
}
