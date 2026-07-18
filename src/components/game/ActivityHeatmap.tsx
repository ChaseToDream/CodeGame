"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

/**
 * 学习活动热力图（GitHub 风格贡献图）
 *
 * 设计要点：
 * - 展示最近 12 周（约 84 天）的每日练习完成数
 * - 按周列布局：每列一周，每列 7 格（周日 → 周六）
 * - 颜色按当日完成数分级：0/1/2-3/4+
 * - 月份标签根据列首日期动态生成
 * - 适配项目暗色 + 像素风设计语言
 */

interface ActivityHeatmapProps {
  /** 活动日志：key 为 YYYY-MM-DD，value 为当天完成数 */
  activityLog: Record<string, number>;
}

/** 本地日期键，与 store 中保持一致 */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 根据完成数选择颜色等级 0-4 */
function levelFor(count: number): 0 | 1 | 2 | 3 | 4 {
  if (count <= 0) return 0;
  if (count === 1) return 1;
  if (count <= 3) return 2;
  if (count <= 5) return 3;
  return 4;
}

const LEVEL_COLORS: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "bg-bg3",
  1: "bg-accent/30",
  2: "bg-accent/55",
  3: "bg-accent/80",
  4: "bg-accent2",
};

const LEVEL_TEXT: Record<0 | 1 | 2 | 3 | 4, string> = {
  0: "无活动",
  1: "1 个练习",
  2: "2-3 个练习",
  3: "4-5 个练习",
  4: "6+ 个练习",
};

const WEEK_LABELS = ["日", "一", "二", "三", "四", "五", "六"];
const MONTH_LABELS = ["1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"];

export function ActivityHeatmap({ activityLog }: ActivityHeatmapProps) {
  // 生成最近 12 周的日期网格：以周六为最后一行，向前推 12*7 天
  // 每列代表一周（周日开头），共 12 列
  const { weeks, monthLabels, totalCompleted, activeDays, bestDay } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    // 找到本周的周日作为最右一列的起始
    const todayDay = today.getDay(); // 0=周日
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - todayDay);

    const weeks: { date: Date; key: string; count: number }[][] = [];
    let totalCompleted = 0;
    let activeDays = 0;
    let bestDay = 0;
    const monthMarker: { col: number; label: string }[] = [];
    let lastMonth = -1;

    // 从最早一周（最左）开始构建，便于按列正序渲染
    for (let w = 11; w >= 0; w--) {
      const sunday = new Date(lastSunday);
      sunday.setDate(lastSunday.getDate() - w * 7);
      const week: { date: Date; key: string; count: number }[] = [];
      for (let d = 0; d < 7; d++) {
        const date = new Date(sunday);
        date.setDate(sunday.getDate() + d);
        // 仅展示今天及之前的日期，未来日期留空
        if (date > today) {
          week.push({ date, key: dayKey(date), count: 0 });
          continue;
        }
        const key = dayKey(date);
        const count = activityLog[key] ?? 0;
        week.push({ date, key, count });
        totalCompleted += count;
        if (count > 0) activeDays++;
        if (count > bestDay) bestDay = count;
      }
      weeks.push(week);
      // 月份标签：列首日所在月与上一次不同，则在当前列打标
      const col = 11 - w;
      const month = sunday.getMonth();
      if (month !== lastMonth) {
        monthMarker.push({ col, label: MONTH_LABELS[month] });
        lastMonth = month;
      }
    }

    return { weeks, monthLabels: monthMarker, totalCompleted, activeDays, bestDay };
  }, [activityLog]);

  return (
    <section className="rounded-xl border border-rule bg-bg2 p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="font-outfit text-lg font-bold flex items-center gap-2">
          <span>📅</span> 学习活动
        </h2>
        <div className="flex items-center gap-4 text-xs text-muted">
          <span>
            <span className="text-accent font-bold">{totalCompleted}</span> 个练习
          </span>
          <span>
            <span className="text-accent2 font-bold">{activeDays}</span> 天活跃
          </span>
          {bestDay > 0 && (
            <span>
              最佳：<span className="text-warning font-bold">{bestDay}</span>
            </span>
          )}
        </div>
      </div>

      {totalCompleted === 0 ? (
        <div className="text-center py-8">
          <div className="text-3xl mb-2">🌱</div>
          <p className="text-sm text-muted">
            完成你的第一个练习，开启学习记录！
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto no-scrollbar">
          <div className="inline-block min-w-full">
            {/* 月份标签行 */}
            <div className="flex pl-8 mb-1">
              {weeks.map((_, col) => {
                const marker = monthLabels.find((m) => m.col === col);
                return (
                  <div
                    key={col}
                    className="w-3 sm:w-3.5 text-[10px] text-muted text-center"
                  >
                    {marker?.label ?? ""}
                  </div>
                );
              })}
            </div>

            <div className="flex gap-1">
              {/* 周几标签列 */}
              <div className="flex flex-col gap-1 pr-1">
                {WEEK_LABELS.map((d, i) => (
                  <div
                    key={d}
                    className="h-3 sm:h-3.5 text-[10px] text-muted/60 flex items-center justify-end pr-0.5"
                    style={{ visibility: i % 2 === 1 ? "visible" : "hidden" }}
                  >
                    {d}
                  </div>
                ))}
              </div>

              {/* 热力图主体 */}
              {weeks.map((week, col) => (
                <div key={col} className="flex flex-col gap-1">
                  {week.map((cell) => {
                    const level = levelFor(cell.count);
                    return (
                      <div
                        key={cell.key}
                        title={`${cell.date.toLocaleDateString("zh-CN", { month: "short", day: "numeric" })} · ${LEVEL_TEXT[level]}`}
                        className={cn(
                          "h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-sm border border-rule/50 transition-transform hover:scale-125",
                          LEVEL_COLORS[level],
                        )}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* 图例 */}
            <div className="flex items-center justify-end gap-1.5 mt-3 text-[10px] text-muted">
              <span>少</span>
              {([0, 1, 2, 3, 4] as const).map((lv) => (
                <div
                  key={lv}
                  className={cn(
                    "h-3 w-3 rounded-sm border border-rule/50",
                    LEVEL_COLORS[lv],
                  )}
                />
              ))}
              <span>多</span>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
