import Link from "next/link";
import { ShieldOff } from "lucide-react";

export function SuperadminAccessDenied() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-100 text-amber-700">
          <ShieldOff className="h-7 w-7" />
        </div>
        <h1 className="mt-5 text-center font-[family-name:var(--font-jakarta)] text-xl font-bold text-zinc-900">
          Access restricted
        </h1>
        <p className="mt-2 text-center text-sm leading-relaxed text-zinc-500">
          You are signed in, but this account is not marked as <strong className="text-zinc-700">superadmin</strong> in the
          database for this deployment.
        </p>
        <div className="mt-5 rounded-lg border border-zinc-100 bg-zinc-50 px-4 py-3 text-sm text-zinc-600">
          Confirm your user record at{" "}
          <Link className="font-medium text-violet-600 hover:underline" href="/api/auth/whoami">
            /api/auth/whoami
          </Link>
          .
        </div>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center rounded-lg bg-zinc-900 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-800"
          >
            Go to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
