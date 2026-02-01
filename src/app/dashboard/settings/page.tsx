import Link from "next/link";
import { auth } from "@/lib/auth";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

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
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Name</label>
            <p className="text-gray-900">{session?.user?.name || "—"}</p>
          </div>
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
          <CardTitle>Usage & limits</CardTitle>
          <CardDescription>Your current plan and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            Free tier: 100 messages/day, 3 bots. Billing integration coming soon.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
