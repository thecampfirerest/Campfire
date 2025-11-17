"use client";
import { useEffect, useState } from "react";
import { performRitual, loadRituals } from "@/lib/rituals";
import { saveMemory } from "@/lib/memoryClient";
import GuidedPrompt from "./GuidedPrompt";

export default function RitualEngine({
  ritual,
  scripturePrompts,
  onClose,
}: {
  ritual: any;
  scripturePrompts: any[];
  onClose?: () => void;
}) {
  const [step, setStep] = useState(0);
  const [input, setInput] = useState("");
  const [running, setRunning] = useState(false);

  useEffect(() => {
    setStep(0);
    setInput("");
  }, [ritual]);

  async function finish(payload?: any) {
    // perform
    performRitual(ritual, payload);
    // optional memory quick note
    saveMemory("last_ritual_performed", { id: ritual.id, at: new Date().toISOString(), payload });
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      onClose?.();
    }, 900);
  }

  // Flow per ritual type
  if (ritual.type === "simple") {
    return (
      <div className="p-4 bg-black/50 rounded">
        <div className="mb-3 font-medium">{ritual.title}</div>
        <div className="text-xs mb-4 text-white/70">{ritual.description}</div>
        <button
          onClick={() => finish()}
          className="px-4 py-2 rounded bg-amber-500/30 hover:bg-amber-500/40"
        >
          Begin Stillness
        </button>
      </div>
    );
  }

  if (ritual.type === "input") {
    return (
      <div className="p-4 bg-black/50 rounded">
        <div className="mb-2 font-medium">{ritual.title}</div>
        <div className="text-xs mb-3 text-white/70">{ritual.description}</div>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full h-28 bg-black/30 border border-white/10 rounded p-2 mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              finish({ text: input });
            }}
            className="px-3 py-2 rounded bg-amber-500/30 hover:bg-amber-500/40"
          >
            Release to Fire
          </button>
          <button onClick={() => onClose?.()} className="px-3 py-2 rounded bg-white/6">
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // guided
  return (
    <div className="p-4 bg-black/50 rounded">
      <div className="mb-2 font-medium">{ritual.title}</div>
      <div className="text-xs mb-3 text-white/70">{ritual.description}</div>
      <GuidedPrompt
        ritual={ritual}
        scripturePrompts={scripturePrompts}
        onComplete={(notes) => finish({ notes })}
      />
      <div className="mt-3">
        <button onClick={() => onClose?.()} className="px-3 py-2 rounded bg-white/6">
          Close
        </button>
      </div>
    </div>
  );
}
