import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import crypto from "crypto";

const VERIFY_EXPIRY_DAYS = 7;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Only allow resend for email/password users who haven't verified
    if (!session.user.hasPassword || session.user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified or not applicable" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { email: true, emailVerified: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json(
        { error: "Email already verified" },
        { status: 400 }
      );
    }

    // Delete old verification tokens
    await prisma.verificationtoken.deleteMany({
      where: {
        identifier: `email-verification:${session.user.id}`,
      },
    });

    // Create new verification token
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + VERIFY_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const identifier = `email-verification:${session.user.id}`;
    await prisma.verificationtoken.create({
      data: { identifier, token: verifyToken, expires: verifyExpires },
    });

    const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(verifyToken)}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your SiteBotGPT email",
      text: `Please verify your email by clicking this link (valid for ${VERIFY_EXPIRY_DAYS} days):\n\n${verifyUrl}\n\nIf you didn't request this, you can ignore this email.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to send verification email" },
      { status: 500 }
    );
  }
}
