"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getCourseBySlug } from "@/data/courses";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<string, string> = {
  exercise: "练习",
  bonus_article: "附加",
  challenge_pack: "挑战",
  checkpoint: "检查点",
  final_project: "期末项目",
};

export default function ChapterClient() {
  const params = useParams<{ courseSlug: string; chapterId: string }>();
  const { courseSlug, chapterId } = params;
  const course = getCourseBySlug(courseSlug);

  const { progress, ensureCourseInit } = useUserStore(
    useShallow((s) => ({ progress: s.progress, ensureCourseInit: s.ensureCourseInit })),
  );

  // 进入章节页时确保课程进度已初始化（解锁第一章第一节）
  useEffect(() => {
    if (course) ensureCourseInit(course.slug);
  }, [course, ensureCourseInit]);

  const found = useMemo(() => {
    if (!course) return undefined;
    const chapter = course.chapters.find((c) => c.id === chapterId);
    if (!chapter) return undefined;
    const chapterIndex = course.chapters.findIndex((c) => c.id === chapterId);
    return { course, chapter, chapterIndex };
  }, [course, chapterId]);

  if (!course || !found) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">未找到章节</h1>
        <p className="text-muted mb-6">我们找不到该章节。</p>
        <Link href="/courses" className="text-accent hover:text-accent2">
          ← 返回全部课程
        </Link>
      </div>
    );
  }

  const { chapter, chapterIndex } = found;
  const exercises = chapter.exercises;
  const completedCount = exercises.filter(
    (e) => progress.statuses[e.id] === "completed",
  ).length;
  const pct =
    exercises.length === 0
      ? 0
      : Math.round((completedCount / exercises.length) * 100);

  // 第一个未完成的练习作为"继续学习"入口
  const nextEx = exercises.find((e) => progress.statuses[e.id] !== "completed");
  // 上一章 / 下一章
  const prevChapter = chapterIndex > 0 ? course.chapters[chapterIndex - 1] : null;
  const nextChapter =
    chapterIndex < course.chapters.length - 1
      ? course.chapters[chapterIndex + 1]
      : null;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-4">
        <Link href="/courses" className="hover:text-ink">课程</Link>
        <span className="mx-2">/</span>
        <Link href={`/${course.slug}`} className="hover:text-ink">{course.title}</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">第 {chapterIndex + 1} 章</span>
      </nav>

      {/* Chapter header */}
      <div className="rounded-2xl border border-rule bg-gradient-to-br from-bg2 to-bg3 p-6 sm:p-8 mb-6 relative overflow-hidden">
        <div className="absolute top-3 right-4 text-5xl opacity-20">📖</div>
        <div className="relative">
          <div className="text-xs uppercase tracking-widest text-accent2 font-bold mb-2">
            第 {chapterIndex + 1} 章 / 共 {course.chapters.length} 章
          </div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-ink mb-2">
            {chapter.title}
          </h1>
          {chapter.description && (
            <p className="text-muted max-w-2xl">{chapter.description}</p>
          )}
          <div className="mt-4 flex items-center gap-4 text-sm text-muted flex-wrap">
            <span>🎯 {exercises.length} 个练习</span>
            <span>✓ {completedCount} 已完成</span>
            <span className="text-accent2 font-pixel">{pct}%</span>
          </div>
        </div>
      </div>

      {/* Progress + CTA */}
      <div className="rounded-xl border border-rule bg-bg2 p-5 mb-6">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div className="text-sm text-muted">本章进度</div>
          {nextEx ? (
            <Link
              href={`/${course.slug}/${chapter.id}/${nextEx.id}`}
              className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
            >
              {completedCount === 0 ? "开始本章 →" : "继续 →"}
            </Link>
          ) : (
            <span className="px-4 py-2 rounded-lg bg-success/20 text-success font-semibold">
              ✓ 本章已完成！
            </span>
          )}
        </div>
        <div className="h-2.5 rounded-full bg-bg3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Exercise list */}
      <div className="rounded-xl border border-rule bg-bg2 overflow-hidden mb-8">
        <ul>
          {exercises.map((ex, idx) => {
            const status = progress.statuses[ex.id] ?? "locked";
            const isLocked = status === "locked";
            const isCompleted = status === "completed";
            return (
              <li key={ex.id}>
                <Link
                  href={`/${course.slug}/${chapter.id}/${ex.id}`}
                  className={cn(
                    "flex items-center gap-3 px-5 py-4 hover:bg-bg3 transition border-l-2",
                    isLocked
                      ? "border-transparent opacity-50 cursor-not-allowed"
                      : "border-transparent hover:border-accent",
                  )}
                  onClick={(e) => {
                    if (isLocked) e.preventDefault();
                  }}
                >
                  <span
                    className={cn(
                      "w-7 h-7 rounded flex items-center justify-center text-xs shrink-0",
                      isCompleted
                        ? "bg-success text-bg"
                        : isLocked
                          ? "bg-bg3 text-muted"
                          : "bg-accent/20 text-accent",
                    )}
                  >
                    {isCompleted ? "✓" : isLocked ? "🔒" : idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-ink">{ex.title}</div>
                    <div className="text-[10px] text-muted uppercase tracking-wide mt-0.5">
                      {TYPE_LABEL[ex.type] ?? "练习"}
                    </div>
                  </div>
                  <span className="text-xs text-accent2 font-pixel shrink-0">
                    +{ex.xpReward} XP
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Chapter navigation */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {prevChapter ? (
          <Link
            href={`/${course.slug}/${prevChapter.id}`}
            className="flex-1 min-w-[200px] rounded-lg border border-rule bg-bg2 p-4 hover:border-accent transition group"
          >
            <div className="text-[10px] text-muted uppercase tracking-wide mb-1">← 上一章</div>
            <div className="font-bold text-ink text-sm group-hover:text-accent transition">
              {prevChapter.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1 min-w-[200px]" />
        )}
        <Link
          href={`/${course.slug}`}
          className="px-4 py-2 rounded-lg text-sm text-muted hover:text-ink transition"
        >
          课程目录
        </Link>
        {nextChapter ? (
          <Link
            href={`/${course.slug}/${nextChapter.id}`}
            className="flex-1 min-w-[200px] rounded-lg border border-rule bg-bg2 p-4 hover:border-accent transition group text-right"
          >
            <div className="text-[10px] text-muted uppercase tracking-wide mb-1">下一章 →</div>
            <div className="font-bold text-ink text-sm group-hover:text-accent transition">
              {nextChapter.title}
            </div>
          </Link>
        ) : (
          <div className="flex-1 min-w-[200px]" />
        )}
      </div>
    </div>
  );
}
