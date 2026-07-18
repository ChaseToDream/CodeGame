"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { courses } from "@/data/courses";
import { learningJourneys } from "@/data/journeys";
import { CourseCard } from "@/components/course/CourseCard";
import { cn } from "@/lib/utils";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import type { Course, CourseTag } from "@/types";

const ALL_TAGS: CourseTag[] = [
  "Beginner",
  "Intermediate",
  "Advanced",
  "Python",
  "Web Development",
  "Data Science",
  "Tools",
  "Creative Coding",
  "Systems Programming",
];

const TAG_LABELS: Record<CourseTag, string> = {
  Beginner: "入门",
  Intermediate: "进阶",
  Advanced: "高级",
  Python: "Python",
  "Web Development": "Web 开发",
  "Data Science": "数据科学",
  Tools: "工具",
  "Creative Coding": "创意编程",
  "Systems Programming": "系统编程",
};

type ProgressFilter = "all" | "not_started" | "in_progress" | "completed";

const PROGRESS_FILTERS: { id: ProgressFilter; label: string }[] = [
  { id: "all", label: "全部" },
  { id: "not_started", label: "未开始" },
  { id: "in_progress", label: "进行中" },
  { id: "completed", label: "已完成" },
];

/**
 * 计算单门课程的完成百分比（0-100）。无练习时返回 0。
 */
function getCourseProgressPct(
  course: Course,
  statuses: Record<string, "locked" | "unlocked" | "in_progress" | "completed" | undefined>,
): number {
  const allExercises = course.chapters.flatMap((c) => c.exercises);
  if (allExercises.length === 0) return 0;
  const completed = allExercises.filter((e) => statuses[e.id] === "completed").length;
  return Math.round((completed / allExercises.length) * 100);
}

/**
 * 计算单门课程的完成状态。
 * - completed: 所有练习均已完成
 * - in_progress: 至少一个练习已完成（但未全部完成）
 * - not_started: 没有任何练习完成
 *
 * 不依赖 ensureCourseInit 的副作用：直接从 statuses 推导，
 * 保证未触发过 ensureCourseInit 的课程也能正确分类为 not_started。
 */
function getCourseProgressStatus(
  course: Course,
  statuses: Record<string, "locked" | "unlocked" | "in_progress" | "completed" | undefined>,
): Exclude<ProgressFilter, "all"> {
  const pct = getCourseProgressPct(course, statuses);
  if (pct === 0) return "not_started";
  if (pct === 100) return "completed";
  return "in_progress";
}

export default function CoursesPage() {
  const [activeTags, setActiveTags] = useState<CourseTag[]>([]);
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [progressFilter, setProgressFilter] = useState<ProgressFilter>("all");
  const [onlyBookmarked, setOnlyBookmarked] = useState(false);
  // 仅订阅 statuses，避免 progress.codeSnapshots 变化导致重渲染
  const statuses = useUserStore(useShallow((s) => s.progress.statuses));
  // 订阅 bookmarks 数组以响应收藏状态变化（派生 Set 用于 O(1) 查询）
  const bookmarks = useUserStore(useShallow((s) => s.bookmarks));
  const bookmarkedCourseIds = useMemo(
    () => new Set(bookmarks.filter((b) => b.type === "course").map((b) => b.id)),
    [bookmarks],
  );

  const toggleTag = (t: CourseTag) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const filteredCourses = useMemo(() => {
    const q = query.trim().toLowerCase();
    return courses.filter((c) => {
      // tag 过滤
      if (activeTags.length > 0 && !c.tags.some((t) => activeTags.includes(t))) return false;
      // 关键词过滤：匹配标题与描述
      if (q && !c.title.toLowerCase().includes(q) && !c.description.toLowerCase().includes(q)) {
        return false;
      }
      // 进度过滤
      if (progressFilter !== "all" && getCourseProgressStatus(c, statuses) !== progressFilter) {
        return false;
      }
      // 收藏过滤
      if (onlyBookmarked && !bookmarkedCourseIds.has(c.id)) return false;
      return true;
    });
  }, [activeTags, query, progressFilter, statuses, onlyBookmarked, bookmarkedCourseIds]);

  const journeyCourses = (name: string) => courses.filter((c) => c.learningJourney.includes(name as never));

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-14">
        <div className="text-5xl mb-4">🏔️</div>
        <h1 className="font-outfit text-4xl sm:text-5xl font-bold">
          探索 <span className="gradient-text">CodeGame 的世界</span>
        </h1>
        <p className="mt-3 text-muted max-w-2xl mx-auto">
          选择一条路径，或浏览全部 28+ 门课程。每门课程都是互动式的，免费开始，专为初学者打造。
        </p>
        {/* 入门推荐：避免自链接 /courses，引导用户进入具体的入门课程 */}
        <Link
          href="/python"
          className="inline-block mt-6 px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
        >
          开启你的编程冒险 →
        </Link>
      </div>

      {/* Learning Journeys */}
      <section className="mb-16">
        <h2 className="font-outfit text-2xl font-bold mb-5 flex items-center gap-2">
          <span>🗺️</span> 学习路径
        </h2>
        <div className="space-y-3">
          {learningJourneys.map((j) => {
            const isOpen = expandedJourney === j.name;
            const list = journeyCourses(j.name);
            return (
              <div
                key={j.name}
                className={cn(
                  "rounded-xl border bg-bg2 overflow-hidden transition-all",
                  isOpen ? "border-accent shadow-card" : "border-rule",
                )}
              >
                <button
                  onClick={() => setExpandedJourney(isOpen ? null : j.name)}
                  className="w-full flex items-center gap-4 p-4 text-left hover:bg-bg3 transition"
                >
                  <div
                    className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                    style={{ background: j.gradient }}
                  >
                    {j.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-outfit font-bold text-ink">{j.name}</div>
                    <div className="text-sm text-muted line-clamp-1">{j.description}</div>
                  </div>
                  <div className="hidden sm:flex items-center gap-4 text-xs text-muted shrink-0">
                    <span>📚 {list.length} 门课程</span>
                    <span>⏱ {list.reduce((a, c) => a + c.estimatedHours, 0)} 小时</span>
                  </div>
                  <span className={cn("text-muted transition-transform shrink-0", isOpen && "rotate-180")}>
                    ▼
                  </span>
                </button>
                {isOpen && (
                  <div className="px-4 pb-4 pt-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-slideUp">
                    {list.length === 0 ? (
                      <p className="text-sm text-muted col-span-full py-4">
                        更多课程即将加入此路径！
                      </p>
                    ) : (
                      list.map((c) => <CourseCard key={c.id} course={c} compact />)
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* All Courses */}
      <section>
        <h2 className="font-outfit text-2xl font-bold mb-5 flex items-center gap-2">
          <span>📚</span> 全部课程
        </h2>

        {/* 搜索框 */}
        <div className="relative mb-4">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted text-sm pointer-events-none">
            🔍
          </span>
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="搜索课程标题或描述…"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-bg2 border border-rule text-sm text-ink placeholder:text-muted focus:border-accent focus:outline-none transition"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted hover:text-ink text-sm px-2 py-1"
              aria-label="清除搜索"
            >
              ✕
            </button>
          )}
        </div>

        {/* 进度状态筛选 */}
        <div className="flex flex-wrap gap-2 mb-4 items-center">
          <span className="text-xs text-muted self-center mr-1">进度：</span>
          {PROGRESS_FILTERS.map((p) => (
            <button
              key={p.id}
              onClick={() => setProgressFilter(p.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                progressFilter === p.id
                  ? "border-accent3 bg-accent3/15 text-accent3"
                  : "border-rule bg-bg2 text-muted hover:text-ink hover:border-accent3/50",
              )}
            >
              {p.label}
            </button>
          ))}
          {/* 收藏筛选 toggle：与进度筛选并列，色调用 accent2（与书签按钮主色一致） */}
          <label className="ml-2 flex items-center gap-1.5 text-xs text-muted cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyBookmarked}
              onChange={(e) => setOnlyBookmarked(e.target.checked)}
              className="accent-accent2"
            />
            <span aria-hidden="true">★</span> 仅看收藏
          </label>
        </div>

        {/* 标签筛选 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-muted self-center mr-1">筛选：</span>
          {ALL_TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggleTag(t)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                activeTags.includes(t)
                  ? "border-accent bg-accent text-white"
                  : "border-rule bg-bg2 text-muted hover:text-ink hover:border-accent/50",
              )}
            >
              {TAG_LABELS[t]}
            </button>
          ))}
          {(activeTags.length > 0 || query || progressFilter !== "all" || onlyBookmarked) && (
            <button
              onClick={() => {
                setActiveTags([]);
                setQuery("");
                setProgressFilter("all");
                setOnlyBookmarked(false);
              }}
              className="px-3 py-1.5 rounded-full text-xs text-accent2 hover:underline"
            >
              清除全部
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} course={c} progressPct={getCourseProgressPct(c, statuses)} />
          ))}
        </div>
        {filteredCourses.length === 0 && (
          <div className="text-center py-16 text-muted">
            <div className="text-4xl mb-3">🔍</div>
            没有符合条件的课程。
          </div>
        )}
      </section>
    </div>
  );
}
