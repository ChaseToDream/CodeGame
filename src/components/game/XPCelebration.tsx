"use client";

import { useEffect } from "react";
import confetti from "canvas-confetti";

interface XPCelebrationProps {
  xp: number;
  trigger: boolean;
  onComplete?: () => void;
}

export function XPCelebration({ xp, trigger, onComplete }: XPCelebrationProps) {
  useEffect(() => {
    if (!trigger) return;
    const colors = ["#7c5cfc", "#ff6b9d", "#4ecdc4", "#6bcf7f", "#f0a04b"];
    const end = Date.now() + 1200;
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 70,
        origin: { x: 0, y: 0.7 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 70,
        origin: { x: 1, y: 0.7 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
    const t = setTimeout(() => onComplete?.(), 2000);
    return () => clearTimeout(t);
  }, [trigger, xp, onComplete]);

  if (!trigger) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative animate-xpPop">
        <div className="font-pixel text-6xl sm:text-7xl gradient-text font-bold drop-shadow-[0_0_30px_rgba(124,92,252,0.6)]">
          +{xp} XP
        </div>
        <div className="text-center mt-2 text-xl font-outfit text-ink">Exercise complete! 🎉</div>
      </div>
    </div>
  );
}
