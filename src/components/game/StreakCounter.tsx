import { cn } from "@/lib/utils";

interface StreakCounterProps {
  days: number;
  lastActiveDate: string;
  size?: "sm" | "md" | "lg";
}

export function StreakCounter({ days, lastActiveDate, size = "md" }: StreakCounterProps) {
  const isToday = new Date(lastActiveDate).toDateString() === new Date().toDateString();
  const flameColor =
    days >= 30 ? "text-warning" : days >= 7 ? "text-accent2" : days > 0 ? "text-accent2" : "text-muted";
  const sizes = {
    sm: "text-sm gap-1",
    md: "text-base gap-1.5",
    lg: "text-2xl gap-2",
  };
  const flameSize = {
    sm: "text-base",
    md: "text-xl",
    lg: "text-3xl",
  };
  return (
    <div className={cn("inline-flex items-center font-pixel", sizes[size])}>
      <span
        className={cn(
          flameSize[size],
          flameColor,
          days >= 30 && "drop-shadow-[0_0_8px_rgba(240,160,75,0.7)]",
          !isToday && days > 0 && "opacity-50",
        )}
      >
        🔥
      </span>
      <span className="text-ink font-bold">{days}</span>
      <span className="text-muted">day streak</span>
    </div>
  );
}
