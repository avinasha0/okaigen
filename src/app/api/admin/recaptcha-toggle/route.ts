import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { z } from "zod";

const schema = z.object({
  enabled: z.boolean()});

/**
 * Admin API route to toggle reCAPTCHA on/off
 * Note: Currently uses environment variable only (siteSetting model not in schema)
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

    // Note: Database model doesn't exist, so we just return success
    // In production, update RECAPTCHA_ENABLED environment variable
    // For now, this is a read-only endpoint that checks env var

    return NextResponse.json({ 
      success: true, 
      enabled,
      note: "reCAPTCHA status is controlled by RECAPTCHA_ENABLED environment variable. Update .env file to change." 
    });
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
 * Reads from RECAPTCHA_ENABLED environment variable
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

    // Read from environment variable (siteSetting model doesn't exist in schema)
    const enabled = process.env.RECAPTCHA_ENABLED === "true";

    return NextResponse.json({ enabled });
  } catch (error) {
    console.error("reCAPTCHA status error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
