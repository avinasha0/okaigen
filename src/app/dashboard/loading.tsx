export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Top bar skeleton */}
      <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 md:px-8 md:py-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="h-7 w-40 animate-pulse rounded-lg bg-zinc-200 sm:h-8 sm:w-48" />
            <div className="h-4 w-56 animate-pulse rounded bg-zinc-100" />
          </div>
          <div className="h-11 w-36 animate-pulse rounded-xl bg-zinc-200 sm:w-40" />
        </div>
      </div>

      <div className="p-4 sm:p-6 md:p-8">
        {/* KPI cards skeleton */}
        <div className="mb-8 grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-100" />
                <div className="h-4 w-4 animate-pulse rounded bg-zinc-100" />
              </div>
              <div className="mt-3 h-8 w-12 animate-pulse rounded bg-zinc-200" />
            </div>
          ))}
        </div>

        {/* Content block skeleton */}
        <div className="rounded-xl border border-zinc-200 bg-white p-6">
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="mt-4 space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="h-10 w-10 shrink-0 animate-pulse rounded-lg bg-zinc-100" />
                <div className="flex-1 space-y-1">
                  <div className="h-4 w-full animate-pulse rounded bg-zinc-100" />
                  <div className="h-3 w-3/4 animate-pulse rounded bg-zinc-50" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
