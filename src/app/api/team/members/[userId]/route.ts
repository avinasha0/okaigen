import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAccountOwner } from "@/lib/team";

/** DELETE remove a team member. Owner only, or member can remove themselves (leave). */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { userId: targetUserId } = await params;
  const isOwner = await isAccountOwner(session.user.id);

  if (targetUserId === session.user.id) {
    if (!isOwner) {
      const membership = await prisma.accountMember.findFirst({
        where: { memberUserId: session.user.id }});
      if (membership) {
        await prisma.accountMember.delete({ where: { id: membership.id } });
        return NextResponse.json({ success: true, message: "You have left the team" });
      }
    }
    return NextResponse.json({ error: "Owner cannot remove themselves. Transfer ownership first." }, { status: 400 });
  }

  if (!isOwner) {
    return NextResponse.json({ error: "Only the account owner can remove team members" }, { status: 403 });
  }

  const membership = await prisma.accountMember.findFirst({
    where: {
      accountOwnerId: session.user.id,
      memberUserId: targetUserId}});

  if (!membership) {
    return NextResponse.json({ error: "Team member not found" }, { status: 404 });
  }

  await prisma.accountMember.delete({ where: { id: membership.id } });
  return NextResponse.json({ success: true });
}
