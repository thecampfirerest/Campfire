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
      {/* Welcome message */}
      <WelcomeBanner />

      {/* Auto-whisper engine */}
      <AutoGuidance />

      {/* ----------------------------------------------------
         TOP BAR (FULLY RESPONSIVE WITHOUT BREAKING ANYTHING)
         ---------------------------------------------------- */}
      <div className="fixed top-4 left-0 w-full z-50">

        {/* DESKTOP (Trav left — Tabs center — Mute right) */}
        <div
          className="
            hidden lg:flex
            items-center justify-between
            px-8
          "
        >
          {/* Left: TravBadge */}
          <div className="flex-shrink-0">
            <TravBadge />
          </div>

          {/* Center: Tabs */}
          <div className="flex-grow flex justify-center pointer-events-auto">
            <TabBar />
          </div>

          {/* Right: Mute button stays as-is inside AmbientAudio */}
          <div className="flex-shrink-0 mr-2"></div>
        </div>

        {/* MOBILE + TABLET VERSION (unchanged from your working layout) */}
        <div
          className="
            lg:hidden
            w-full max-w-[98vw]
            flex flex-col items-center justify-center gap-2
            mx-auto
          "
        >
          {/* Row: TravBadge left + Tabs center */}
          <div className="w-full flex items-center justify-between px-4">
            <div className="flex-shrink-0">
              <TravBadge />
            </div>

            <div className="flex-grow flex justify-center">
              <TabBar />
            </div>
          </div>

          {/* CA BOX */}
          <div className="w-full flex justify-center mt-1 px-4">
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

        {/* DESKTOP CA BAR (centered under tabs) */}
        <div className="hidden lg:flex w-full justify-center mt-3 pointer-events-auto">
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

      {/* Center campfire */}
      <div className="flex items-center justify-center min-h-screen">
        <Campfire />
      </div>

      {/* Compass bubble */}
      <CompassBubble />

      {/* Social links */}
      <SocialLinks />
    </ModalProvider>
  );
}
