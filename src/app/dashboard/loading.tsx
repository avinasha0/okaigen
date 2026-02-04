export default function Loading() {
  return (
    <div className="min-h-screen">
      <div className="border-b border-zinc-200 bg-white px-4 py-4 sm:px-6 sm:py-5 md:px-8 md:py-6">
        <div className="h-6 w-40 animate-pulse rounded bg-zinc-200" />
        <div className="mt-2 h-4 w-64 animate-pulse rounded bg-zinc-200" />
      </div>
      <div className="p-4 sm:p-6 md:p-8">
        <div className="mb-6 grid gap-3 sm:mb-8 sm:grid-cols-2 sm:gap-4 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="border-zinc-200 bg-white shadow-sm rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="h-4 w-24 animate-pulse rounded bg-zinc-200" />
                <div className="h-4 w-4 animate-pulse rounded bg-zinc-200" />
              </div>
              <div className="mt-3 h-6 w-20 animate-pulse rounded bg-zinc-200" />
            </div>
          ))}
        </div>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="h-5 w-32 animate-pulse rounded bg-zinc-200" />
          <div className="h-9 w-28 animate-pulse rounded bg-zinc-200" />
        </div>
        <div className="overflow-hidden border-zinc-200 bg-white rounded-lg">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-4 sm:p-6 border-t border-zinc-100 first:border-t-0">
              <div className="h-4 w-48 animate-pulse rounded bg-zinc-200" />
              <div className="mt-2 h-3 w-64 animate-pulse rounded bg-zinc-200" />
              <div className="mt-3 flex gap-2">
                {[...Array(4)].map((__, j) => (
                  <div key={j} className="h-8 w-20 animate-pulse rounded bg-zinc-200" />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
