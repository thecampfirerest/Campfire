"use client";
import React from "react";
import { useModal } from "@/components/ModalRoot";

export default function CompassBubble() {
  const { open } = useModal();

  return (
    <div className="fixed right-6 bottom-6 z-60">
      <button
        onClick={() => open("codex")}
        className="w-12 h-12 rounded-full bg-amber-700/20 border border-amber-300/15 flex items-center justify-center shadow-lg"
        title="Compass"
      >
        🧭
      </button>
    </div>
  );
}
