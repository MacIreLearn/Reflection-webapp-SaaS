"use client";

import { useEffect, useState } from "react";

export function AnimatedBackground() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <>
      {/* Fixed Interactive Mouse Glow */}
      {mounted && (
        <div
          className="fixed inset-0 z-[-5] transition-opacity duration-300 opacity-60 dark:opacity-40 pointer-events-none"
          style={{
            background: `radial-gradient(circle 600px at ${mousePos.x}px ${mousePos.y}px, rgba(47, 149, 104, 0.15), transparent 80%)`,
          }}
        />
      )}

      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        {/* SVG Cinematic Noise Texture */}
        <div 
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay z-0" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        ></div>

        {/* Slow Spinning Mesh Orbs */}
        <div className="absolute -top-[10%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-br from-calm-300/40 to-yellow-200/40 dark:from-calm-800/40 dark:to-yellow-900/40 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60 animate-spin-slow origin-center"></div>
        <div className="absolute top-[20%] -right-[10%] w-[50vw] h-[50vw] rounded-full bg-gradient-to-tl from-stone-300/40 to-orange-200/40 dark:from-stone-700/40 dark:to-orange-900/40 mix-blend-multiply dark:mix-blend-screen filter blur-[120px] opacity-60 animate-spin-slow-reverse origin-center"></div>

        {/* Diagonal Panning Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_10%,#000_80%,transparent_100%)] animate-grid-flow"></div>
      </div>
    </>
  );
}
