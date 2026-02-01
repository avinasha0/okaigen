import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { isAccountOwner } from "@/lib/team";

/** DELETE cancel a pending invitation. Owner only. */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner = await isAccountOwner(session.user.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Only the account owner can cancel invitations" }, { status: 403 });
  }

  const { id } = await params;

  const invitation = await prisma.teamInvitation.findFirst({
    where: { id, accountOwnerId: session.user.id },
  });

  if (!invitation) {
    return NextResponse.json({ error: "Invitation not found" }, { status: 404 });
  }

  await prisma.teamInvitation.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
