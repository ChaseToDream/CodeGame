import Link from "next/link";
import type { Course } from "@/types";
import { cn } from "@/lib/utils";

interface CourseCardProps {
  course: Course;
  className?: string;
  compact?: boolean;
}

export function CourseCard({ course, className, compact }: CourseCardProps) {
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
            NEW!
          </span>
        )}
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
                : "bg-warning/20 text-warning",
            )}
          >
            {course.difficulty}
          </span>
        </div>
        <p className="text-xs text-muted line-clamp-2 leading-relaxed">{course.description}</p>
        <div className="mt-3 flex items-center justify-between text-[11px] text-muted">
          <span>👥 {(course.learnerCount / 1000).toFixed(0)}K learners</span>
          <span>⏱ {course.estimatedHours}h</span>
        </div>
      </div>
    </Link>
  );
}
