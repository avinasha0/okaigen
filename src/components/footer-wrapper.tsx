"use client";

import { usePathname } from "next/navigation";
import { Footer } from "@/components/footer";

/** Wraps Footer and adds left margin on dashboard so fixed sidebar doesn't overlap it. */
export function FooterWrapper() {
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard") ?? false;

  if (isDashboard) {
    return (
      <div className="md:ml-64">
        <Footer />
      </div>
    );
  }

  return <Footer />;
}
