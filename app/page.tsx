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

      {/* Auto-whisper */}
      <AutoGuidance />

      {/* ==========================================================
          TOP BAR — FULLY RESPONSIVE 
          Desktop: Trav left, Tabs center, Mute right
          Tablet & Phone: Trav left (absolute), Tabs centered
      =========================================================== */}
      <div className="fixed top-4 left-0 w-full z-50">

        {/* DESKTOP ONLY (lg and up) */}
        <div
          className="
            hidden lg:flex 
            items-center justify-between 
            px-8
          "
        >
          {/* TravBadge left */}
          <div className="flex-shrink-0">
            <TravBadge />
          </div>

          {/* Tabs centered */}
          <div className="flex-grow flex justify-center">
            <TabBar />
          </div>

          {/* Right side reserved for mute button */}
          <div className="flex-shrink-0 mr-2"></div>
        </div>

        {/* MOBILE + TABLET (lg:hidden) */}
        <div
          className="
            lg:hidden
            w-full max-w-[100vw]
            flex flex-col items-center justify-center
            gap-3 mx-auto
            pt-2
          "
        >
          {/* Trav left (absolute), Tabs center */}
          <div className="relative w-full flex justify-center px-4">

            {/* Trav left */}
            <div className="absolute left-4 top-1">
              <TravBadge />
            </div>

            {/* Tabs centered — shrink on tablet so it fits */}
            <div className="flex justify-center w-full">
              <div className="max-w-[85vw] md:max-w-[70vw] overflow-x-auto scrollbar-hide">
                <TabBar />
              </div>
            </div>
          </div>

          {/* CA BOX — Mobile & Tablet */}
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

        {/* DESKTOP CA BAR */}
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

      {/* Centered Campfire */}
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
