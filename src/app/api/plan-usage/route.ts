import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getPlanUsage } from "@/lib/plan-usage";

/** GET current user's plan usage (for client-side limit checks). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const planUsage = await getPlanUsage(session.user.id);
  return NextResponse.json(planUsage ?? { planName: "", usedMessages: 0, totalMessages: 0, usedBots: 0, totalBots: 0, usedTeamMembers: 0, totalTeamMembers: 1 });
}
