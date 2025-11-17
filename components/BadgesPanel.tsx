"use client";
import { useEffect, useState } from "react";
import { listBadges } from "@/lib/memoryClient";

export default function BadgesPanel() {
  const [badges, setBadges] = useState<any[]>([]);

  useEffect(() => setBadges(listBadges()), []);

  return (
    <div className="flex gap-2 flex-wrap">
      {badges.map((b) => (
        <div
          key={b.id}
          className="px-2 py-1 bg-white/10 rounded text-xs text-white"
        >
          {b.id}
        </div>
      ))}
    </div>
  );
}
