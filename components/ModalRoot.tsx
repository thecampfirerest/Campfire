"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

import StoryTellerFullscreen from "./StoryTellerFullscreen";
import RitualsPanel from "./RitualsPanel";
import Journal from "./Journal";
import CovenantPanel from "./CovenantPanel";
import MemoryPanel from "./MemoryPanel";
import BlessingsPanel from "./BlessingsPanel";
import BadgesPanel from "./BadgesPanel";
import AscensionPanel from "./AscensionPanel";

type ModalId =
  | "stories"
  | "rituals"
  | "journal"
  | "covenant"
  | "memory"
  | "blessings"
  | "badges"
  | "ascension"
  | null;

type ModalContextType = {
  active: ModalId;
  open: (id: ModalId) => void;
  close: () => void;
};

const ModalContext = createContext<ModalContextType | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<ModalId>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const open = (id: ModalId) => setActive(id);
  const close = () => setActive(null);

  return (
    <ModalContext.Provider value={{ active, open, close }}>
      {children}
      <ModalHost active={active} close={close} />
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used inside provider");
  return ctx;
}

/* ModalHost */
function Backdrop({ onClose }: { onClose: () => void }) {
  return <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[80]" onClick={onClose} />;
}

function ModalHost({ active, close }: { active: ModalId; close: () => void }) {
  if (!active) return null;

  const center = ["journal", "covenant", "ascension"].includes(active);
  const story = active === "stories";
  const right = ["rituals", "memory", "blessings"].includes(active);
  const bottom = active === "badges";

  return (
    <>
      <Backdrop onClose={close} />

      {/* Cinematic stories */}
      {story && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-6">
          <div className="absolute inset-0 pointer-events-none" />
          <div className="w-full h-full max-h-screen overflow-auto flex items-center justify-center">
            <div className="w-full h-full max-w-4xl max-h-[95vh] rounded-2xl p-6">
              <StoryTellerFullscreen />
            </div>
          </div>
        </div>
      )}

      {/* Center modals */}
      {center && (
        <div className="fixed inset-0 z-[85] flex items-center justify-center p-5">
          <div className="w-full max-w-2xl max-h-[85vh] overflow-auto rounded-2xl bg-black/40 border border-amber-800/20 p-6 backdrop-blur-lg shadow-2xl">
            <ModalHeader title={title(active)} close={close} />
            <div className="mt-3">
              {active === "journal" && <Journal />}
              {active === "covenant" && <CovenantPanel />}
              {active === "ascension" && <AscensionPanel />}
            </div>
          </div>
        </div>
      )}

      {/* Right slide */}
      {right && (
        <div className="fixed inset-y-0 right-0 z-[85] w-full max-w-md bg-black/40 border-l border-amber-900/10 p-6 backdrop-blur-lg overflow-auto shadow-xl">
          <div className="flex justify-between items-center">
            <div className="text-lg font-semibold text-amber-200">{title(active)}</div>
            <button onClick={close} className="text-white/60 hover:text-white px-2 py-1 rounded">✕</button>
          </div>
          <div className="mt-4">
            {active === "rituals" && <RitualsPanel />}
            {active === "memory" && <MemoryPanel />}
            {active === "blessings" && <BlessingsPanel />}
          </div>
        </div>
      )}

      {/* Bottom sheet */}
      {bottom && (
        <div className="fixed left-0 right-0 bottom-0 z-[85] p-4">
          <div className="mx-auto w-full max-w-3xl bg-black/40 border border-amber-900/10 rounded-2xl p-4 backdrop-blur-lg shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="text-sm font-semibold text-amber-200">Badges</div>
              <button onClick={close} className="text-white/60 hover:text-white px-2 py-1 rounded">✕</button>
            </div>
            <div className="mt-3">
              <BadgesPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function title(id: ModalId) {
  return {
    stories: "Stories",
    rituals: "Ember Rituals",
    journal: "Journal",
    covenant: "Covenant",
    memory: "Memory",
    blessings: "Blessings",
    badges: "Badges",
    ascension: "Ascension",
  }[id || "stories"];
}

function ModalHeader({ title, close }: { title: string; close: () => void }) {
  return (
    <div className="flex justify-between items-center">
      <div className="text-lg font-semibold text-amber-200">{title}</div>
      <button onClick={close} className="text-white/60 hover:text-white px-2 py-1 rounded">✕</button>
    </div>
  );
}
