"use client";

import { useMemo } from "react";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";

/**
 * 30NitesOfCode 年度挑战追踪组件。
 *
 * 在仪表盘展示连续学习进度，激励用户完成 30 天连续打卡挑战。
 * 与 streak 不同：此为特定活动挑战，完成 30 天后自动解锁特殊成就。
 */

interface ChallengeMilestone {
  day: number;
  label: string;
  emoji: string;
}

const MILESTONES: ChallengeMilestone[] = [
  { day: 5, label: "入门者", emoji: "🌱" },
  { day: 10, label: "坚持者", emoji: "🌿" },
  { day: 15, label: "攀登者", emoji: "🪴" },
  { day: 20, label: "勇士", emoji: "🌳" },
  { day: 25, label: "大师", emoji: "🏔️" },
  { day: 30, label: "传奇", emoji: "👑" },
];

export function NightsOfCodeTracker() {
  const { streakDays } = useUserStore(
    useShallow((s) => ({ streakDays: s.user.streakDays })),
  );

  const progress = useMemo(() => streakDays, [streakDays]);
  const completed = progress >= 30;
  const pct = Math.min(100, Math.round((progress / 30) * 100));

  // 当前里程碑
  const currentMilestone = useMemo(() => {
    if (completed) return MILESTONES[MILESTONES.length - 1];
    const reached = MILESTONES.filter((m) => progress >= m.day);
    return reached.length > 0 ? reached[reached.length - 1] : null;
  }, [progress, completed]);

  const nextMilestone = useMemo(() => {
    return MILESTONES.find((m) => m.day > progress) ?? null;
  }, [progress]);

  return (
    <section className="rounded-xl border border-rule bg-bg2 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-outfit text-lg font-bold flex items-center gap-2">
          <span>🌙</span> 30NitesOfCode
        </h2>
        {completed && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/20 text-success">
            ✓ 已完成
          </span>
        )}
      </div>

      <p className="text-sm text-muted mb-4">
        连续编码 30 天，挑战自我，成为传奇！
        {completed
          ? " 你已经完成了这个不可思议的壮举！🎉"
          : nextMilestone
            ? ` 还差 ${nextMilestone.day - progress} 天到达「${nextMilestone.label}」里程碑。`
            : ""}
      </p>

      {/* 进度条 */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-muted">进度</span>
          <span className="font-bold text-accent">{progress} / 30 天</span>
        </div>
        <div className="h-3 rounded-full bg-bg3 overflow-hidden">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              completed
                ? "bg-gradient-to-r from-success to-accent3"
                : "bg-gradient-to-r from-accent to-accent2",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* 里程碑 */}
      <div className="grid grid-cols-6 gap-1">
        {MILESTONES.map((m) => {
          const reached = progress >= m.day;
          return (
            <div
              key={m.day}
              className={cn(
                "text-center py-2 rounded-lg transition",
                reached ? "bg-accent/15" : "bg-bg3/50 opacity-50",
              )}
              title={`${m.label} — 第 ${m.day} 天`}
            >
              <div className="text-lg">{m.emoji}</div>
              <div className="text-[9px] text-muted mt-0.5">{m.day}天</div>
            </div>
          );
        })}
      </div>

      {!completed && progress > 0 && (
        <p className="text-[11px] text-accent2 mt-3 text-center">
          每天完成一个练习或挑战，坚持就是胜利！💪
        </p>
      )}
    </section>
  );
}