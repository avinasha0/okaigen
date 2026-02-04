import { auth } from "@/lib/auth";
import { getPlanUsage } from "@/lib/plan-usage";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle} from "@/components/ui/card";
import NewBotForm from "./form";
import { unstable_cache } from "next/cache";

export default async function NewBotPage() {
  const session = await auth();
  if (!session?.user?.id) return null;
  const planUsage = await unstable_cache(
    () => getPlanUsage(session.user!.id),
    ["bots-new-plan-usage", session.user.id],
    { revalidate: 10 }
  )();
  const atLimit =
    planUsage?.usedBots != null &&
    planUsage?.totalBots != null
      ? planUsage.usedBots >= planUsage.totalBots
      : false;

  if (atLimit) {
    return (
      <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 md:px-8">
        <Link
          href="/dashboard"
          className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
        >
          ← Back to dashboard
        </Link>
        <Card>
          <CardHeader>
            <CardTitle>Bot limit reached</CardTitle>
            <CardDescription>
              You&apos;ve reached your plan limit. Upgrade to create more bots and unlock additional features.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/pricing">View plans</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-4 sm:px-6 md:px-8">
      <Link
        href="/dashboard"
        className="mb-6 inline-block text-sm text-gray-600 hover:text-gray-900"
      >
        ← Back to dashboard
      </Link>
      <Card>
        <CardHeader>
          <CardTitle>Create a new bot</CardTitle>
          <CardDescription>
            Step 1: Give your bot a name and optionally add your website URL
          </CardDescription>
        </CardHeader>
        <CardContent>
          <NewBotForm />
        </CardContent>
      </Card>
    </div>
  );
}
