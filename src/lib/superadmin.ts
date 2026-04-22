import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function requireSuperadmin() {
  const session = await auth();
  const email = session?.user?.email?.toLowerCase() ?? "";
  if (!email) {
    return { ok: false as const, session };
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { isSuperadmin: true },
  });

  if (!user?.isSuperadmin) {
    return { ok: false as const, session };
  }

  return { ok: true as const, session };
}

