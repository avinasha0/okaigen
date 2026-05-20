import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { SuperadminShell } from "@/components/superadmin/superadmin-shell";
import { SuperadminAccessDenied } from "@/components/superadmin/access-denied";

export const metadata: Metadata = {
  title: "Superadmin",
  robots: { index: false, follow: false },
};

export default async function SuperadminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/superadmin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperadmin: true },
  });

  if (!user?.isSuperadmin) {
    return <SuperadminAccessDenied />;
  }

  return <SuperadminShell userEmail={session.user.email}>{children}</SuperadminShell>;
}
