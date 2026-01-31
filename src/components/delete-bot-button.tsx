"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export function DeleteBotButton({ botId, botName }: { botId: string; botName: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);

  async function handleDelete() {
    if (!confirm) {
      setConfirm(true);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/bots/${botId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/dashboard");
      router.refresh();
    } catch {
      setLoading(false);
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleDelete}
      disabled={loading}
      className={
        confirm
          ? "border-rose-300 bg-rose-50 text-rose-700 hover:bg-rose-100"
          : ""
      }
    >
      {loading ? "Deleting..." : confirm ? `Click again to delete ${botName}` : "Delete bot"}
    </Button>
  );
}
