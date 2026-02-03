"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { PlanUsage } from "@/components/dashboard-shell";
import {
  canViewLeads,
  canViewAnalytics,
  canUseDocumentTraining,
  canExportLeads,
  isStarterPlan as isStarterPlanConfig,
  canManualRefresh as canManualRefreshConfig,
  getRefreshSchedule as getRefreshScheduleConfig,
  hasApiAccess as hasApiAccessConfig,
  hasWebhooks as hasWebhooksConfig,
  type RefreshSchedule} from "@/lib/plans-config";

type PlanContextValue = {
  planUsage: PlanUsage | null | undefined;
  isStarterPlan: boolean;
  canViewLeads: boolean;
  canViewAnalytics: boolean;
  canUseDocumentTraining: boolean;
  canExportLeads: boolean;
  canManualRefresh: boolean;
  refreshSchedule: RefreshSchedule;
  hasApiAccess: boolean;
  hasWebhooks: boolean;
};

const PlanContext = createContext<PlanContextValue>({
  planUsage: null,
  isStarterPlan: true,
  canViewLeads: false,
  canViewAnalytics: false,
  canUseDocumentTraining: false,
  canExportLeads: false,
  canManualRefresh: false,
  refreshSchedule: "manual",
  hasApiAccess: false,
  hasWebhooks: false});

export function PlanProvider({
  planUsage,
  children}: {
  planUsage: PlanUsage | null | undefined;
  children: ReactNode;
}) {
  const planName = planUsage?.planName ?? "Starter";
  const isStarterPlan = isStarterPlanConfig(planName);
  return (
    <PlanContext.Provider
      value={{
        planUsage,
        isStarterPlan,
        canViewLeads: canViewLeads(planName),
        canViewAnalytics: canViewAnalytics(planName),
        canUseDocumentTraining: canUseDocumentTraining(planName),
        canExportLeads: canExportLeads(planName),
        canManualRefresh: canManualRefreshConfig(planName),
        refreshSchedule: getRefreshScheduleConfig(planName),
        hasApiAccess: hasApiAccessConfig(planName),
        hasWebhooks: hasWebhooksConfig(planName)}}
    >
      {children}
    </PlanContext.Provider>
  );
}

export function usePlan() {
  return useContext(PlanContext);
}
