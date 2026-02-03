import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { getEffectiveOwnerId } from "@/lib/team";

/** Revoke (delete) an API key. User must own the key (or be team member of owner). */
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
  const key = await prisma.apikey.findFirst({
    where: { id, userId: ownerId },
  });
  if (!key) {
    return NextResponse.json({ error: "API key not found" }, { status: 404 });
  }
  await prisma.apikey.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
