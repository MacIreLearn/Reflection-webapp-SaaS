"use client";

import { useState, useEffect } from "react";
import { affirmations } from "@/lib/affirmations";
import { Sparkles } from "lucide-react";

export function AffirmationCard({ className = "" }: { className?: string }) {
  const [affirmation, setAffirmation] = useState("");

  useEffect(() => {
    // Select random affirmation on mount to avoid hydration mismatch
    const random = affirmations[Math.floor(Math.random() * affirmations.length)];
    setAffirmation(random);
  }, []);

  if (!affirmation) return null; // Or a glowing skeleton loader

  return (
    <div className={`relative flex items-center gap-3 rounded-2xl bg-[#0a0f1a]/80 px-5 py-3 text-sm md:text-base font-medium text-[#E4E9F2] backdrop-blur-xl border border-white/10 shadow-[0_0_20px_rgba(47,149,104,0.15)] animate-fade-in-up transition-all duration-500 hover:shadow-[0_0_40px_rgba(47,149,104,0.3)] hover:border-white/20 hover:-translate-y-1 ${className}`}>
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-calm-600/10 to-transparent opacity-50 pointer-events-none"></div>
      <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <Sparkles className="h-5 w-5 text-calm-400 drop-shadow-[0_0_10px_rgba(80,176,131,0.8)] shrink-0" />
      <span className="relative z-10 leading-relaxed font-serif italic">&quot;{affirmation}&quot;</span>
    </div>
  );
}
