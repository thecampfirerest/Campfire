export default function Tooltip({
  children,
  side = "right",
}: {
  children: React.ReactNode;
  side?: "left" | "right";
}) {
  return (
    <div
      className={`absolute top-1/2 -translate-y-1/2 w-48 
      bg-black/70 text-white/90 px-3 py-2 rounded-lg 
      border border-white/10 backdrop-blur-xl shadow-xl z-50
      ${side === "right" ? "left-full ml-3" : "right-full mr-3"}
      `}
    >
      {children}
    </div>
  );
}
