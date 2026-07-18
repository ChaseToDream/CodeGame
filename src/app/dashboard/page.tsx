"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { courses } from "@/data/courses";
import { XPBadge } from "@/components/game/XPBadge";
import { LevelProgressBar } from "@/components/game/LevelProgressBar";
import { StreakCounter } from "@/components/game/StreakCounter";
import { BadgeGrid } from "@/components/game/BadgeGrid";
import { ActivityHeatmap } from "@/components/game/ActivityHeatmap";
import { BookmarksSection } from "@/components/game/BookmarksSection";
import { levelFromXp, formatNumber, POST_CATEGORY_LABEL } from "@/lib/utils";
import { computeBadgeStates } from "@/lib/badges";

export default function DashboardPage() {
  const { user, progress, builds, posts, ensureAllCoursesInit, activityLog } = useUserStore(
    useShallow((s) => ({ user: s.user, progress: s.progress, builds: s.builds, posts: s.posts, ensureAllCoursesInit: s.ensureAllCoursesInit, activityLog: s.activityLog })),
  );

  // 初始化所有课程的进度状态（解锁每门课的第一节），避免"继续学习"列表为空
  // 使用 ensureAllCoursesInit 单次 set 完成所有课程，避免多次触发 re-render 与 localStorage 持久化
  useEffect(() => {
    ensureAllCoursesInit();
  }, [ensureAllCoursesInit]);

  const xpInfo = levelFromXp(user.xpTotal);

  // 已开始的课程
  const startedCourses = useMemo(() => {
    return courses
      .map((c) => {
        const exs = c.chapters.flatMap((ch) => ch.exercises);
        const done = exs.filter((e) => progress.statuses[e.id] === "completed").length;
        // 仅当用户真正参与过（完成或进行中）才算"已开始"。
        // 不能把 unlocked 计入：ensureAllCoursesInit 会解锁每门课首节，
        // 若把 unlocked 视为已开始，新用户会看到所有课程都出现在"继续学习"中。
        const started = exs.some(
          (e) =>
            progress.statuses[e.id] === "completed" ||
            progress.statuses[e.id] === "in_progress",
        );
        // 第一个未完成的练习作为 continue 点
        const next = exs.find(
          (e) => progress.statuses[e.id] !== "completed",
        );
        return { course: c, done, total: exs.length, started, next };
      })
      .filter((x) => x.started)
      .slice(0, 4);
  }, [progress]);

  // 用户 builds
  const userBuilds = useMemo(
    () => builds.filter((b) => b.userId === user.id),
    [user, builds],
  );

  // 用户 posts
  const userPosts = useMemo(
    () => posts.filter((p) => p.userId === user.id),
    [user, posts],
  );

  // 徽章状态：使用共享 helper，覆盖全部 12 个徽章
  const badgeState = useMemo(
    () => computeBadgeStates({ user, progress, builds, posts }),
    [user, progress, builds, posts],
  );

  const earnedBadges = badgeState.filter((b) => b.earned);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* User card */}
      <div className="rounded-2xl border border-rule bg-gradient-to-br from-bg2 to-bg3 p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-5xl opacity-20">⚔️</div>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="relative shrink-0">
            <div
              className="h-20 w-20 rounded-full ring-4 ring-accent/50"
              style={{ background: user.avatarGradient }}
            />
            {user.character && (
              <div
                className="absolute -bottom-2 -right-2 h-11 w-11 rounded-xl flex items-center justify-center text-2xl border-2 border-bg shadow-card"
                style={{
                  background: `linear-gradient(135deg, ${user.character.skin}, ${user.character.skin}aa)`,
                }}
                title="你的像素角色"
              >
                <span className="absolute -top-2 text-base">{user.character.accessory}</span>
                <span>{user.character.hair}</span>
                <span className="absolute -bottom-1 text-base">{user.character.outfit}</span>
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-outfit text-2xl font-bold text-ink">{user.username}</h1>
              <span className="text-2xl">{user.countryFlag}</span>
            </div>
            <p className="text-sm text-muted mt-0.5">{user.bio}</p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <XPBadge xp={user.xpTotal} level={user.level} size="md" />
              <StreakCounter days={user.streakDays} lastActiveDate={user.lastActiveDate} size="md" />
            </div>
          </div>
          <Link
            href="/settings"
            className="px-4 py-2 rounded-lg border border-rule text-sm text-ink hover:border-accent transition"
          >
            编辑资料
          </Link>
        </div>
        <div className="mt-5">
          <LevelProgressBar
            currentXP={user.xpTotal}
            levelStartXP={xpInfo.levelStart}
            levelEndXP={xpInfo.levelEnd}
            level={xpInfo.level}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning */}
        <div className="lg:col-span-2 space-y-6">
          <ActivityHeatmap activityLog={activityLog} />

          {/* 快速入口：每日挑战 + 排行榜 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/daily"
              className="group rounded-xl border border-accent/30 bg-gradient-to-br from-accent/10 to-transparent p-5 hover:border-accent transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted uppercase tracking-wide mb-1">每日挑战</div>
                  <div className="font-outfit text-lg font-bold text-ink group-hover:text-accent transition">
                    今日一题
                  </div>
                  <p className="text-xs text-muted mt-1">保持节奏，累积 XP</p>
                </div>
                <span className="text-3xl">🎯</span>
              </div>
            </Link>
            <Link
              href="/leaderboard"
              className="group rounded-xl border border-accent2/30 bg-gradient-to-br from-accent2/10 to-transparent p-5 hover:border-accent2 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-xs text-muted uppercase tracking-wide mb-1">排行榜</div>
                  <div className="font-outfit text-lg font-bold text-ink group-hover:text-accent2 transition">
                    全球排名
                  </div>
                  <p className="text-xs text-muted mt-1">查看你的位置</p>
                </div>
                <span className="text-3xl">🏆</span>
              </div>
            </Link>
          </div>


          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">继续学习</h2>
              <Link href="/courses" className="text-xs text-accent hover:text-accent2">全部课程 →</Link>
            </div>
            {startedCourses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🚀</div>
                <p className="text-muted mb-3">你还没有开始任何课程。</p>
                <Link href="/courses" className="inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  浏览课程
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {startedCourses.map(({ course, done, total, next }) => {
                  const p = total === 0 ? 0 : Math.round((done / total) * 100);
                  return (
                    <div key={course.id} className="flex items-center gap-4 p-3 rounded-lg bg-bg3">
                      <div
                        className="h-12 w-12 rounded-lg flex items-center justify-center text-2xl shrink-0"
                        style={{ background: course.bannerGradient }}
                      >
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink text-sm">{course.title}</span>
                          <span className="text-xs text-muted">{done}/{total} · {p}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg2 overflow-hidden mt-1.5">
                          <div className="h-full bg-gradient-to-r from-accent to-accent2" style={{ width: `${p}%` }} />
                        </div>
                      </div>
                      {next && (
                        <Link
                          href={`/${course.slug}/${next.chapterId}/${next.id}`}
                          className="px-3 py-1.5 rounded text-xs font-semibold bg-accent text-white hover:shadow-glow transition shrink-0"
                        >
                          继续 →
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Your builds */}
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">你的作品</h2>
              <Link href="/builds" className="text-xs text-accent hover:text-accent2">打开编辑器 →</Link>
            </div>
            {userBuilds.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">🏗️</div>
                <p className="text-muted text-sm mb-3">还没有作品。</p>
                <Link href="/builds" className="inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  创建你的第一个作品
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userBuilds.map((b) => (
                  <Link
                    key={b.id}
                    href={`/builds/${b.id}`}
                    className="rounded-lg border border-rule bg-bg3 p-3 hover:border-accent transition"
                  >
                    <div className="h-16 rounded mb-2 flex items-center justify-center text-2xl" style={{ background: b.thumbnailGradient }}>
                      🏗️
                    </div>
                    <div className="font-bold text-sm text-ink line-clamp-1">{b.title}</div>
                    <div className="text-[10px] text-muted mt-1 flex justify-between">
                      <span>{b.isPublished ? "✓ 已发布" : "草稿"}</span>
                      <span>👁 {formatNumber(b.viewCount)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Community activity */}
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">你的社区动态</h2>
            {userPosts.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-muted text-sm mb-3">你还没有发帖。</p>
                <Link href="/community" className="inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  访问社区
                </Link>
              </div>
            ) : (
              <ul className="space-y-2">
                {userPosts.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/community/${p.category}/${p.id}`}
                      className="block p-3 rounded-lg bg-bg3 hover:border-accent border border-transparent transition"
                    >
                      <div className="text-sm font-medium text-ink line-clamp-1">{p.title}</div>
                      <div className="text-[11px] text-muted mt-1">
                        ❤️ {p.likeCount} · 💬 {p.commentCount} · {POST_CATEGORY_LABEL[p.category] ?? p.category}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right column: badges + stats */}
        <div className="space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">徽章</h2>
              <span className="text-xs text-muted">{earnedBadges.length}/{badgeState.length}</span>
            </div>
            <BadgeGrid badges={badgeState.slice(0, 6)} />
            <Link href="#all-badges" className="block text-center text-xs text-accent mt-3 hover:text-accent2">
              查看全部徽章 →
            </Link>
          </section>

          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">快速统计</h2>
            <div className="space-y-3 text-sm">
              <Stat label="总 XP" value={user.xpTotal.toLocaleString()} icon="✨" />
              <Stat label="当前等级" value={`Lvl ${user.level}`} icon="🎮" />
              <Stat label="连续学习天数" value={`${user.streakDays} 天`} icon="🔥" />
              <Stat label="已完成练习数" value={String(Object.values(progress.statuses).filter((s) => s === "completed").length)} icon="🎯" />
              <Stat label="作品" value={String(userBuilds.length)} icon="🏗️" />
              <Stat label="帖子" value={String(userPosts.length)} icon="💬" />
            </div>
          </section>

          <section id="all-badges" className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">全部徽章</h2>
            <BadgeGrid badges={badgeState} />
          </section>

          {/* 我的收藏：跨课程/作品/帖子/博客的统一收藏夹 */}
          <BookmarksSection />
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted flex items-center gap-2">
        <span>{icon}</span> {label}
      </span>
      <span className="font-bold text-ink font-pixel">{value}</span>
    </div>
  );
}
