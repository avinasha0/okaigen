import { auth } from "./auth";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";

/**
 * Checks if user needs email verification (email/password users only).
 * Redirects to verify-email page if verification is required.
 * Returns true if user can proceed, false if redirected.
 */
export async function requireEmailVerification(): Promise<boolean> {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
    return false;
  }

  // Only require verification for email/password users (not OAuth)
  if (session.user.hasPassword && !session.user.emailVerified) {
    redirect("/verify-email");
    return false;
  }

  return true;
}

/**
 * Checks if email verification is required (for API routes).
 * Returns NextResponse with error if verification needed, null if OK.
 */
export function requireEmailVerificationForApi(session: { user?: { hasPassword?: boolean; emailVerified?: Date | null } | null } | null) {
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Only require verification for email/password users (not OAuth)
  if (session.user.hasPassword && !session.user.emailVerified) {
    return NextResponse.json(
      {
        error: "Email verification required",
        message: "Please verify your email before using this feature. Check your inbox for the verification link.",
      },
      { status: 403 }
    );
  }

  return null;
}
