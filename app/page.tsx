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

      {/* Traventurer badge */}
      <TravBadge />

      {/* Top navigation */}
      <div className="fixed top-6 left-1/2 -translate-x-1/2 z-40">
        <TabBar />
      </div>

      {/* Center campfire */}
      <div className="flex items-center justify-center min-h-screen">
        <Campfire />
      </div>

      {/* Compass Codex */}
      <CompassBubble />
    </ModalProvider>
  );
}
