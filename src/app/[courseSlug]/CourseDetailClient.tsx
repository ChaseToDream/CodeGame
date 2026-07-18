"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { getCourseBySlug } from "@/data/courses";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn, DIFFICULTY_LABEL, formatNumber, getBuildIcon, timeAgo } from "@/lib/utils";
import { XPBadge } from "@/components/game/XPBadge";
import { LevelProgressBar } from "@/components/game/LevelProgressBar";
import { BookmarkButton } from "@/components/game/BookmarkButton";
import { levelFromXp } from "@/lib/utils";
import { getCheatSheet } from "@/lib/cheatsheets";
import { blogPosts } from "@/data/blog";
import { builds as seedBuilds } from "@/data/builds";

type Tab = "chapters" | "progress" | "resources";

export default function CourseDetailClient() {
  const params = useParams<{ courseSlug: string }>();
  const router = useRouter();
  const courseSlug = params.courseSlug;
  const course = getCourseBySlug(courseSlug);
  const { user, progress, ensureCourseInit, builds } = useUserStore(
    useShallow((s) => ({ user: s.user, progress: s.progress, ensureCourseInit: s.ensureCourseInit, builds: s.builds })),
  );
  const [tab, setTab] = useState<Tab>("chapters");

  // Init progress on first view（副作用应在 useEffect 中执行，而非 useMemo）
  useEffect(() => {
    if (course) ensureCourseInit(course.slug);
  }, [course, ensureCourseInit]);

  if (!course) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">未找到课程</h1>
        <p className="text-muted mb-6">我们找不到该课程。</p>
        <Link href="/courses" className="text-accent hover:text-accent2">
          ← 返回全部课程
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

  const xpInfo = levelFromXp(user.xpTotal);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-4">
        <Link href="/courses" className="hover:text-ink">课程</Link>
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
                  {DIFFICULTY_LABEL[course.difficulty] ?? course.difficulty}
                </span>
                {course.isNew && (
                  <span className="px-2 py-0.5 rounded bg-accent2 text-bg text-[10px] font-bold font-pixel">
                    新！
                  </span>
                )}
              </div>
              <p className="text-white/90 max-w-2xl">{course.description}</p>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-white/80">
                <span>👥 {(course.learnerCount / 1000).toFixed(0)}K 学习者</span>
                <span>⏱ {course.estimatedHours} 小时</span>
                <span>📚 {course.chapters.length} 章节</span>
                <span>🎯 {allExercises.length} 个练习</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress + CTA */}
      <div className="rounded-xl border border-rule bg-bg2 p-5 mb-8">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
          <div>
            <div className="text-sm text-muted">你的进度</div>
            <div className="font-outfit text-xl font-bold">
              {completedCount} / {allExercises.length} 个练习 ·{" "}
              <span className="text-accent">{pct}%</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {/* 收藏按钮：详情页头部，独立按钮场景，不阻止冒泡 */}
            <BookmarkButton type="course" id={course.id} withLabel size="md" stopPropagation={false} />
            {nextEx ? (
              <button
                onClick={() => {
                  ensureCourseInit(course.slug);
                  router.push(`/${course.slug}/${nextEx.chapterId}/${nextEx.id}`);
                }}
                className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
              >
                {completedCount === 0 ? "开始学习 →" : "继续 →"}
              </button>
            ) : (
              <span className="px-4 py-2 rounded-lg bg-success/20 text-success font-semibold">
                ✓ 课程已完成！
              </span>
            )}
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-bg3 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-accent2 transition-all duration-700"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-rule mb-6">
        {([
          ["chapters", "章节"],
          ["progress", "进度"],
          ["resources", "资源"],
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
                    const status = progress.statuses[ex.id] ?? "locked";
                    const isLocked = status === "locked";
                    const isCompleted = status === "completed";
                    const typeLabel: Record<string, string> = {
                      exercise: "练习",
                      bonus_article: "附加",
                      challenge_pack: "挑战",
                      checkpoint: "检查点",
                      final_project: "期末项目",
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
                            {typeLabel[ex.type] ?? "练习"}
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
          <div className="rounded-xl border border-rule bg-bg2 p-5">
            <h3 className="font-outfit text-lg font-bold mb-4">XP 与等级</h3>
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
            <h3 className="font-outfit text-lg font-bold mb-4">章节完成度</h3>
            <div className="space-y-3">
              {course.chapters.map((ch, i) => {
                const exs = ch.exercises;
                const done = exs.filter((e) => progress.statuses[e.id] === "completed").length;
                const p = exs.length === 0 ? 0 : Math.round((done / exs.length) * 100);
                return (
                  <div key={ch.id}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-ink">第 {i + 1} 章：{ch.title}</span>
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
        </div>
      )}

      {tab === "resources" && (
        <ResourcesPanel
          course={course}
          builds={builds}
          nextExHref={nextEx ? `/${course.slug}/${nextEx.chapterId}/${nextEx.id}` : null}
        />
      )}
    </div>
  );
}

/**
 * 资源面板：聚合课程相关的速查表、社区作品、博客文章与官方文档。
 *
 * 设计要点：
 * - 速查表按课程涉及的语言动态生成（取课程首个练习的语言作为代表）
 * - 相关作品按课程的 tags 与 learningJourney 关联匹配，从本地 store + 种子作品合并去重
 * - 相关博客按关键词粗匹配课程标题/描述
 * - 官方文档链接按语言提供权威入口
 */
function ResourcesPanel({
  course,
  builds,
  nextExHref,
}: {
  course: NonNullable<ReturnType<typeof getCourseBySlug>>;
  builds: ReturnType<typeof useUserStore.getState>["builds"];
  nextExHref: string | null;
}) {
  // 课程代表性语言：取第一个练习的语言（不同章节可能多语言，但入门练习通常反映主语言）
  const primaryLang = course.chapters[0]?.exercises[0]?.language;
  const cheatSheet = primaryLang ? getCheatSheet(primaryLang) : null;

  // 相关作品：按 tag/learningJourney 匹配，合并本地与种子去重
  const relatedBuilds = useMemo(() => {
    const seen = new Set<string>();
    const merged = [...builds, ...seedBuilds];
    const tagSet = new Set(course.tags.map((t) => t.toLowerCase()));
    const journeySet = new Set(course.learningJourney.map((j) => j.toLowerCase()));
    return merged
      .filter((b) => {
        if (seen.has(b.id)) return false;
        seen.add(b.id);
        if (!b.isPublished) return false;
        // 通过标题/描述匹配课程的 tag 或 journey 关键词
        const text = `${b.title} ${b.description}`.toLowerCase();
        return (
          tagSet.has("python") && text.includes("python") ||
          tagSet.has("web development") && (text.includes("html") || text.includes("css") || text.includes("javascript") || text.includes("web")) ||
          tagSet.has("data science") && (text.includes("data") || text.includes("sql")) ||
          journeySet.has("web development") && (text.includes("html") || text.includes("css") || text.includes("web")) ||
          journeySet.has("data science") && (text.includes("data") || text.includes("sql")) ||
          // 兜底：标题包含课程标题中的关键词
          course.title.split(/\s+/).some((w) => w.length > 3 && text.includes(w.toLowerCase()))
        );
      })
      .sort((a, b) => b.likeCount - a.likeCount)
      .slice(0, 3);
  }, [builds, course]);

  // 相关博客：按课程标题/描述关键词粗匹配
  const relatedPosts = useMemo(() => {
    const text = `${course.title} ${course.description}`.toLowerCase();
    return blogPosts
      .filter((p) => {
        const pt = `${p.title} ${p.excerpt}`.toLowerCase();
        // 至少包含课程标题中的一个关键词
        return course.title
          .toLowerCase()
          .split(/\s+/)
          .some((w) => w.length > 3 && pt.includes(w)) || pt.includes(text.split(/\s+/)[0]);
      })
      .slice(0, 3);
  }, [course]);

  return (
    <div className="space-y-6">
      {/* 速查表 */}
      {cheatSheet ? (
        <section className="rounded-xl border border-rule bg-bg2 p-5">
          <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
            <h3 className="font-outfit text-lg font-bold flex items-center gap-2">
              <span>{cheatSheet.emoji}</span> {cheatSheet.title}
            </h3>
            <a
              href={cheatSheet.docsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:text-accent2 transition"
            >
              官方文档 ↗
            </a>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cheatSheet.items.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-rule bg-bg3 p-3 hover:border-accent/50 transition"
              >
                <div className="text-xs font-bold text-accent2 uppercase tracking-wide mb-1.5">
                  {item.label}
                </div>
                <pre className="text-xs font-mono text-ink bg-codebg rounded p-2 overflow-x-auto whitespace-pre">
                  {item.code}
                </pre>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="rounded-xl border border-rule bg-bg2 p-5">
          <h3 className="font-outfit text-lg font-bold mb-3">📚 资源</h3>
          <p className="text-sm text-muted">
            本课程暂无专属速查表。你仍可在作品编辑器中通过模板开始动手实践。
          </p>
        </section>
      )}

      {/* 相关作品 */}
      <section className="rounded-xl border border-rule bg-bg2 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-outfit text-lg font-bold">🏗️ 相关作品</h3>
          <Link href="/builds" className="text-xs text-accent hover:text-accent2">
            浏览全部 →
          </Link>
        </div>
        {relatedBuilds.length === 0 ? (
          <p className="text-sm text-muted">还没有相关作品。来分享你的第一个作品吧！</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {relatedBuilds.map((b) => (
              <Link
                key={b.id}
                href={`/builds/${b.id}`}
                className="group rounded-lg border border-rule bg-bg3 p-3 hover:border-accent transition"
              >
                <div
                  className="h-14 rounded mb-2 flex items-center justify-center text-2xl"
                  style={{ background: b.thumbnailGradient }}
                >
                  {getBuildIcon(b.title)}
                </div>
                <div className="font-bold text-sm text-ink group-hover:text-accent line-clamp-1">
                  {b.title}
                </div>
                <div className="text-[10px] text-muted mt-1 flex justify-between">
                  <span>❤️ {b.likeCount}</span>
                  <span>👁 {formatNumber(b.viewCount)}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 相关博客 */}
      <section className="rounded-xl border border-rule bg-bg2 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-outfit text-lg font-bold">📝 相关文章</h3>
          <Link href="/blog" className="text-xs text-accent hover:text-accent2">
            全部博客 →
          </Link>
        </div>
        {relatedPosts.length === 0 ? (
          <p className="text-sm text-muted">暂无相关文章。</p>
        ) : (
          <div className="space-y-2">
            {relatedPosts.map((p) => (
              <Link
                key={p.id}
                href={`/blog/${p.slug}`}
                className="block p-3 rounded-lg bg-bg3 hover:border-accent border border-transparent transition"
              >
                <div className="text-sm font-medium text-ink line-clamp-1">{p.title}</div>
                <div className="text-[11px] text-muted mt-1">
                  {timeAgo(p.publishedAt)} · {p.readingMinutes} 分钟阅读
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* 帮助提示 */}
      <section className="rounded-xl border border-accent/30 bg-accent/5 p-5">
        <h3 className="font-outfit text-lg font-bold mb-2 flex items-center gap-2">
          <span>🤖</span> 需要帮助？
        </h3>
        <p className="text-sm text-muted">
          每个练习都内置了名为 Lumi 的 AI 助手。任何时候遇到困难，点击&ldquo;向 Lumi 提问&rdquo;即可获得渐进式提示。
        </p>
        {nextExHref && (
          <Link
            href={nextExHref}
            className="inline-block mt-3 px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:shadow-glow transition"
          >
            开始练习 →
          </Link>
        )}
      </section>
    </div>
  );
}
