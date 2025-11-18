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

      {/* FIXED TOP BAR: Profile + Tabs perfectly middle-aligned */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-full flex items-center justify-left">
        <div className="flex items-center gap-10">

          {/* Profile */}
          <div className="flex items-center">
            <TravBadge />
          </div>

          {/* Tabs */}
          <div className="flex items-center">
            <TabBar />
          </div>

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
