"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function Embers() {
  const [width, setWidth] = useState<number | null>(null);

  // Run ONLY on client
  useEffect(() => {
    setWidth(window.innerWidth);
  }, []);

  if (width === null) return null; // prevent SSR render

  const particles = Array.from({ length: 20 });

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-10">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            opacity: 0,
            y: 0,
            x: Math.random() * width, // now safe
          }}
          animate={{
            opacity: [0, 1, 0],
            y: [-20, -220 - Math.random() * 200],
            x: "+=20",
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 3,
          }}
          className="w-1 h-1 bg-orange-400 rounded-full shadow-[0_0_10px_rgba(255,150,50,0.8)]"
        />
      ))}
    </div>
  );
}
