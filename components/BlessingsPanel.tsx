"use client";
import { useEffect, useState } from "react";
import { listBlessings, grantBlessing } from "@/lib/blessings";

export default function BlessingsPanel() {
  const [blessings, setBlessings] = useState<any[]>([]);

  useEffect(() => setBlessings(listBlessings()), []);

  function receive(kind = "rest_blessing") {
    grantBlessing(kind, { warmth: 10, note: kind });
    setBlessings(listBlessings());
  }

  if (!blessings.length)
    return (
      <div className="text-white/80 space-y-3">
        <div>No blessings yet.</div>
        <div className="text-xs text-white/60">Receive a blessing to encourage your walk.</div>
        <div className="flex gap-2 mt-2">
          <button onClick={() => receive("rest_blessing")} className="px-3 py-1 rounded bg-amber-500/30">Blessing of Rest</button>
          <button onClick={() => receive("strength_blessing")} className="px-3 py-1 rounded bg-amber-500/30">Blessing of Strength</button>
        </div>
      </div>
    );

  return (
    <div className="flex flex-wrap gap-2">
      {blessings.map((b) => (
        <div key={b.id} className="px-3 py-1 bg-white/6 rounded text-xs text-white">
          {b.id}
        </div>
      ))}
    </div>
  );
}
