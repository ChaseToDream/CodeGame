import Link from "next/link";
import type { Course } from "@/types";
import { cn } from "@/lib/utils";
import { BookmarkButton } from "@/components/game/BookmarkButton";

interface CourseCardProps {
  course: Course;
  className?: string;
  compact?: boolean;
  /** 该课程的完成百分比（0-100）。未提供时不显示进度条。 */
  progressPct?: number;
}

export function CourseCard({ course, className, compact, progressPct }: CourseCardProps) {
  const hasProgress = typeof progressPct === "number";
  const isCompleted = hasProgress && progressPct === 100;
  const isInProgress = hasProgress && progressPct! > 0 && progressPct! < 100;
  return (
    <Link
      href={`/${course.slug}`}
      className={cn(
        "group block rounded-xl overflow-hidden border border-rule bg-bg2 transition-all duration-300 hover:border-accent hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <div
        className="relative h-28 sm:h-32 flex items-center justify-center overflow-hidden"
        style={{ background: course.bannerGradient }}
      >
        <span className="text-4xl sm:text-5xl drop-shadow-lg group-hover:scale-110 transition-transform duration-300">
          {course.icon}
        </span>
        {course.isNew && (
          <span className="absolute top-2 right-2 px-2 py-0.5 rounded bg-accent2 text-bg text-xs font-bold font-pixel">
            新！
          </span>
        )}
        {isCompleted && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-success text-bg text-xs font-bold font-pixel">
            ✓ 已完成
          </span>
        )}
        {isInProgress && (
          <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-accent3 text-bg text-xs font-bold font-pixel">
            ▶ {progressPct}%
          </span>
        )}
        {/* 书签按钮：浮在 banner 右下角，使用 solid variant 保证在彩色背景上可读 */}
        <div className="absolute bottom-2 right-2 z-10">
          <BookmarkButton type="course" id={course.id} variant="solid" size="sm" />
        </div>
      </div>
      <div className={cn("p-4", compact && "p-3")}>
        <div className="flex items-center justify-between gap-2 mb-1">
          <h3 className="font-outfit font-bold text-ink group-hover:text-accent transition-colors line-clamp-1">
            {course.title}
          </h3>
          <span
            className={cn(
              "shrink-0 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
              course.difficulty === "beginner"
                ? "bg-success/20 text-success"
                : course.difficulty === "advanced"
                  ? "bg-accent2/20 text-accent2"
                  : "bg-warning/20 text-warning",
            )}
          >
            {course.difficulty === "beginner" ? "入门" : course.difficulty === "advanced" ? "高级" : "进阶"}
          </span>
        </div>
        <p className="text-xs text-muted line-clamp-2 leading-relaxed">{course.description}</p>
        {/* 进度条：仅在用户开始过该课程时显示，避免新用户被满屏灰色条干扰 */}
        {hasProgress && progressPct! > 0 && (
          <div className="mt-2 h-1 rounded-full bg-bg3 overflow-hidden">
            <div
              className={cn(
                "h-full transition-all",
                isCompleted ? "bg-success" : "bg-gradient-to-r from-accent to-accent3",
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        )}
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
          <span>👥 {(course.learnerCount / 1000).toFixed(0)}K 学习者</span>
          <span>⏱ {course.estimatedHours} 小时</span>
        </div>
      </div>
    </Link>
  );
}
