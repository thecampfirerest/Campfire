"use client";
import { useEffect, useState } from "react";
import { loadMemory, saveMemory } from "@/lib/memoryClient";

export default function CovenantPanel() {
  const [cov, setCov] = useState<any>(null);
  const [name, setName] = useState("");
  const [promise, setPromise] = useState("");

  useEffect(() => {
    setCov(loadMemory("active_covenant"));
  }, []);

  function create() {
    if (!name.trim() || !promise.trim()) return;

    const newCov = {
      name,
      promise,
      createdAt: new Date().toISOString(),
      fulfilled: false,
    };

    saveMemory("active_covenant", newCov);
    setCov(newCov);

    setName("");
    setPromise("");
  }

  function fulfill() {
    if (!cov) return;

    const finished = {
      ...cov,
      fulfilled: true,
      fulfilledAt: new Date().toISOString(),
    };

    // archive into history
    const hist = loadMemory("covenant_history") ?? [];
    hist.unshift(finished);
    saveMemory("covenant_history", hist.slice(0, 200));

    // clear active covenant
    saveMemory("active_covenant", null);
    setCov(null);
  }

  // no active covenant → show create form
  if (!cov)
    return (
      <div className="space-y-3 text-sm text-white">
        <div className="font-semibold">Create a New Covenant</div>

        <input
          className="w-full bg-black/30 border border-white/10 rounded p-2"
          placeholder="Title…"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <textarea
          className="w-full bg-black/30 border border-white/10 rounded p-2 h-24"
          placeholder="Write your promise…"
          value={promise}
          onChange={(e) => setPromise(e.target.value)}
        />

        <button
          onClick={create}
          className="px-3 py-1 bg-amber-500/30 rounded"
        >
          Create
        </button>

        {/* History section */}
        <div className="mt-4 text-xs text-white/60">
          <div className="font-semibold text-white/80 mb-1">Past Covenants</div>
          {(loadMemory("covenant_history") ?? []).length === 0 && (
            <div>No previous covenants.</div>
          )}
          {(loadMemory("covenant_history") ?? []).map((c: any, i: number) => (
            <div key={i} className="mb-2">
              <div className="text-white/80">{c.name}</div>
              <div className="text-white/60 italic">{c.promise}</div>
              <div className="text-white/40 text-xxs">
                Fulfilled: {new Date(c.fulfilledAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    );

  // Active covenant view
  return (
    <div className="space-y-3 text-sm text-white">
      <div className="font-semibold">{cov.name}</div>
      <div className="text-white/70 text-xs">{cov.promise}</div>

      {!cov.fulfilled && (
        <button
          onClick={fulfill}
          className="px-3 py-1 bg-emerald-500/30 rounded"
        >
          Fulfill
        </button>
      )}
    </div>
  );
}
