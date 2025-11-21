"use client";

export default function DocsPanel() {
  return (
    <div className="text-white/90 space-y-6 max-h-[70vh] overflow-y-auto pr-2">
      <h1 className="text-3xl font-bold text-amber-300 drop-shadow">
        Project Documentation
      </h1>

      <section>
        <h2 className="text-xl font-semibold text-amber-200">🔥 Identity</h2>
        <p className="text-white/80 leading-relaxed">
          REST is a quiet sanctuary for traders — a calming campfire where you can
          escape the noise, regain clarity, and reconnect with yourself.
        </p>
      </section>

      <section>
        {/* ✅ FIXED TAG BELOW */}
        <h2 className="text-xl font-semibold text-amber-200">🔥 Mission</h2>
        <p className="text-white/80 leading-relaxed">
          To create a peaceful, lore-driven environment where traders can rest,
          reflect, and return to the markets with clarity.
        </p>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-amber-200">🔥 What Makes REST Different</h2>
        <ul className="text-white/80 space-y-1">
          <li>• Fully functional sanctuary website at launch</li>
          <li>• Interactive rituals, whispers, blessings</li>
          <li>• Emotional support loop instead of hype loop</li>
          <li>• No rugs — transparent and fair</li>
          <li>• Lore-driven experience with the Ember Spirit</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-amber-200">🔥 Transparency</h2>
        <ul className="text-white/80 space-y-1">
          <li>• LP auto-burn on migration</li>
          <li>• No private buyers</li>
          <li>• No VC</li>
          <li>• No hidden tax or mint tricks</li>
          <li>• Dev wallet small (&lt;5%), disclosed</li>
          <li>• No contract modification possible post-launch</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-amber-200">🔥 Utilities</h2>
        <p className="text-white/80 leading-relaxed">Current Utility:</p>
        <ul className="text-white/80 space-y-1">
          <li>• Rest ritual system</li>
          <li>• Warmth mechanics</li>
          <li>• Blessing unlocks</li>
          <li>• Whisper engine</li>
          <li>• Memory and journaling</li>
        </ul>

        <p className="text-white/80 leading-relaxed mt-3">Future Utility:</p>
        <ul className="text-white/80 space-y-1">
          <li>• AI Ember Spirit companion</li>
          <li>• Trading wellness tools</li>
          <li>• Rest streaks</li>
          <li>• Community campfire circles</li>
          <li>• Warmth leaderboard</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-amber-200">🔥 Token Information</h2>
        <ul className="text-white/80 space-y-1">
          <li>• Network: Solana</li>
          <li>• CA: F9yM72tsdWn3Fa5od9UWtnU19rCjEKqMypyjVCEspump</li>
          <li>• Supply: 1B</li>
          <li>• Fair launch, no presale, no VC</li>
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-amber-200">🔥 Founder Note</h2>
        <p className="text-white/80 leading-relaxed italic">
          “This project is made for the weary trader — someone who just needs a
          moment of peace. If even one person finds clarity here, this fire has
          already served its purpose.”
        </p>
        <p className="text-white/80">— Campfire Dev</p>
      </section>
    </div>
  );
}
