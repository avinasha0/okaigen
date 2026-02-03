import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId, getTeamMemberCount, isAccountOwner } from "@/lib/team";
import { getPlanUsage } from "@/lib/plan-usage";

/** GET team members and pending invitations for the account (owner only sees; members see owner's team). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const ownerId = await getEffectiveOwnerId(session.user.id);
  const canManage = await isAccountOwner(session.user.id);

  const [members, invitations] = await Promise.all([
    prisma.AccountMember.findMany({
      where: { accountOwnerId: ownerId },
      include: { user_accountmember_memberUserIdTouser: { select: { id: true, email: true, name: true } } },
      orderBy: { createdAt: "asc" }}),
    canManage
      ? prisma.TeamInvitation.findMany({
          where: { accountOwnerId: ownerId },
          orderBy: { createdAt: "desc" }})
      : [],
  ]);

  const planUsage = await getPlanUsage(session.user.id);
  const usedTeamMembers = planUsage?.usedTeamMembers ?? 1;
  const totalTeamMembers = planUsage?.totalTeamMembers ?? 1;
  const canInvite = canManage && usedTeamMembers < totalTeamMembers;

  return NextResponse.json({
    members: members.map((m) => ({
      id: m.memberUserId,
      email: m.user_accountmember_memberUserIdTouser.email,
      name: m.user_accountmember_memberUserIdTouser.name,
      role: m.role,
      joinedAt: m.createdAt})),
    invitations: invitations.map((i) => ({
      id: i.id,
      email: i.email,
      role: i.role,
      expiresAt: i.expiresAt,
      createdAt: i.createdAt})),
    canManage,
    usedTeamMembers,
    totalTeamMembers,
    canInvite,
    currentUserId: session.user.id});
}
