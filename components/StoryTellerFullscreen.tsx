"use client";
import { useEffect, useState } from "react";
import { loadMemory } from "@/lib/memoryClient";

/**
 * Cinematic StoryTeller - fullscreen, immersive, minimal chrome.
 * This component expects stories to be in /public/stories.json
 * and reads them client-side for privacy.
 */

type Story = { title: string; body: string };

export default function StoryTellerFullscreen() {
  const [stories, setStories] = useState<Story[]>([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    let mounted = true;
    fetch("/stories.json")
      .then((r) => r.json())
      .then((j) => {
        if (!mounted) return;
        setStories(j.stories ?? []);
      })
      .catch(() => {
        if (!mounted) return;
        setStories([]);
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!stories.length) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center text-white/70">
        No stories installed.
      </div>
    );
  }

  const s = stories[index];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-center px-6 py-10 select-none">
      <div className="max-w-3xl">
        <h2 className="text-2xl font-semibold text-amber-200 mb-4">{s.title}</h2>
        <div className="text-lg leading-relaxed text-white/90 whitespace-pre-wrap">{s.body}</div>

        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            className="px-4 py-2 rounded bg-white/6 hover:bg-white/10"
            aria-label="Previous story"
            disabled={index === 0}
          >
            ← Prev
          </button>

          <div className="text-xs text-white/60">
            {index + 1} / {stories.length}
          </div>

          <button
            onClick={() => setIndex((i) => Math.min(stories.length - 1, i + 1))}
            className="px-4 py-2 rounded bg-white/6 hover:bg-white/10"
            aria-label="Next story"
            disabled={index === stories.length - 1}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}
