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
