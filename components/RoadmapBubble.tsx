"use client";

export default function RoadmapBubble() {
  return (
    <button
      onClick={() => window.dispatchEvent(new CustomEvent("open:roadmap"))}
      className="
        fixed bottom-24 right-4
        w-12 h-12 rounded-full
        bg-black/60 border border-white/10
        flex items-center justify-center
        text-white text-xl
        shadow-lg backdrop-blur-md
        z-40
      "
    >
      🗺️
    </button>
  );
}
