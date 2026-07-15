"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { courses, getCourseBySlug } from "@/data/courses";
import { useUserStore } from "@/stores/user-store";
import { cn } from "@/lib/utils";
import { XPBadge } from "@/components/game/XPBadge";
import { LevelProgressBar } from "@/components/game/LevelProgressBar";
import { levelFromXp } from "@/lib/utils";

type Tab = "chapters" | "progress" | "resources";

export default function CourseDetailPage() {
  const params = useParams<{ courseSlug: string }>();
  const router = useRouter();
  const courseSlug = params.courseSlug;
  const course = getCourseBySlug(courseSlug);
  const { user, isAuthed, progress, ensureCourseInit } = useUserStore();
  const [tab, setTab] = useState<Tab>("chapters");

  // Init progress on first view
  useMemo(() => {
    if (course && isAuthed) ensureCourseInit(course.slug);
  }, [course, isAuthed, ensureCourseInit]);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">Course not found</h1>
        <p className="text-muted mb-6">We couldn&apos;t find that course.</p>
        <Link href="/courses" className="text-accent hover:text-accent2">
          ← Back to all courses
        </Link>
      </div>
    );
  }

  const allExercises = course.chapters.flatMap((c) => c.exercises);
  const completedCount = allExercises.filter(
    (e) => progress.statuses[e.id] === "completed",
  ).length;
  const pct = allExercises.length === 0 ? 0 : Math.round((completedCount / allExercises.length) * 100);

  const findNextExercise = () => {
    for (const ch of course.chapters) {
      for (const ex of ch.exercises) {
        const s = progress.statuses[ex.id];
        if (s === "unlocked" || s === "in_progress" || s === undefined) return ex;
      }
    }
    return null;
  };
  const nextEx = findNextExercise();

  const xpInfo = user ? levelFromXp(user.xpTotal) : null;

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-4">
        <Link href="/courses" className="hover:text-ink">Courses</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{course.title}</span>
      </nav>

      {/* Course header */}
      <div
        className="rounded-2xl overflow-hidden border border-rule mb-8 relative"
        style={{ background: course.bannerGradient }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative p-8 sm:p-10">
          <div className="flex items-start gap-4">
            <div className="text-6xl drop-shadow-lg">{course.icon}</div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <h1 className="font-outfit text-3xl sm:text-4xl font-bold text-white drop-shadow">
                  {course.title}
                </h1>
                <span
                  className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide",
                    course.difficulty === "beginner"
                      ? "bg-success text-bg"
                      : "bg-warning text-bg",
                  )}
                >
                  {course.difficulty}
                </span>
                {course.isNew && (
                  <span className="px-2 py-0.5 rounded bg-accent2 text-bg text-[10px] font-bold font-pixel">
                    NEW!
                  </span>
                )}
              </div>
              <p className="text-white/90 max-w-2xl">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80">
                <span>👥 {(course.learnerCount / 1000).toFixed(0)}K learners</span>
                <span>⏱ {course.estimatedHours}h</span>
                <span>📚 {course.chapters.length} chapters</span>
                <span>🎯 {allExercises.length} exercises</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress + CTA */}
      {isAuthed && user && (
        <div className="rounded-xl border border-rule bg-bg2 p-5 mb-8">
          <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
            <div>
              <div className="text-sm text-muted">Your progress</div>
              <div className="font-outfit text-xl font-bold">
                {completedCount} / {allExercises.length} exercises ·{" "}
                <span className="text-accent">{pct}%</span>
              </div>
            </div>
            {nextEx ? (
              <button
                onClick={() => {
                  ensureCourseInit(course.slug);
                  router.push(`/${course.slug}/${nextEx.chapterId}/${nextEx.id}`);
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
              >
                {completedCount === 0 ? "Start learning →" : "Continue →"}
              </button>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-success/20 text-success font-semibold">
                ✓ Course complete!
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
      )}

      {!isAuthed && (
        <div className="rounded-xl border border-accent/40 bg-accent/5 p-5 mb-8 text-center">
          <p className="text-ink">
            <Link href="/signup" className="text-accent font-semibold hover:underline">
              Sign up free
            </Link>{" "}
            to save your progress and earn XP. You can preview exercises without an account.
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 border-b border-rule mb-6">
        {([
          ["chapters", "Chapters"],
          ["progress", "Progress"],
          ["resources", "Resources"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition",
              tab === key
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {tab === "chapters" && (
        <div className="space-y-4">
          {course.chapters.map((ch, idx) => {
            const chExercises = ch.exercises;
            const chCompleted = chExercises.filter(
              (e) => progress.statuses[e.id] === "completed",
            ).length;
            const chPct =
              chExercises.length === 0
                ? 0
                : Math.round((chCompleted / chExercises.length) * 100);
            return (
              <div key={ch.id} className="rounded-xl border border-rule bg-bg2 overflow-hidden">
                <div className="p-5 border-b border-rule">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <h3 className="font-outfit text-lg font-bold flex items-center gap-2">
                      <span className="text-accent2 font-pixel">{idx + 1}</span>
                      {ch.title}
                    </h3>
                    <span className="text-xs text-muted">
                      {chCompleted}/{chExercises.length} · {chPct}%
                    </span>
                  </div>
                  {ch.description && (
                    <p className="text-sm text-muted mt-1">{ch.description}</p>
                  )}
                  <div className="h-1.5 rounded-full bg-bg3 overflow-hidden mt-3">
                    <div
                      className="h-full bg-gradient-to-r from-accent to-accent3 transition-all"
                      style={{ width: `${chPct}%` }}
                    />
                  </div>
                </div>
                <ul>
                  {chExercises.map((ex) => {
                    const status = progress.statuses[ex.id] ?? (isAuthed ? "locked" : "unlocked");
                    const isLocked = status === "locked";
                    const isCompleted = status === "completed";
                    const typeLabel: Record<string, string> = {
                      exercise: "Exercise",
                      bonus_article: "Bonus",
                      challenge_pack: "Challenge",
                      checkpoint: "Checkpoint",
                      final_project: "Final Project",
                    };
                    return (
                      <li key={ex.id}>
                        <Link
                          href={`/${course.slug}/${ch.id}/${ex.id}`}
                          className={cn(
                            "flex items-center gap-3 px-5 py-3 hover:bg-bg3 transition border-l-2",
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
                              "w-6 h-6 rounded flex items-center justify-center text-xs shrink-0",
                              isCompleted
                                ? "bg-success text-bg"
                                : isLocked
                                  ? "bg-bg3 text-muted"
                                  : "bg-accent/20 text-accent",
                            )}
                          >
                            {isCompleted ? "✓" : isLocked ? "🔒" : "▶"}
                          </span>
                          <span className="flex-1 text-sm text-ink">{ex.title}</span>
                          <span className="text-[10px] text-muted uppercase tracking-wide">
                            {typeLabel[ex.type] ?? "Exercise"}
                          </span>
                          <span className="text-xs text-accent2 font-pixel">+{ex.xpReward} XP</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
        </div>
      )}

      {tab === "progress" && (
        <div className="space-y-6">
          {isAuthed && user && xpInfo ? (
            <>
              <div className="rounded-xl border border-rule bg-bg2 p-5">
                <h3 className="font-outfit text-lg font-bold mb-4">XP & Level</h3>
                <XPBadge xp={user.xpTotal} level={user.level} size="lg" />
                <div className="mt-4">
                  <LevelProgressBar
                    currentXP={user.xpTotal}
                    levelStartXP={xpInfo.levelStart}
                    levelEndXP={xpInfo.levelEnd}
                    level={xpInfo.level}
                  />
                </div>
              </div>
              <div className="rounded-xl border border-rule bg-bg2 p-5">
                <h3 className="font-outfit text-lg font-bold mb-4">Chapter Completion</h3>
                <div className="space-y-3">
                  {course.chapters.map((ch, i) => {
                    const exs = ch.exercises;
                    const done = exs.filter((e) => progress.statuses[e.id] === "completed").length;
                    const p = exs.length === 0 ? 0 : Math.round((done / exs.length) * 100);
                    return (
                      <div key={ch.id}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-ink">Ch {i + 1}: {ch.title}</span>
                          <span className="text-muted">{done}/{exs.length}</span>
                        </div>
                        <div className="h-2 rounded-full bg-bg3 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${p}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-muted">
              <Link href="/login" className="text-accent hover:underline">Log in</Link> to track your progress.
            </div>
          )}
        </div>
      )}

      {tab === "resources" && (
        <div className="space-y-4">
          <div className="rounded-xl border border-rule bg-bg2 p-5">
            <h3 className="font-outfit text-lg font-bold mb-3">📚 Resources</h3>
            <ul className="space-y-2 text-sm text-muted">
              <li>• Cheat sheet for {course.title} (coming soon)</li>
              <li>• Official documentation & community links</li>
              <li>• Project templates in the Builds editor</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rule bg-bg2 p-5">
            <h3 className="font-outfit text-lg font-bold mb-3">🤖 Need help?</h3>
            <p className="text-sm text-muted">
              Every exercise has a built-in AI assistant named Lumi. Click &quot;Ask Lumi&quot; anytime you&apos;re stuck.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
