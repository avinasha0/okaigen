import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const waitlistSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().max(255),
  planName: z.enum(["Growth", "Scale"]),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, planName } = waitlistSchema.parse(body);

    // Check if already on waitlist for this plan
    const existing = await prisma.waitlist.findUnique({
      where: {
        email_planName: {
          email,
          planName,
        },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "You're already on the waitlist for this plan" },
        { status: 400 }
      );
    }

    // Add to waitlist
    await prisma.waitlist.create({
      data: {
        name,
        email,
        planName,
      },
    });

    return NextResponse.json(
      { message: "Successfully added to waitlist" },
      { status: 201 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    console.error("Waitlist error:", error);
    return NextResponse.json(
      { error: "Failed to join waitlist. Please try again." },
      { status: 500 }
    );
  }
}
