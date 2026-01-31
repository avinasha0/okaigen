import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum(["new", "contacted", "qualified", "converted", "lost"]),
});

/** PATCH: Update lead status */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ leadId: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { leadId } = await params;
    const body = await req.json().catch(() => ({}));
    const parsed = statusSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({
      where: { id: leadId },
      include: { bot: { select: { userId: true } } },
    });

    if (!lead || !lead.bot || lead.bot.userId !== session.user.id) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const status = parsed.data.status;
    await prisma.$executeRaw`
      UPDATE Lead SET status = ${status} WHERE id = ${leadId}
    `;
    const updated = await prisma.lead.findUniqueOrThrow({
      where: { id: leadId },
    });

    return NextResponse.json(updated);
  } catch (err) {
    console.error("[PATCH /api/leads/[leadId]]", err);
    const message = err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { error: "Failed to update lead", details: message },
      { status: 500 }
    );
  }
}
