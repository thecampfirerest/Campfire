"use client";

import Campfire from "@/components/Campfire";
import { ModalProvider } from "@/components/ModalRoot";
import CompassBubble from "@/components/CompassBubble";
import WelcomeBanner from "@/components/WelcomeBanner";
import AutoGuidance from "@/components/AutoGuidance";
import TravBadge from "@/components/TravBadge";
import TabBar from "@/components/TabBar";
import SocialLinks from "@/components/SocialLinks";

export default function Page() {
  return (
    <ModalProvider>
      {/* Welcome */}
      <WelcomeBanner />
      <AutoGuidance />

      {/* ==========================================================
          TOP BAR — RESPONSIVE
          Desktop: Trav left, Tabs center, Mute right (unchanged)
          Mobile/Tablet: Trav ABOVE tabs
      =========================================================== */}
      <div className="fixed top-4 left-0 w-full z-50">

        {/* DESKTOP (unchanged) */}
        <div className="hidden lg:flex items-center justify-between px-8">
          <div className="flex-shrink-0">
            <TravBadge />
          </div>

          <div className="flex-grow flex justify-center">
            <TabBar />
          </div>

          <div className="flex-shrink-0 mr-2"></div>
        </div>

        {/* MOBILE + TABLET */}
        <div className="lg:hidden w-full flex flex-col items-center gap-2 px-4">

          {/* TravBadge ABOVE tabs */}
          <div className="w-full flex justify-start">
            <TravBadge />
          </div>

          {/* Tabs CENTERED below TravBadge */}
          <div className="w-full flex justify-center">
            <div className="max-w-[90vw] md:max-w-[70vw] overflow-x-auto scrollbar-hide">
              <TabBar />
            </div>
          </div>

          {/* CA box under tabs */}
          <div className="w-full flex justify-center mt-1">
            <div
              className="
                flex items-center gap-2
                bg-black/30 backdrop-blur-md
                border border-white/10
                rounded-full px-4 py-2
                text-white/80 text-xs
                max-w-[90vw]
              "
            >
              <span className="truncate">CA: CA will be pasted here on launch</span>

              <button
                onClick={() =>
                  navigator.clipboard.writeText("CA will be pasted here on launch")
                }
                className="text-white/60 hover:text-white transition"
              >
                📋
              </button>
            </div>
          </div>
        </div>

        {/* DESKTOP CA BAR (unchanged) */}
        <div className="hidden lg:flex w-full justify-center mt-3">
          <div
            className="
              flex items-center gap-2
              bg-black/30 backdrop-blur-md
              border border-white/10
              rounded-full px-4 py-2
              text-white/80 text-xs
            "
          >
            <span className="truncate">CA: CA will be pasted here on launch</span>

            <button
              onClick={() =>
                navigator.clipboard.writeText("CA will be pasted here on launch")
              }
              className="text-white/60 hover:text-white transition"
            >
              📋
            </button>
          </div>
        </div>
      </div>

      {/* Campfire */}
      <div className="flex items-center justify-center min-h-screen">
        <Campfire />
      </div>

      <CompassBubble />
      <SocialLinks />
    </ModalProvider>
  );
}
