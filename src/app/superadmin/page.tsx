import { subDays } from "date-fns";
import { BarChart3, Mail, UserPlus, Users, UsersRound } from "lucide-react";
import { prisma } from "@/lib/db";
import { SuperadminPageHeader } from "@/components/superadmin/page-header";
import { SuperadminStatCard } from "@/components/superadmin/stat-card";
import { SuperadminModuleCard } from "@/components/superadmin/module-card";

function startOfTodayUtc() {
  const d = new Date();
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

export default async function SuperadminOverviewPage() {
  const startOfToday = startOfTodayUtc();
  const weekAgo = subDays(new Date(), 7);

  const [usersToday, usersLastWeek, totalUsers] = await Promise.all([
    prisma.user.count({ where: { createdAt: { gte: startOfToday } } }),
    prisma.user.count({ where: { createdAt: { gte: weekAgo } } }),
    prisma.user.count(),
  ]);

  return (
    <>
      <SuperadminPageHeader
        title="Overview"
        description="Monitor platform growth and manage global application settings from one place."
      />

      <section aria-labelledby="metrics-heading">
        <h2 id="metrics-heading" className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          User metrics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SuperadminStatCard
            label="Users today"
            value={usersToday}
            hint="Sign-ups since midnight UTC"
            icon={UserPlus}
            accent="violet"
          />
          <SuperadminStatCard
            label="Users last 7 days"
            value={usersLastWeek}
            hint="Rolling 7-day window"
            icon={Users}
            accent="blue"
          />
          <SuperadminStatCard
            label="Total users"
            value={totalUsers}
            hint="All registered accounts"
            icon={UsersRound}
            accent="emerald"
          />
        </div>
      </section>

      <section aria-labelledby="config-heading" className="mt-10">
        <h2 id="config-heading" className="mb-4 text-sm font-semibold uppercase tracking-wider text-zinc-500">
          System configuration
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <SuperadminModuleCard
            href="/superadmin/smtp"
            title="SMTP & email"
            description="Configure outgoing mail server, credentials, and send delivery tests."
            icon={Mail}
          />
          <SuperadminModuleCard
            href="/superadmin/analytics"
            title="Google Analytics"
            description="Set the GA4 Measurement ID used across the marketing site and app."
            icon={BarChart3}
          />
        </div>
      </section>
    </>
  );
}
