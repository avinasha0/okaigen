import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";

/** Delete a webhook. User must own it (or be team member of owner). */
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const ownerId = await getEffectiveOwnerId(session.user.id);
  const { id } = await params;
  const webhook = await prisma.webhook.findFirst({
    where: { id, userId: ownerId },
  });
  if (!webhook) {
    return NextResponse.json({ error: "Webhook not found" }, { status: 404 });
  }
  await prisma.webhook.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
