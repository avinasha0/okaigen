import { auth } from "@/lib/auth";
import { getPlanUsage } from "@/lib/plan-usage";
import { getEffectiveOwnerId } from "@/lib/team";
import { DashboardPricingContent } from "@/components/dashboard-pricing-content";

export default async function DashboardPricingPage({
  searchParams}: {
  searchParams: Promise<{ success?: string; canceled?: string }>;
}) {
  const session = await auth();
  const ownerId = session?.user?.id ? await getEffectiveOwnerId(session.user.id) : null;
  const planUsage = ownerId ? await getPlanUsage(ownerId) : null;
  const currentPlanName = planUsage?.planName ?? "Starter";
  const params = await searchParams;
  const success = params.success === "true";
  const canceled = params.canceled === "true";

  return (
    <DashboardPricingContent
      currentPlanName={currentPlanName}
      success={success}
      canceled={canceled}
    />
  );
}
