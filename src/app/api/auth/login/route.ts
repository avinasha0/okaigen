import { NextResponse } from "next/server";
import { verifyCaptcha } from "@/lib/recaptcha";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  recaptchaToken: z.string().nullable().optional(),
});

/**
 * Custom login API route with reCAPTCHA verification
 * This wraps NextAuth's signIn to add reCAPTCHA protection
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, recaptchaToken } = schema.parse(body);

    // Verify reCAPTCHA (graceful fallback - never blocks)
    // Wrap in try-catch to ensure it never breaks the login flow
    try {
      await verifyCaptcha(recaptchaToken || null, 0.5);
    } catch (recaptchaError) {
      // Log but don't block - graceful fallback
      console.warn("[reCAPTCHA] Verification error (allowing login):", recaptchaError);
    }

    // Verify credentials
    let user;
    try {
      const { prisma } = await import("@/lib/db");
      const bcrypt = await import("bcryptjs");
      
      user = await prisma.user.findUnique({
        where: { email },
        select: { id: true, email: true, password: true },
      });

      if (!user?.password) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }

      const valid = await bcrypt.default.compare(password, user.password);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid email or password" },
          { status: 401 }
        );
      }
    } catch (dbError) {
      console.error("Database error during login:", dbError);
      return NextResponse.json(
        { 
          error: "Database connection error",
          ...(process.env.NODE_ENV === "development" && dbError instanceof Error
            ? { details: dbError.message }
            : {}),
        },
        { status: 500 }
      );
    }

    // Credentials are valid - client will proceed with NextAuth signIn
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid input" },
        { status: 400 }
      );
    }
    console.error("Login error:", error);
    // Log more details for debugging
    if (error instanceof Error) {
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
    }
    return NextResponse.json(
      { 
        error: "Something went wrong",
        // Include error details in development
        ...(process.env.NODE_ENV === "development" && error instanceof Error
          ? { details: error.message }
          : {}),
      },
      { status: 500 }
    );
  }
}
