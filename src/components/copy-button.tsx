"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyButton({
  text,
  className,
  label = "Copy",
  labelCopied = "Copied!",
}: {
  text: string;
  className?: string;
  label?: string;
  labelCopied?: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      className={className ?? "mt-2"}
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? labelCopied : label}
    </Button>
  );
}
