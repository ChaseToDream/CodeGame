import type { Badge } from "@/types";
import { cn } from "@/lib/utils";

interface BadgeGridProps {
  badges: (Badge & { earned: boolean; earnedAt?: string })[];
}

export function BadgeGrid({ badges }: BadgeGridProps) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
      {badges.map((b) => (
        <div
          key={b.id}
          className={cn(
            "group relative aspect-square rounded-lg border flex flex-col items-center justify-center p-2 transition-all cursor-default",
            b.earned
              ? "border-accent/60 bg-bg3 hover:shadow-glow"
              : "border-rule bg-bg2 opacity-50 grayscale",
          )}
          title={b.earned ? `${b.name} — ${b.description}` : `未解锁：${b.criteria}`}
        >
          <div className="text-2xl sm:text-3xl">{b.emoji}</div>
          <div className="mt-1 text-[10px] sm:text-xs text-center text-muted leading-tight line-clamp-2">
            {b.name}
          </div>
          {b.earned && (
            <div className="absolute top-1 right-1 w-2 h-2 rounded-full bg-success" />
          )}
        </div>
      ))}
    </div>
  );
}
