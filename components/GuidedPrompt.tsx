"use client";
import { useEffect, useState } from "react";

/**
 * Gentle guided prompt with small timed steps.
 * Props:
 * - ritual: ritual def
 * - scripturePrompts: array of {id,text}
 * - onComplete(notes)
 */

export default function GuidedPrompt({
  ritual,
  scripturePrompts,
  onComplete,
}: {
  ritual: any;
  scripturePrompts: any[];
  onComplete?: (notes?: any) => void;
}) {
  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState("");
  const [timer, setTimer] = useState<number | null>(null);

  useEffect(() => {
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timer]);

  function nextAfter(ms: number) {
    const t = window.setTimeout(() => setStep((s) => s + 1), ms);
    setTimer(t);
  }

  // simple flow: 1) scripture 2) breathe (3 min shortened) 3) reflect 4) write
  if (step === 0) {
    const s = scripturePrompts[Math.floor(Math.random() * scripturePrompts.length)];
    return (
      <div>
        <div className="mb-2 italic text-white/90">{s.text}</div>
        <div className="text-xs text-white/70 mb-3">Listen. Let the words rest in you.</div>
        <button
          onClick={() => {
            setStep(1);
            nextAfter(180000); // 3 minutes breathing; developer can reduce while testing
          }}
          className="px-3 py-2 rounded bg-amber-500/30"
        >
          Begin Silence (3 min)
        </button>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div>
        <div className="mb-2 text-white/80">Silence in progress… Breathe slowly.</div>
        <div className="text-xs mb-3">When the silence finishes you will be invited to reflect.</div>
        <button
          onClick={() => {
            if (timer) clearTimeout(timer);
            setStep(2);
          }}
          className="px-3 py-2 rounded bg-white/6"
        >
          End Silence
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div>
        <div className="mb-2 font-medium">Reflect</div>
        <div className="text-xs text-white/70 mb-3">What did the Lord bring to mind? What weighs you?</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full h-24 bg-black/30 border border-white/10 rounded p-2 mb-3"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setStep(3);
            }}
            className="px-3 py-2 rounded bg-amber-500/30"
          >
            Save Reflection
          </button>
          <button onClick={() => onComplete?.()} className="px-3 py-2 rounded bg-white/6">
            Skip
          </button>
        </div>
      </div>
    );
  }

  // final
  return (
    <div>
      <div className="mb-3 text-white/80">Thank you for resting. Would you like to save a short prayer or note?</div>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        className="w-full h-24 bg-black/30 border border-white/10 rounded p-2 mb-3"
      />
      <div className="flex gap-2">
        <button
          onClick={() => {
            onComplete?.(notes);
          }}
          className="px-3 py-2 rounded bg-amber-500/30"
        >
          Save & Close
        </button>
        <button onClick={() => onComplete?.()} className="px-3 py-2 rounded bg-white/6">
          Close
        </button>
      </div>
    </div>
  );
}
