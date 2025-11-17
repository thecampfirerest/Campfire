// /components/RitualButton.tsx
"use client";
import { useEffect, useState } from "react";
import { loadMemory, saveMemory, grantBadge } from "@/lib/memoryClient";

function canPerformDailyRitual(): boolean {
  const last = loadMemory<string>("daily_ritual_at");
  if (!last) return true;
  return new Date(last).toDateString() !== new Date().toDateString();
}

export default function RitualButton({ onPerformed }: { onPerformed?: () => void }) {
  const [canDo, setCanDo] = useState<boolean>(false);

  useEffect(() => setCanDo(canPerformDailyRitual()), []);

  function perform() {
    if (!canPerformDailyRitual()) return;
    saveMemory("daily_ritual_at", new Date().toISOString());
    grantBadge("daily_ritual_done");
    setCanDo(false);
    onPerformed?.();
  }

  return (
    <button
      onClick={perform}
      disabled={!canDo}
      className={`px-4 py-2 rounded-xl text-sm ${canDo ? "bg-amber-500/30 hover:bg-amber-500/40" : "bg-white/6 opacity-60 cursor-not-allowed"} border border-white/10`}
    >
      Daily Rest
    </button>
  );
}
