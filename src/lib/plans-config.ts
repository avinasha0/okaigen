/**
 * Single source of truth for plan capabilities (industry-standard SaaS tiers).
 * Use helpers below for gating; keep DB seed in sync with limits here.
 */

export const PLAN_NAMES = ["Starter", "Growth", "Scale", "Enterprise"] as const;
export type PlanName = (typeof PLAN_NAMES)[number];

/** manual = user triggers refresh only; weekly = auto refresh every 7 days; daily = auto refresh every day */
export type RefreshSchedule = "manual" | "weekly" | "daily";

export type PlanCapabilities = {
  /** Max chatbots */
  botLimit: number;
  /** Max messages per day (resets daily) */
  dailyMessageLimit: number;
  /** Max storage in MB for documents/chunks */
  storageLimitMB: number;
  /** Max team members (owner + invited members) */
  teamMemberLimit: number;
  /** Can view and manage leads in dashboard */
  leads: boolean;
  /** Can view analytics in dashboard */
  analytics: boolean;
  /** Can upload documents (PDF, DOCX, etc.) for training */
  documentTraining: boolean;
  /** Can export leads (CSV) */
  exportLeads: boolean;
  /** Can export analytics / API access for programmatic use */
  apiAccess: boolean;
  /** Webhooks for lead.captured, chat.message (Scale, Enterprise) */
  webhooks: boolean;
  /** Priority / dedicated support */
  prioritySupport: boolean;
  /** Max pages/sources (for display; enforcement optional) */
  pageLimit: number;
  /** Content refresh: manual only, or auto weekly (Scale), or auto daily (Enterprise) */
  refreshSchedule: RefreshSchedule;
};

export const PLAN_CAPABILITIES: Record<PlanName, PlanCapabilities> = {
  Starter: {
    botLimit: 1,
    dailyMessageLimit: 10,
    storageLimitMB: 50,
    teamMemberLimit: 1,
    leads: false,
    analytics: false,
    documentTraining: false,
    exportLeads: false,
    apiAccess: false,
    webhooks: false,
    prioritySupport: false,
    pageLimit: 10,
    refreshSchedule: "manual"},
  Growth: {
    botLimit: 3,
    dailyMessageLimit: 70, // ~2,000/month
    storageLimitMB: 500,
    teamMemberLimit: 3,
    leads: true,
    analytics: true,
    documentTraining: true,
    exportLeads: true,
    apiAccess: false,
    webhooks: false,
    prioritySupport: false,
    pageLimit: 2000,
    refreshSchedule: "manual"},
  Scale: {
    botLimit: 10,
    dailyMessageLimit: 334, // ~10,000/month
    storageLimitMB: 2000,
    teamMemberLimit: 10,
    leads: true,
    analytics: true,
    documentTraining: true,
    exportLeads: true,
    apiAccess: true,
    webhooks: true,
    prioritySupport: true,
    pageLimit: 20000,
    refreshSchedule: "weekly"},
  Enterprise: {
    botLimit: 999,
    dailyMessageLimit: 100_000,
    storageLimitMB: 10000,
    teamMemberLimit: 999,
    leads: true,
    analytics: true,
    documentTraining: true,
    exportLeads: true,
    apiAccess: true,
    webhooks: true,
    prioritySupport: true,
    pageLimit: 100_000,
    refreshSchedule: "daily"}};

function getCapabilities(planName: string): PlanCapabilities | null {
  if (PLAN_NAMES.includes(planName as PlanName)) {
    return PLAN_CAPABILITIES[planName as PlanName];
  }
  return null;
}

/** True if plan can view leads in dashboard */
export function canViewLeads(planName: string): boolean {
  return getCapabilities(planName)?.leads ?? false;
}

/** True if plan can view analytics in dashboard */
export function canViewAnalytics(planName: string): boolean {
  return getCapabilities(planName)?.analytics ?? false;
}

/** True if plan can upload documents for training */
export function canUseDocumentTraining(planName: string): boolean {
  return getCapabilities(planName)?.documentTraining ?? false;
}

/** True if plan can export leads (CSV) */
export function canExportLeads(planName: string): boolean {
  return getCapabilities(planName)?.exportLeads ?? false;
}

/** True if plan has API access (Scale, Enterprise) */
export function hasApiAccess(planName: string): boolean {
  return getCapabilities(planName)?.apiAccess ?? false;
}

/** True if plan has webhooks (Scale, Enterprise) */
export function hasWebhooks(planName: string): boolean {
  return getCapabilities(planName)?.webhooks ?? false;
}

/** True if plan includes remove/custom branding (Scale, Enterprise). Growth can add via add-on. */
export function hasRemoveBrandingIncluded(planName: string): boolean {
  return planName === "Scale" || planName === "Enterprise";
}

/** True if user can enable branding options: Scale/Enterprise (included) or Growth with add-on. */
export function canUseBranding(planName: string, removeBrandingAddOn: boolean): boolean {
  return hasRemoveBrandingIncluded(planName) || (planName === "Growth" && removeBrandingAddOn);
}

/** True if plan has priority/dedicated support */
export function hasPrioritySupport(planName: string): boolean {
  return getCapabilities(planName)?.prioritySupport ?? false;
}

/** Starter tier: most restrictions (no leads/analytics/docs) */
export function isStarterPlan(planName: string): boolean {
  return planName === "Starter";
}

/** Max team members for plan */
export function getTeamMemberLimit(planName: string): number {
  return getCapabilities(planName)?.teamMemberLimit ?? 1;
}

/** Refresh schedule: manual (Starter/Growth), weekly (Scale), daily (Enterprise) */
export function getRefreshSchedule(planName: string): RefreshSchedule {
  return getCapabilities(planName)?.refreshSchedule ?? "manual";
}

/** True if plan allows manual refresh (Retrain button). Starter = no; Growth+ = yes. */
export function canManualRefresh(planName: string): boolean {
  if (planName === "Starter") return false;
  return true;
}

/** True if plan has auto refresh (cron will refresh sources). Scale = weekly, Enterprise = daily */
export function hasAutoRefresh(planName: string): boolean {
  const schedule = getCapabilities(planName)?.refreshSchedule;
  return schedule === "weekly" || schedule === "daily";
}

/** Max pages to crawl for website training (Starter: 10, Growth: 2000, etc.) */
export function getPageLimit(planName: string): number {
  return getCapabilities(planName)?.pageLimit ?? 10;
}

/** Limits for DB seed / display (dailyLimit, botLimit, storageLimit, teamMemberLimit) */
export function getPlanLimitsForDb(planName: PlanName) {
  const c = PLAN_CAPABILITIES[planName];
  return {
    dailyLimit: c.dailyMessageLimit,
    botLimit: c.botLimit,
    storageLimit: c.storageLimitMB,
    teamMemberLimit: c.teamMemberLimit};
}
