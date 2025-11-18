"use client";
import React, { createContext, useContext, useState } from "react";

import Journal from "@/components/Journal";
import CovenantPanel from "@/components/CovenantPanel";
import AscensionPanel from "@/components/AscensionPanel";
import CodexPanel from "@/components/CodexPanel";

import StoryTellerFullscreen from "@/components/StoryTellerFullscreen"; // ✅ FIXED
import RitualsPanel from "@/components/RitualsPanel";
import MemoryPanel from "@/components/MemoryPanel";
import BlessingsPanel from "@/components/BlessingsPanel";
import BadgesPanel from "@/components/BadgesPanel";

const ModalContext = createContext<any>(null);

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: any) {
  const [active, setActive] = useState<string | null>(null);

  function open(id: string) {
    setActive(id);
  }
  function close() {
    setActive(null);
  }

  return (
    <ModalContext.Provider value={{ active, open, close }}>
      {children}

      {/* BACKDROP */}
      {active && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
          onClick={close}
        />
      )}

      {/* MODAL WRAPPER */}
      {active && active !== "stories" && ( // stories uses fullscreen special layout
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
          <div className="relative w-full max-w-lg bg-black/40 border border-white/10 rounded-xl p-5 shadow-xl pointer-events-auto">
            {/* Close */}
            <button
              onClick={close}
              className="absolute top-3 right-3 text-white/60 hover:text-white"
            >
              ✕
            </button>

            {/* PANELS */}
            {active === "rituals" && <RitualsPanel />}
            {active === "journal" && <Journal />}
            {active === "covenant" && <CovenantPanel />}
            {active === "memory" && <MemoryPanel />}
            {active === "blessings" && <BlessingsPanel />}
            {active === "badges" && <BadgesPanel />}
            {active === "ascension" && <AscensionPanel />}
            {active === "codex" && <CodexPanel />}
          </div>
        </div>
      )}

      {/* SPECIAL: STORY FULLSCREEN HANDLING */}
      {active === "stories" && (
        <StoryTellerFullscreen onClose={close} />
      )}
    </ModalContext.Provider>
  );
}
