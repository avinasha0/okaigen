import { prisma } from "@/lib/db";
import { hashApiKey, isApiKeyFormat } from "@/lib/api-key";
import { getPlanUsage } from "@/lib/plan-usage";
import { hasApiAccess } from "@/lib/plans-config";

/** Extract API key from request: x-api-key header or Authorization: Bearer <key> */
export function getApiKeyFromRequest(req: Request): string | null {
  const header = req.headers.get("x-api-key");
  if (header?.trim()) return header.trim();
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return null;
}

/**
 * Validate API key and return account owner ID if valid and plan has API access.
 * Updates lastUsedAt. Returns null if invalid or plan doesn't have API access.
 */
export async function getOwnerIdFromApiKey(req: Request): Promise<string | null> {
  const key = getApiKeyFromRequest(req);
  if (!key || !isApiKeyFormat(key)) return null;

  const hash = hashApiKey(key);
  const apiKey = await prisma.apiKey.findFirst({
    where: { keyHash: hash },
    select: { userId: true, id: true }});
  if (!apiKey) return null;

  const planUsage = await getPlanUsage(apiKey.userId);
  const planName = planUsage?.planName ?? "Starter";
  if (!hasApiAccess(planName)) return null;

  await prisma.apiKey.update({
    where: { id: apiKey.id },
    data: { lastUsedAt: new Date() }}).catch(() => {});

  return apiKey.userId;
}
