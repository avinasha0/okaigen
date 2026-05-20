import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type Breadcrumb = { label: string; href?: string };

export function SuperadminPageHeader({
  title,
  description,
  breadcrumbs,
  className,
}: {
  title: string;
  description?: string;
  breadcrumbs?: Breadcrumb[];
  className?: string;
}) {
  return (
    <div className={cn("mb-8", className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav aria-label="Breadcrumb" className="mb-3 flex flex-wrap items-center gap-1 text-sm text-zinc-500">
          {breadcrumbs.map((crumb, i) => (
            <span key={`${crumb.label}-${i}`} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="h-3.5 w-3.5 text-zinc-400" />}
              {crumb.href ? (
                <Link href={crumb.href} className="font-medium text-zinc-600 transition-colors hover:text-violet-600">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-zinc-400">{crumb.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <h1 className="font-[family-name:var(--font-jakarta)] text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
        {title}
      </h1>
      {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">{description}</p> : null}
    </div>
  );
}
