export default function Placeholder() {
  return (
    <div className="relative min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      
      {/* Glowing Ember Particles */}
      <div className="pointer-events-none absolute inset-0 ember-particles" />

      {/* Center Content */}
      <div className="relative z-10 text-center px-8">
        <h1 className="text-4xl font-bold mb-4 text-amber-300 drop-shadow-[0_0_12px_rgba(255,180,90,0.35)]">
          🔥 The Fire Sleeps…
        </h1>

        <p className="text-white/80 text-lg max-w-md mx-auto leading-relaxed">
          A quiet ember waits beneath the ashes.  
          Return soon, traveler — the flame will awaken.
        </p>
      </div>

      {/* Soft glow behind text */}
      <div className="absolute w-96 h-96 bg-amber-500/20 blur-3xl rounded-full -z-10" />
      
      {/* Inline CSS for ember particles */}
      <style>{`
        .ember-particles {
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255,160,70,0.08) 0%, transparent 40%),
            radial-gradient(circle at 75% 60%, rgba(255,130,50,0.05) 0%, transparent 45%),
            radial-gradient(circle at 50% 80%, rgba(255,100,30,0.04) 0%, transparent 50%);
          animation: emberGlow 6s ease-in-out infinite alternate;
        }

        @keyframes emberGlow {
          0% {
            opacity: 0.55;
            transform: scale(1);
          }
          100% {
            opacity: 1;
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
