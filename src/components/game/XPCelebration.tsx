"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

interface XPCelebrationProps {
  xp: number;
  trigger: boolean;
  onComplete?: () => void;
}

export function XPCelebration({ xp, trigger, onComplete }: XPCelebrationProps) {
  // 用 ref 持有最新的 onComplete，避免父组件传入内联函数导致 effect 频繁重启
  // （重启会再次触发 confetti 动画，破坏庆祝效果）
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

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
    const t = setTimeout(() => onCompleteRef.current?.(), 2000);
    return () => clearTimeout(t);
  }, [trigger]);

  if (!trigger) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
      <div className="absolute inset-0 bg-black/40" />
      <div className="relative animate-xpPop">
        <div className="font-pixel text-6xl sm:text-7xl gradient-text font-bold drop-shadow-[0_0_30px_rgba(124,92,252,0.6)]">
          +{xp} XP
        </div>
        <div className="text-center mt-2 text-xl font-outfit text-ink">练习完成！🎉</div>
      </div>
    </div>
  );
}
