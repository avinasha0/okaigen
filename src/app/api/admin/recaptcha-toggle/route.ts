import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  enabled: z.boolean(),
});

/**
 * Admin API route to toggle reCAPTCHA on/off
 * Requires authenticated user (admin check can be added later)
 */
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { enabled } = schema.parse(body);

    // Upsert the setting (create or update)
    await prisma.siteSetting.upsert({
      where: { key: "recaptcha_enabled" },
      update: { value: enabled ? "true" : "false" },
      create: {
        key: "recaptcha_enabled",
        value: enabled ? "true" : "false",
      },
    });

    return NextResponse.json({ success: true, enabled });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }
    console.error("reCAPTCHA toggle error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

/**
 * Get current reCAPTCHA enabled status
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check DB setting first, fallback to env
    const setting = await prisma.siteSetting.findUnique({
      where: { key: "recaptcha_enabled" },
    });

    const dbEnabled = setting?.value === "true";
    const envEnabled = process.env.RECAPTCHA_ENABLED === "true";
    
    // DB setting takes precedence, but if not set, use env
    const enabled = setting ? dbEnabled : envEnabled;

    return NextResponse.json({ enabled });
  } catch (error) {
    console.error("reCAPTCHA status error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
