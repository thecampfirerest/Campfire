"use client";
import Image from "next/image";

export default function SocialLinks() {
  return (
    <div
      className="
        fixed bottom-6 left-6 z-[90]
        flex flex-col gap-3
      "
    >
      {/* Discord */}
      <a
        href="https://discord.gg/xU6qQq4PPp" // <-- replace with your real link
        target="_blank"
        className="
          w-12 h-12 rounded-full bg-black/60 border border-white/10 shadow-lg
          flex items-center justify-center backdrop-blur-md
        "
      >
        <Image
          src="/discord.png"
          alt="Discord"
          width={28}
          height={28}
        />
      </a>

      {/* X */}
      <a
        href="https://x.com/CampfireRest" // <-- replace with real link
        target="_blank"
        className="
          w-12 h-12 rounded-full bg-black/60 border border-white/10 shadow-lg
          flex items-center justify-center backdrop-blur-md
        "
      >
        <Image
          src="/x.png"
          alt="X"
          width={24}
          height={24}
        />
      </a>

      {/* Telegram */}
      <a
        href="https://t.me/campfirerest" // <-- replace with real link
        target="_blank"
        className="
          w-12 h-12 rounded-full bg-black/60 border border-white/10 shadow-lg
          flex items-center justify-center backdrop-blur-md
        "
      >
        <Image
          src="/telegram.png"
          alt="Telegram"
          width={26}
          height={26}
        />
      </a>
    </div>
  );
}
