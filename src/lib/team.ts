import { prisma } from "./db";

/**
 * Returns the account owner ID for the current user.
 * If the user is a team member of someone else's account, returns that owner's ID.
 * Otherwise returns the user's own ID (they are the owner).
 */
export async function getEffectiveOwnerId(userId: string): Promise<string> {
  try {
    const membership = await prisma.accountMember.findFirst({
      where: { memberUserId: userId },
      select: { accountOwnerId: true },
    });
    return membership?.accountOwnerId ?? userId;
  } catch (error: unknown) {
    // Handle database connection errors gracefully
    console.error("Failed to get effective owner ID, defaulting to userId:", error);
    return userId;
  }
}

/** Count of team members (owner + invited members) for an account owner. */
export async function getTeamMemberCount(accountOwnerId: string): Promise<number> {
  try {
    const count = await prisma.accountMember.count({
      where: { accountOwnerId },
    });
    return 1 + count; // owner + members
  } catch (error: unknown) {
    // Handle database connection errors gracefully
    console.error("Failed to get team member count, defaulting to 1:", error);
    return 1; // owner only
  }
}

/** Check if user can manage team (is account owner, not a member). */
export async function isAccountOwner(userId: string): Promise<boolean> {
  try {
    const membership = await prisma.accountMember.findFirst({
      where: { memberUserId: userId },
    });
    return !membership;
  } catch (error: unknown) {
    // Handle database connection errors gracefully - assume user is owner
    console.error("Failed to check account owner status, defaulting to true:", error);
    return true;
  }
}

/** Get bot if current user can access it (owner or team member of owner). */
export async function getBotForUser(userId: string, botId: string) {
  try {
    const ownerId = await getEffectiveOwnerId(userId);
    return await prisma.bot.findFirst({
      where: { id: botId, userId: ownerId },
    });
  } catch (error: unknown) {
    // Handle database connection errors gracefully
    console.error("Failed to get bot for user:", error);
    return null;
  }
}
