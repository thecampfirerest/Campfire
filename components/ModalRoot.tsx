"use client";
import React, { createContext, useContext, useEffect, useState, useRef } from "react";

import Journal from "@/components/Journal";
import CovenantPanel from "@/components/CovenantPanel";
import AscensionPanel from "@/components/AscensionPanel";
import CodexPanel from "@/components/CodexPanel";

import StoryTellerFullscreen from "@/components/StoryTellerFullscreen";
import RitualsPanel from "@/components/RitualsPanel";
import MemoryPanel from "@/components/MemoryPanel";
import BlessingsPanel from "@/components/BlessingsPanel";
import BadgesPanel from "@/components/BadgesPanel";

// New ritual panels
import StillnessPanel from "@/components/StillnessPanel";
import ForgivenessPanel from "@/components/ForgivenessPanel";
import DestinyVigilPanel from "@/components/DestinyVigilPanel";

// ⭐ NEW: Roadmap + Docs panels
import RoadmapPanel from "@/components/RoadmapPanel";
import DocsPanel from "@/components/DocsPanel";

const ModalContext = createContext<any>(null);

export function useModal() {
  return useContext(ModalContext);
}

export function ModalProvider({ children }: any) {
  const [active, setActive] = useState<string | null>(null);
  const modalRootRef = useRef<HTMLDivElement | null>(null);

  function open(id: string) {
    setActive(id);
  }
  function close() {
    setActive(null);
  }

  // ------------------------------------------
  // GLOBAL EVENT LISTENERS
  // ------------------------------------------
  useEffect(() => {
    function onOpenPanel(e: any) {
      try {
        const detail = e.detail ?? {};
        if (!detail || !detail.id) return;
        setActive(detail.id);

        if (detail.prefill && detail.id === "journal") {
          window.setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("journal:prefill", { detail: detail.prefill })
            );
          }, 40);
        }

        if (detail.prefill && detail.id === "covenant") {
          window.setTimeout(() => {
            window.dispatchEvent(
              new CustomEvent("covenant:prefill", { detail: detail.prefill })
            );
          }, 40);
        }
      } catch {}
    }

    function onCloseModal() {
      setActive(null);
    }

    // ⭐ NEW: roadmap/docs listeners
    function openRoadmap() {
      setActive("roadmap");
    }
    function openDocs() {
      setActive("docs");
    }

    window.addEventListener("open:panel", onOpenPanel);
    window.addEventListener("close:modal", onCloseModal);

    // ⭐ NEW
    window.addEventListener("open:roadmap", openRoadmap);
    window.addEventListener("open:docs", openDocs);

    return () => {
      window.removeEventListener("open:panel", onOpenPanel);
      window.removeEventListener("close:modal", onCloseModal);

      // ⭐ NEW
      window.removeEventListener("open:roadmap", openRoadmap);
      window.removeEventListener("open:docs", openDocs);
    };
  }, []);

  // ESC key + focus handling
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setActive(null);
      }
    }

    if (active) {
      window.addEventListener("keydown", onKey);

      setTimeout(() => {
        try {
          const root = modalRootRef.current;
          if (!root) return;
          const focusable = root.querySelector<HTMLElement>(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );
          focusable?.focus();
        } catch {}
      }, 40);
    } else {
      window.removeEventListener("keydown", onKey);
    }

    return () => window.removeEventListener("keydown", onKey);
  }, [active]);

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
      {active && active !== "stories" && (
        <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 pointer-events-none">
          <div
            ref={modalRootRef}
            className="relative w-full max-w-[1250px] bg-black/40 border border-white/10 rounded-xl p-8 shadow-xl pointer-events-auto"
          >
            {/* Close button */}
            <button
              onClick={close}
              aria-label="Close"
              title="Close"
              className="absolute -top-3 -right-3 z-50 text-white/80 hover:text-white text-lg leading-none p-1"
            >
              ✕
            </button>

            {/* PANEL ROUTER */}
            {active === "rituals" && <RitualsPanel />}
            {active === "journal" && <Journal />}
            {active === "covenant" && <CovenantPanel />}
            {active === "memory" && <MemoryPanel />}
            {active === "blessings" && <BlessingsPanel />}
            {active === "badges" && <BadgesPanel />}
            {active === "ascension" && <AscensionPanel />}
            {active === "codex" && <CodexPanel />}
            {active === "stillness" && <StillnessPanel />}
            {active === "forgiveness" && <ForgivenessPanel />}
            {active === "destiny" && <DestinyVigilPanel />}

            {/* ⭐ NEW: ROADMAP & DOCS */}
            {active === "roadmap" && <RoadmapPanel />}
            {active === "docs" && <DocsPanel />}
          </div>
        </div>
      )}

      {/* STORY FULLSCREEN */}
      {active === "stories" && (
        <StoryTellerFullscreen onClose={() => setActive(null)} />
      )}
    </ModalContext.Provider>
  );
}
