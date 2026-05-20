import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const ACCENT = {
  violet: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
  blue: "bg-blue-500/10 text-blue-600 ring-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
} as const;

export function SuperadminStatCard({
  label,
  value,
  hint,
  icon: Icon,
  accent = "violet",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: LucideIcon;
  accent?: keyof typeof ACCENT;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-zinc-500">{label}</p>
          <p className="mt-2 font-[family-name:var(--font-jakarta)] text-3xl font-bold tabular-nums tracking-tight text-zinc-900">
            {typeof value === "number" ? value.toLocaleString("en-US") : value}
          </p>
          {hint ? <p className="mt-1.5 text-xs text-zinc-400">{hint}</p> : null}
        </div>
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset", ACCENT[accent])}>
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </div>
  );
}
