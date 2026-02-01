import { prisma } from "./db";

/**
 * Returns the account owner ID for the current user.
 * If the user is a team member of someone else's account, returns that owner's ID.
 * Otherwise returns the user's own ID (they are the owner).
 */
export async function getEffectiveOwnerId(userId: string): Promise<string> {
  const membership = await prisma.accountMember.findFirst({
    where: { memberUserId: userId },
    select: { accountOwnerId: true },
  });
  return membership?.accountOwnerId ?? userId;
}

/** Count of team members (owner + invited members) for an account owner. */
export async function getTeamMemberCount(accountOwnerId: string): Promise<number> {
  const count = await prisma.accountMember.count({
    where: { accountOwnerId },
  });
  return 1 + count; // owner + members
}

/** Check if user can manage team (is account owner, not a member). */
export async function isAccountOwner(userId: string): Promise<boolean> {
  const membership = await prisma.accountMember.findFirst({
    where: { memberUserId: userId },
  });
  return !membership;
}

/** Get bot if current user can access it (owner or team member of owner). */
export async function getBotForUser(userId: string, botId: string) {
  const ownerId = await getEffectiveOwnerId(userId);
  return prisma.bot.findFirst({
    where: { id: botId, userId: ownerId },
  });
}
