export default function RootLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4">
      <div
        className="h-10 w-10 animate-spin rounded-full border-2 border-[#1a6aff] border-t-transparent"
        aria-hidden
      />
      <p className="text-sm font-medium text-slate-500">Loading...</p>
    </div>
  );
}
