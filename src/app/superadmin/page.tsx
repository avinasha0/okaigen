import { redirect } from "next/navigation";
import { subDays } from "date-fns";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

function startOfTodayUtc() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

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

  const startOfToday = startOfTodayUtc();
  const weekAgo = subDays(new Date(), 7);

  const [usersToday, usersLastWeek, totalUsers] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count(),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-4 sm:px-6 md:px-8">
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-slate-900 sm:text-2xl">Superadmin</h1>
        <p className="mt-0.5 text-sm text-slate-500">Global configuration for this application.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Users today</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{usersToday}</p>
            <p className="mt-1 text-xs text-slate-500">Sign-ups since midnight UTC</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Users last 7 days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{usersLastWeek}</p>
            <p className="mt-1 text-xs text-slate-500">Rolling week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-500">Total users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-semibold text-slate-900">{totalUsers}</p>
            <p className="mt-1 text-xs text-slate-500">All accounts</p>
          </CardContent>
        </Card>
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

        <Card>
          <CardHeader>
            <CardTitle>Analytics</CardTitle>
            <CardDescription>Configure Google Analytics Measurement ID.</CardDescription>
          </CardHeader>
          <CardContent>
            <Link className="text-sm font-medium text-[#1a6aff] hover:underline" href="/superadmin/analytics">
              Open analytics settings
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
