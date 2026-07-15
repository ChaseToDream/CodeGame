"use client";

import { cn } from "@/lib/utils";

interface XPBadgeProps {
  xp: number;
  level: number;
  size?: "sm" | "md" | "lg";
  showLevel?: boolean;
}

export function XPBadge({ xp, level, size = "md", showLevel = true }: XPBadgeProps) {
  const sizes = {
    sm: "px-2 py-0.5 text-xs gap-1",
    md: "px-3 py-1 text-sm gap-1.5",
    lg: "px-4 py-1.5 text-base gap-2",
  };
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-accent/60 bg-accent/10 font-pixel",
        sizes[size],
      )}
      title={`${xp} XP`}
    >
      {showLevel && (
        <span className="text-accent2 font-bold">Lv {level}</span>
      )}
      <span className="text-accent font-bold">{xp.toLocaleString()} XP</span>
    </div>
  );
}
