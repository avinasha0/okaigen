import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export const metadata = {
  title: "Superadmin",
  robots: { index: false, follow: false },
};

export default async function SuperadminEntryPage() {
  const session = await auth();
  if (!session?.user?.email) {
    redirect("/login?callbackUrl=/superadmin");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email.toLowerCase() },
    select: { isSuperadmin: true },
  });

  if (!user?.isSuperadmin) {
    redirect("/dashboard");
  }

  redirect("/superadmin/smtp");
}

