"use client";
import { useEffect, useState } from "react";
import { createCovenant, getCovenant, fulfillCovenant } from "@/lib/covenant";

export default function CovenantPanel() {
  const [cov, setCov] = useState<any>(null);
  const [name, setName] = useState("");
  const [promise, setPromise] = useState("");

  useEffect(() => {
    setCov(getCovenant());
  }, []);

  if (!cov)
    return (
      <div className="space-y-3 text-sm text-white">
        <div className="font-semibold">Create Covenant</div>
        <input
          className="w-full bg-black/30 border border-white/10 rounded p-2"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <textarea
          className="w-full bg-black/30 border border-white/10 rounded p-2 h-24"
          placeholder="Promise or calling"
          value={promise}
          onChange={(e) => setPromise(e.target.value)}
        />
        <button
          onClick={() => {
            setCov(createCovenant({ name, promise }));
          }}
          className="px-3 py-1 bg-amber-500/30 rounded"
        >
          Create
        </button>
      </div>
    );

  return (
    <div className="space-y-3 text-sm text-white">
      <div className="font-semibold">{cov.name}</div>
      <div className="text-white/70 text-xs italic">{cov.promise}</div>

      {!cov.fulfilled && (
        <button
          onClick={() => setCov(fulfillCovenant("Fulfilled at fire"))}
          className="px-3 py-1 bg-emerald-500/30 rounded"
        >
          Fulfill
        </button>
      )}

      {cov.fulfilled && (
        <div className="text-white/60 text-xs">
          Fulfilled: {new Date(cov.fulfilledAt).toLocaleString()}
        </div>
      )}
    </div>
  );
}
