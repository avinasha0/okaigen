import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { verifyCaptcha } from "@/lib/recaptcha";
import { z } from "zod";
import crypto from "crypto";

const schema = z.object({
  email: z.string().email(),
  recaptchaToken: z.string().nullable().optional(),
});

const RESET_EXPIRY_HOURS = 1;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, recaptchaToken } = schema.parse(body);

    // Verify reCAPTCHA (graceful fallback - never blocks)
    await verifyCaptcha(recaptchaToken || null, 0.5);

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Always return success to avoid email enumeration
    if (!user || !user.password) {
      return NextResponse.json({ success: true, message: "If that email is registered, you'll receive a reset link." });
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + RESET_EXPIRY_HOURS * 60 * 60 * 1000);
    const identifier = `password-reset:${user.email}`;

    await prisma.verificationtoken.deleteMany({
      where: { identifier },
    });
    await prisma.verificationtoken.create({
      data: { identifier, token, expires },
    });

    const resetUrl = `${APP_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const sent = await sendEmail({
      to: user.email,
      subject: "Reset your SiteBotGPT password",
      text: `You requested a password reset. Click the link below to set a new password (valid for ${RESET_EXPIRY_HOURS} hour):\n\n${resetUrl}\n\nIf you didn't request this, you can ignore this email.`,
    });

    if (!sent) {
      console.error("Forgot password: failed to send email");
      return NextResponse.json(
        { error: "Unable to send reset email. Please try again later." },
        { status: 503 }
      );
    }

    return NextResponse.json({ success: true, message: "If that email is registered, you'll receive a reset link." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
