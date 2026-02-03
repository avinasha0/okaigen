import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const VERIFY_EXPIRY_DAYS = 7;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=missing-token", req.url));
  }

  const record = await prisma.verificationtoken.findFirst({
    where: {
      identifier: { startsWith: "email-verification:" },
      token,
      expires: { gt: new Date() },
    },
  });

  if (!record) {
    return NextResponse.redirect(new URL("/login?error=invalid-or-expired", req.url));
  }

  const userId = record.identifier.replace(/^email-verification:/, "");
  await prisma.$transaction([
    prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date() },
    }),
    prisma.verificationtoken.deleteMany({
      where: { identifier: record.identifier },
    }),
  ]);

  return NextResponse.redirect(new URL("/login?verified=1", req.url));
}
