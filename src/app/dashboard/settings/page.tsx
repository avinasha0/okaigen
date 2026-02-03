import Link from "next/link";
import { auth } from "@/lib/auth";
import { getPlanUsage } from "@/lib/plan-usage";
import { prisma } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from "@/components/ui/card";
import { SettingsProfileForm } from "@/components/settings-profile-form";
import { SettingsPasswordForm } from "@/components/settings-password-form";
import { BillingPortalButton } from "@/components/billing-portal-button";
import { SettingsRecaptchaToggle } from "@/components/settings-recaptcha-toggle";

export default async function SettingsPage() {
  const session = await auth();
  const planUsage = session?.user?.id ? await getPlanUsage(session.user.id) : null;
  const userRecord = session?.user?.id
    ? await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { password: true }})
    : null;
  const hasPassword = !!userRecord?.password;

  return (
    <div className="mx-auto max-w-2xl px-4 py-4 sm:px-6 md:px-8">
      <h1 className="mb-6 text-xl font-semibold text-gray-900 sm:text-2xl">Account settings</h1>
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Your account information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Email</label>
            <p className="text-gray-900">{session?.user?.email}</p>
            <p className="mt-1 text-xs text-slate-500">
              To change your email, please contact support.
            </p>
          </div>
          <SettingsProfileForm initialName={session?.user?.name} />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Change password</CardTitle>
          <CardDescription>
            Update your password if you signed up with email
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SettingsPasswordForm hasPassword={hasPassword} />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Add-ons</CardTitle>
          <CardDescription>Optional upgrades for your account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-slate-50/50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-medium text-slate-900">Remove SiteBotGPT branding</p>
              <p className="text-sm text-slate-500">White-label the chat widget (+$29/mo)</p>
            </div>
            <Link
              href="/contact?subject=Add-on%3A%20Remove%20SiteBotGPT%20branding"
              className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#1a6aff] px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#0d5aeb]"
            >
              Get this add-on
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Billing</CardTitle>
          <CardDescription>Manage your subscription and payment method</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="mb-4 text-sm text-slate-600">
            Update payment method, view invoices, or cancel your subscription from the billing portal.
          </p>
          <BillingPortalButton />
        </CardContent>
      </Card>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Usage & limits</CardTitle>
          <CardDescription>Your current plan and live usage</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {planUsage ? (
            <>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Plan</span>
                  <span className="font-medium text-slate-900">{planUsage.planName}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Messages today</span>
                  <span className="font-medium text-slate-900">
                    {planUsage.usedMessages.toLocaleString('en-US')} / {planUsage.totalMessages.toLocaleString('en-US')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-600">Bots</span>
                  <span className="font-medium text-slate-900">
                    {planUsage.usedBots} / {planUsage.totalBots}
                  </span>
                </div>
                {planUsage.totalTeamMembers > 1 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-600">Team members</span>
                    <span className="font-medium text-slate-900">
                      {planUsage.usedTeamMembers ?? 0} / {planUsage.totalTeamMembers}
                    </span>
                  </div>
                )}
              </div>
              <Link
                href="/dashboard/pricing"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#1a6aff] hover:text-[#0d5aeb] hover:underline"
              >
                Upgrade or change plan
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </>
          ) : (
            <p className="text-sm text-gray-600">
              Loading usage…
            </p>
          )}
        </CardContent>
      </Card>
      <SettingsRecaptchaToggle />
    </div>
  );
}
