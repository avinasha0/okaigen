import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Superadmin",
  robots: { index: false, follow: false },
};

export default async function SuperadminEntryPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login?callbackUrl=/superadmin");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { isSuperadmin: true },
  });

  if (!user?.isSuperadmin) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <h1 className="text-xl font-semibold text-slate-900">Superadmin</h1>
        <p className="mt-2 text-sm text-slate-600">
          You are logged in, but this account is not marked as <strong>superadmin</strong> in the database this deployment
          is connected to.
        </p>
        <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700">
          Open <Link className="underline" href="/api/auth/whoami">/api/auth/whoami</Link> to confirm the user record and
          database URL the app is using.
        </div>
        <div className="mt-6">
          <Link className="text-sm font-medium text-[#1a6aff] hover:underline" href="/dashboard">
            Go to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Superadmin</h1>
        <p className="mt-0.5 text-sm text-slate-500">Global configuration for this application.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>SMTP</CardTitle>
            <CardDescription>Configure outgoing email and send a test email.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link className="text-sm font-medium text-[#1a6aff] hover:underline" href="/superadmin/smtp">
              Open SMTP settings
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

