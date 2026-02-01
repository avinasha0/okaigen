import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";
import crypto from "crypto";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  name: z.string().min(1).optional(),
  acceptTerms: z.boolean().refine((v) => v === true, { message: "You must agree to the Terms of Service and Privacy Policy" }),
});

const VERIFY_EXPIRY_DAYS = 7;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || process.env.NEXTAUTH_URL || "http://localhost:3000";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, name, acceptTerms } = schema.parse(body);

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        password: hashedPassword,
        termsAcceptedAt: new Date(),
      },
    });

    // Email verification: send link (optional; user can still sign in)
    const verifyToken = crypto.randomBytes(32).toString("hex");
    const verifyExpires = new Date(Date.now() + VERIFY_EXPIRY_DAYS * 24 * 60 * 60 * 1000);
    const identifier = `email-verification:${user.id}`;
    await prisma.verificationToken.create({
      data: { identifier, token: verifyToken, expires: verifyExpires },
    });
    const verifyUrl = `${APP_URL}/api/auth/verify-email?token=${encodeURIComponent(verifyToken)}`;
    await sendEmail({
      to: user.email,
      subject: "Verify your SiteBotGPT email",
      text: `Welcome! Please verify your email by clicking this link (valid for ${VERIFY_EXPIRY_DAYS} days):\n\n${verifyUrl}\n\nIf you didn't create an account, you can ignore this email.`,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const msg = error.issues[0]?.message || "Invalid input";
      return NextResponse.json({ error: msg }, { status: 400 });
    }
    console.error("Register error:", error);
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
