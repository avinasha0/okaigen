import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function SuperadminModuleCard({
  href,
  title,
  description,
  icon: Icon,
  status,
}: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  status?: string;
}) {
  return (
    <Link
      href={href}
      className="group relative flex flex-col rounded-xl border border-zinc-200/80 bg-white p-5 shadow-sm transition-all hover:border-violet-200 hover:shadow-md"
    >
      <div className="flex items-start gap-4">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-600 ring-1 ring-violet-500/20">
          <Icon className="h-6 w-6" aria-hidden />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-zinc-900 group-hover:text-violet-700">{title}</h3>
            <ArrowUpRight className="h-4 w-4 text-zinc-300 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-violet-500 group-hover:opacity-100" />
          </div>
          <p className="mt-1 text-sm leading-relaxed text-zinc-500">{description}</p>
          {status ? (
            <p className={cn("mt-3 inline-flex rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-medium text-zinc-600")}>
              {status}
            </p>
          ) : null}
        </div>
        <ChevronRight className="mt-1 h-5 w-5 shrink-0 text-zinc-300 transition-colors group-hover:text-violet-500" />
      </div>
    </Link>
  );
}
