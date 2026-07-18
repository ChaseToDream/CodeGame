"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { courses } from "@/data/courses";
import { learningJourneys } from "@/data/journeys";
import { CourseCard } from "@/components/course/CourseCard";
import { cn } from "@/lib/utils";
import type { CourseTag } from "@/types";

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

export default function CoursesPage() {
  const [activeTags, setActiveTags] = useState<CourseTag[]>([]);
  const [expandedJourney, setExpandedJourney] = useState<string | null>(null);

  const toggleTag = (t: CourseTag) => {
    setActiveTags((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));
  };

  const filteredCourses = useMemo(() => {
    if (activeTags.length === 0) return courses;
    return courses.filter((c) => c.tags.some((t) => activeTags.includes(t)));
  }, [activeTags]);

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

        {/* Tag filter */}
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
          {activeTags.length > 0 && (
            <button
              onClick={() => setActiveTags([])}
              className="px-3 py-1.5 rounded-full text-xs text-accent2 hover:underline"
            >
              清除全部
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCourses.map((c) => (
            <CourseCard key={c.id} course={c} />
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
