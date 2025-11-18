"use client";

import { useState } from "react";
import { addWarmth } from "@/lib/innerWarmth";
import { saveMemory, loadMemory } from "@/lib/memoryClient";
import { evaluateBlessings } from "@/lib/blessings";

export default function BurdenRelease({
  onRelease,
}: {
  onRelease?: () => void;
}) {
  const [show, setShow] = useState(false);
  const [text, setText] = useState("");

  function open() {
    setShow(true);
  }

  function close() {
    setShow(false);
  }

  function release() {
    if (!text.trim()) return;

    // save burden
    const hist = loadMemory<any[]>("burdens") ?? [];
    hist.unshift({
      text,
      at: new Date().toISOString(),
    });
    saveMemory("burdens", hist.slice(0, 100));

    // small warmth reward for emotional release
    addWarmth(2);

    // update blessings
    try {
      evaluateBlessings();
    } catch {}

    onRelease?.();
    setText("");
    close();
  }

  return (
    <>
      <button
        onClick={open}
        className="px-6 py-2 rounded-xl bg-red-500/20 border border-red-500/30 text-sm hover:bg-red-500/30 transition backdrop-blur-lg"
      >
        Release Burden
      </button>

      {show && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200] flex items-center justify-center">
          <div className="w-[90%] max-w-md bg-black/40 border border-white/10 rounded-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-3">
              <div className="text-amber-200 font-semibold">Release Burden</div>
              <button
                onClick={close}
                className="px-3 py-1 rounded text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Write your burden here…"
              className="w-full h-32 bg-black/30 border border-white/10 rounded p-2 text-sm text-white/90 focus:outline-none"
            />

            <button
              onClick={release}
              className="mt-4 w-full px-4 py-2 rounded bg-red-500/30 hover:bg-red-500/40 transition border border-red-500/40 text-white/90"
            >
              Let It Go
            </button>
          </div>
        </div>
      )}
    </>
  );
}
