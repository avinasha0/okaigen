import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

/** POST accept a team invitation by token. Requires auth (invitee must be logged in). */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "You must be logged in to accept an invitation" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const token = (body.token as string)?.trim();
  if (!token) {
    return NextResponse.json({ error: "Token required" }, { status: 400 });
  }

  const invitation = await prisma.TeamInvitation.findUnique({
    where: { token },
    include: { user: { select: { id: true, email: true } } }});

  if (!invitation) {
    return NextResponse.json({ error: "Invalid or expired invitation" }, { status: 404 });
  }
  if (invitation.expiresAt < new Date()) {
    await prisma.TeamInvitation.delete({ where: { id: invitation.id } });
    return NextResponse.json({ error: "Invitation has expired" }, { status: 410 });
  }
  if (invitation.accountOwnerId === session.user.id) {
    await prisma.TeamInvitation.delete({ where: { id: invitation.id } });
    return NextResponse.json({ error: "You cannot accept your own invitation" }, { status: 400 });
  }

  const normalizedInviteEmail = invitation.email.toLowerCase();
  const userEmail = (session.user.email as string)?.toLowerCase();
  if (normalizedInviteEmail !== userEmail) {
    return NextResponse.json(
      { error: `This invitation was sent to ${invitation.email}. Please log in with that email to accept.` },
      { status: 403 }
    );
  }

  await prisma.$transaction([
    prisma.AccountMember.create({
      data: {
        accountOwnerId: invitation.accountOwnerId,
        memberUserId: session.user.id,
        role: invitation.role}}),
    prisma.TeamInvitation.delete({ where: { id: invitation.id } }),
  ]);

  return NextResponse.json({
    success: true,
    message: `You've joined the team. You now have access to ${invitation.user.email}'s dashboard.`});
}
