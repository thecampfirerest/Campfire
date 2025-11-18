"use client";
import React, { useEffect, useState } from "react";
import { loadMemory, saveMemory } from "@/lib/memoryClient";

type StoryEntry = { title: string; story: string; at?: string; divine?: boolean };

export default function StoryTellerFullscreen({ onClose }: { onClose: () => void }) {
  const builtin: StoryEntry[] = [
    { title: "The Ember’s Watch", story: "Long ago, a wanderer came to the fire. The ember taught patience and hope." },
    { title: "The Quiet Flame", story: "The fire glowed softly as night settled." },
  ];

  const stored = (loadMemory("story_history") as StoryEntry[] | null) ?? [];
  const [stories, setStories] = useState<StoryEntry[]>([...builtin, ...stored]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    const mem = (loadMemory("story_history") as StoryEntry[] | null) ?? [];
    if (mem.length) setStories([...builtin, ...mem]);
  }, []);

  const current = stories[index] ?? { title: "Untold Tale", story: "The embers hush." };

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(null), 2200); }
  function next() { setIndex((i) => (i + 1) % stories.length); }
  function prev() { setIndex((i) => (i - 1 + stories.length) % stories.length); }

  async function generateNew() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/story", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seed: "campfire healing tale" }) });
      const j = await res.json();
      const entry: StoryEntry = { title: j.title ?? "A New Tale", story: j.story ?? j.text ?? "A small tale.", at: new Date().toISOString(), divine: !!j.divine };
      const newStories = [...stories.slice(0, builtin.length), entry, ...stories.slice(builtin.length)];
      setStories(newStories);
      const hist = (loadMemory("story_history") as StoryEntry[] | null) ?? [];
      saveMemory("story_history", [entry, ...hist].slice(0, 200));
      setIndex(builtin.length);
      showToast("New story generated.");
    } catch (e) {
      console.error(e);
      showToast("Failed to generate — fallback used.");
      const entry = { title: "A New Tale", story: "The wind carries a small tale the fire remembers.", at: new Date().toISOString() };
      const newStories = [...stories.slice(0, builtin.length), entry, ...stories.slice(builtin.length)];
      setStories(newStories);
      const hist = (loadMemory("story_history") as StoryEntry[] | null) ?? [];
      saveMemory("story_history", [entry, ...hist].slice(0, 200));
      setIndex(builtin.length);
    } finally {
      setLoading(false);
    }
  }

  const isDivine = !!current.divine;

  return (
    <div className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-6">
      {isDivine && <div className="pointer-events-none absolute inset-0 divine-particles" />}
      <div className="relative z-[230] max-w-3xl w-full bg-black/60 border border-white/8 rounded-2xl p-8 text-white shadow-xl">
        <button onClick={onClose} className="absolute right-4 top-4 text-white/80 hover:text-red-400">✕</button>
        <h1 className={`text-3xl font-extrabold mb-4 ${isDivine ? "text-amber-300 drop-shadow-[0_6px_18px_rgba(255,175,60,0.15)]" : ""}`}>{current.title}</h1>
        <div className="max-h-[56vh] overflow-y-auto text-lg leading-relaxed whitespace-pre-line text-white/90">{current.story}</div>
        <div className="flex items-center gap-4 mt-6">
          <button onClick={prev} className="px-4 py-2 bg-white/6 rounded">◀ Previous</button>
          <button onClick={generateNew} disabled={loading} className="px-4 py-2 bg-amber-600/45 rounded">{loading ? "Generating…" : "✨ Generate New Story"}</button>
          <button onClick={next} className="px-4 py-2 bg-white/6 rounded">Next ▶</button>
          <div className="flex-1" />
          {current.at && <div className="text-xs text-white/60">Created: {new Date(current.at).toLocaleString()}</div>}
        </div>
        {toast && <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 px-3 py-2 rounded text-sm">{toast}</div>}
      </div>
      <style>{`
        .divine-particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(255,200,120,0.06) 0, transparent 20%),
            radial-gradient(circle at 80% 30%, rgba(255,220,140,0.05) 0, transparent 18%),
            radial-gradient(circle at 50% 70%, rgba(255,180,80,0.04) 0, transparent 22%);
          mix-blend-mode: screen;
          animation: divineGlow 6s ease-in-out infinite;
        }
        @keyframes divineGlow {
          0% { filter: blur(6px) saturate(80%); opacity: 0.7; transform: scale(1);}
          50% { filter: blur(18px) saturate(120%); opacity: 1; transform: scale(1.02);}
          100% { filter: blur(6px) saturate(80%); opacity: 0.72; transform: scale(1);}
        }
      `}</style>
    </div>
  );
}
