"use client";
import React from "react";
import { useModal } from "@/components/ModalRoot";

const TABS = [
  { id: "stories", label: "Stories" },
  { id: "rituals", label: "Ritals" },
  { id: "journal", label: "Journal" },
  { id: "covenant", label: "Covenant" },
  { id: "memory", label: "Memory" },
  { id: "blessings", label: "Blessings" },
  { id: "badges", label: "Badges" },
  { id: "ascension", label: "Ascension" },
];

export default function TabBar() {
  const { open, modal } = useModal();

  return (
    <nav
      className="
        flex gap-2 items-center
        bg-black/30 border border-white/10 rounded-full
        px-3 py-2
        backdrop-blur-md shadow-xl

        overflow-x-auto whitespace-nowrap scrollbar-hide
        max-w-full
      "
    >
      {TABS.map((t) => {
        const isActive = modal === t.id;
        return (
          <button
            key={t.id}
            onClick={() => open(t.id)}
            aria-label={t.label}
            className={`
              text-xxs px-3 py-1 rounded-full transition-all select-none
              ${
                isActive
                  ? "bg-amber-400/25 text-amber-200 ring-1 ring-amber-300/30"
                  : "text-white/70 hover:bg-white/10"
              }
            `}
          >
            {t.label}
          </button>
        );
      })}
    </nav>
  );
}
