"use client";

import { useEffect, useRef, useState } from "react";
import { Howl } from "howler";

export default function AmbientAudio() {
  const started = useRef(false);

  const fire = useRef<Howl | null>(null);
  const wind = useRef<Howl | null>(null);

  useEffect(() => {
    fire.current = new Howl({
      src: ["/fire.mp3"],
      loop: true,
      volume: 0.3,
    });

    wind.current = new Howl({
      src: ["/forest_wind.mp3"],
      loop: true,
      volume: 0.25,
    });

    function startAudio() {
      if (started.current) return;
      started.current = true;

      fire.current?.play();
      wind.current?.play();
    }

    window.addEventListener("click", startAudio);

    return () => {
      window.removeEventListener("click", startAudio);
    };
  }, []);

  return null;
}
