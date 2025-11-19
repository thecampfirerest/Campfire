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

      {/* TOP SECTION – Clean + Responsive */}
<div
  className="
    fixed top-6 left-1/2 -translate-x-1/2 z-50
    w-full max-w-[98vw]
    flex flex-col items-center justify-center gap-2
  "
>
  {/* ROW: TravBadge + Tabs */}
  <div
    className="
      w-full flex items-center justify-between
      px-4
    "
  >
    {/* TravBadge left */}
    <div className="flex-shrink-0">
      <TravBadge />
    </div>

    {/* Tabs centered */}
    <div className="flex-grow flex justify-center md:ml-[-70px]">
      <TabBar />
    </div>
  </div>

  {/* CA BOX under the tabs */}
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

      {/* Copy button */}
      <button
        onClick={() => navigator.clipboard.writeText('CA will be pasted here on launch')}
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
      <SocialLinks />
    </ModalProvider>
  );
}
