"use client";

import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";

export function SignOutButton({
  className,
}: {
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={() => signOut({ callbackUrl: "/" })}
      className={cn(
        "text-sm text-slate-600 transition-colors hover:text-[#1a6aff]",
        className
      )}
    >
      Sign out
    </button>
  );
}
