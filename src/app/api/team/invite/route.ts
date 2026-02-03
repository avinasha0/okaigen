import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { randomBytes } from "crypto";
import { getPlanUsage } from "@/lib/plan-usage";
import { getTeamMemberCount, isAccountOwner } from "@/lib/team";
import { z } from "zod";

const inviteSchema = z.object({
  email: z.string().email(),
  role: z.enum(["admin", "member"]).default("member"),
});

/** POST invite a team member by email. Owner only. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isOwner = await isAccountOwner(session.user.id);
  if (!isOwner) {
    return NextResponse.json({ error: "Only the account owner can invite team members" }, { status: 403 });
  }

  const planUsage = await getPlanUsage(session.user.id);
  const usedTeamMembers = planUsage?.usedTeamMembers ?? 1;
  const totalTeamMembers = planUsage?.totalTeamMembers ?? 1;
  if (usedTeamMembers >= totalTeamMembers) {
    return NextResponse.json(
      { error: `Team limit reached (${totalTeamMembers}). Upgrade your plan to add more members.` },
      { status: 402 }
    );
  }

  const body = await req.json().catch(() => ({}));
  const parsed = inviteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email or role" }, { status: 400 });
  }
  const { email, role } = parsed.data;
  const normalizedEmail = email.trim().toLowerCase();

  const existingUser = await prisma.user.findUnique({
    where: { email: normalizedEmail },
    select: { id: true },
  });
  if (existingUser && existingUser.id === session.user.id) {
    return NextResponse.json({ error: "You cannot invite yourself" }, { status: 400 });
  }
  if (existingUser) {
    const alreadyMember = await prisma.accountmember.findUnique({
      where: {
        accountOwnerId_memberUserId: {
          accountOwnerId: session.user.id,
          memberUserId: existingUser.id,
        },
      },
    });
    if (alreadyMember) {
      return NextResponse.json({ error: "This user is already a team member" }, { status: 400 });
    }
  }

  const existingInvite = await prisma.teaminvitation.findFirst({
    where: {
      accountOwnerId: session.user.id,
      email: normalizedEmail,
      expiresAt: { gt: new Date() },
    },
  });
  if (existingInvite) {
    return NextResponse.json({ error: "An invitation was already sent to this email" }, { status: 400 });
  }

  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.teaminvitation.create({
    data: {
      accountOwnerId: session.user.id,
      email: normalizedEmail,
      role,
      token,
      expiresAt,
    },
  });

  const baseUrl = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const inviteLink = `${baseUrl}/dashboard/team/accept?token=${token}`;

  return NextResponse.json({
    success: true,
    inviteLink,
    expiresAt: expiresAt.toISOString(),
    message: "Invitation created. Share the invite link with the team member.",
  });
}
