"use client";

import Campfire from "@/components/Campfire";
import AmbientAudio from "@/components/AmbientAudio";
import Embers from "@/components/Embers";
import TravBadge from "@/components/TravBadge";

import { ModalProvider } from "@/components/ModalRoot";
import TabBar from "@/components/TabBar";

export default function Home() {
  const hour = new Date().getHours();
  const night = hour >= 22 || hour < 5;
  return (
    <ModalProvider>
      <div
        className={`relative w-screen h-screen overflow-hidden flex items-center justify-center transition-all duration-700 ${
          night ? "bg-gradient-to-b from-[#0a0210] to-black" : "bg-black"
        }`}
      >
        <AmbientAudio />
        <Embers />

        <Campfire />

        <TravBadge />

        <TabBar />
      </div>
    </ModalProvider>
  );
}
