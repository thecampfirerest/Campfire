"use client";
import React, { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

const MESSAGE =
  "Welcome Traventurer to the campsite — here you can rest, find peace, and receive guidance. Stay as long as you like.";

let alreadyShown = false;

export default function WelcomeBanner() {
  const [text, setText] = useState("");
  const typingIndex = useRef(0);
  const timeoutRef = useRef<number | null>(null);

  const sound = useRef<Howl | null>(null);

  useEffect(() => {
    if (alreadyShown) return;
    alreadyShown = true;

    // Preload sound once
    sound.current = new Howl({
      src: ["/typing.mp3"],
      volume: 0.28,
      preload: true,
    });

    function typeStep() {
      // STOP SOUND WHEN FINISHED TYPING (fix 1)
      if (typingIndex.current >= MESSAGE.length) {
        sound.current?.stop();
        return;
      }

      const ch = MESSAGE[typingIndex.current++];
      setText((t) => t + ch);

      // PERFECT SYNC (fix 2)
      if (ch !== " " && sound.current) {
        if (!sound.current.playing()) {
          sound.current.seek(0);
          sound.current.play();
        }
      }

      const delay = ch === " " ? 30 : 55;
      timeoutRef.current = window.setTimeout(typeStep, delay);
    }

    // Small natural wait before typing starts
    timeoutRef.current = window.setTimeout(typeStep, 300);

    // Auto hide after full message + 2 seconds
    const autoHide = setTimeout(() => setText(""), MESSAGE.length * 55 + 2000);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      clearTimeout(autoHide);

      // HARD STOP on unmount (fix 3)
      sound.current?.stop();
    };
  }, []);

  if (!text) return null;

  return (
    <div className="fixed top-[32%] left-1/2 -translate-x-1/2 z-[60] pointer-events-none">
      <div className="bg-black/55 text-white/90 px-8 py-4 rounded-xl border border-white/10 backdrop-blur-md max-w-3xl text-center shadow-xl text-base leading-relaxed font-medium">
        {text}
      </div>
    </div>
  );
}
