export default function DashboardBotsLoading() {
  return (
    <div className="p-4 sm:p-6 md:p-8">
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="h-8 w-48 animate-pulse rounded-lg bg-zinc-200" />
        <div className="h-11 w-36 animate-pulse rounded-xl bg-zinc-200" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="flex flex-col gap-3 rounded-xl border border-zinc-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-zinc-100" />
              <div className="space-y-2">
                <div className="h-5 w-40 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-64 animate-pulse rounded bg-zinc-100" />
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-100" />
              <div className="h-9 w-20 animate-pulse rounded-lg bg-zinc-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
