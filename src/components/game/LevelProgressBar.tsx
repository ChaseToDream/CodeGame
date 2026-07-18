import { memo } from "react";
import { cn } from "@/lib/utils";

interface LevelProgressBarProps {
  currentXP: number;
  levelStartXP: number;
  levelEndXP: number;
  level: number;
  className?: string;
}

export const LevelProgressBar = memo(function LevelProgressBar({
  currentXP,
  levelStartXP,
  levelEndXP,
  level,
  className,
}: LevelProgressBarProps) {
  const range = Math.max(1, levelEndXP - levelStartXP);
  const within = Math.max(0, Math.min(range, currentXP - levelStartXP));
  const pct = (within / range) * 100;
  return (
    <div className={cn("w-full", className)}>
      <div className="flex justify-between items-center mb-1.5 text-xs">
        <span className="text-muted">
          等级 <span className="text-accent2 font-bold">{level}</span>
        </span>
        <span className="text-muted">
          <span className="text-accent font-bold">{within}</span> / {range} XP
        </span>
        <span className="text-muted">
          下一级：<span className="text-accent2 font-bold">Lv {level + 1}</span>
        </span>
      </div>
      <div className="h-3 rounded-full bg-bg2 overflow-hidden border border-rule">
        <div
          className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-700 relative overflow-hidden"
          style={{ width: `${pct}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
        </div>
      </div>
    </div>
  );
});
