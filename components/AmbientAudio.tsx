"use client";

import { useEffect, useRef } from "react";
import { Howl } from "howler";

export default function AmbientAudio() {
  const soundsRef = useRef<Howl[]>([]);

  useEffect(() => {
    if (soundsRef.current.length === 0) {
      const fireplace = new Howl({
        src: ["/fireplace.mp3"],
        loop: true,
        volume: 0.55,
      });

      const ambient = new Howl({
        src: ["/ambient.mp3"],
        loop: true,
        volume: 0.35,
      });

      const wind = new Howl({
        src: ["/forest-wind.mp3"],
        loop: true,
        volume: 0.25,
      });

      soundsRef.current = [fireplace, ambient, wind];

      fireplace.play();
      ambient.play();
      wind.play();
    }

    return () => {
      soundsRef.current.forEach((s) => s.stop());
    };
  }, []);

  return null;
}
