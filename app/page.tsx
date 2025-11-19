"use client";

import Campfire from "@/components/Campfire";
import { ModalProvider } from "@/components/ModalRoot";
import CompassBubble from "@/components/CompassBubble";
import WelcomeBanner from "@/components/WelcomeBanner";
import AutoGuidance from "@/components/AutoGuidance";
import TravBadge from "@/components/TravBadge";
import TabBar from "@/components/TabBar";

export default function Page() {
  return (
    <ModalProvider>
      {/* Welcome message */}
      <WelcomeBanner />

      {/* Auto-whisper engine */}
      <AutoGuidance />

      {/* TOP SECTION – Responsive */}
      <div
        className="
          fixed top-4 left-1/2 -translate-x-1/2 z-50
          w-full max-w-[96vw]
          flex flex-col items-center justify-center
          gap-3
          md:flex-row md:justify-center md:gap-8
        "
      >
        {/* Profile */}
        <div className="flex items-center">
          <TravBadge />
        </div>

        {/* Tabs */}
        <div className="w-full md:w-auto flex justify-center">
          <TabBar />
        </div>
      </div>

      {/* Center campfire */}
      <div className="flex items-center justify-center min-h-screen">
        <Campfire />
      </div>

      {/* Compass bubble */}
      <CompassBubble />
    </ModalProvider>
  );
}
