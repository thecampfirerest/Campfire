import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Healing Campfire",
  description: "Rest by the fire. Breathe. Heal.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white min-h-screen">
        {children}
      </body>
    </html>
  );
}
