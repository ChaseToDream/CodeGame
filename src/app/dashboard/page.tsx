"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { courses } from "@/data/courses";
import { badges as allBadges } from "@/data/badges";
import { XPBadge } from "@/components/game/XPBadge";
import { LevelProgressBar } from "@/components/game/LevelProgressBar";
import { StreakCounter } from "@/components/game/StreakCounter";
import { BadgeGrid } from "@/components/game/BadgeGrid";
import { levelFromXp, formatNumber } from "@/lib/utils";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthed, progress, builds, posts, ensureCourseInit } = useUserStore();

  useEffect(() => {
    if (!isAuthed || !user) {
      router.push("/login");
    }
  }, [isAuthed, user, router]);

  const xpInfo = user ? levelFromXp(user.xpTotal) : null;

  // 已开始的课程
  const startedCourses = useMemo(() => {
    if (!user) return [];
    return courses
      .map((c) => {
        const exs = c.chapters.flatMap((ch) => ch.exercises);
        const done = exs.filter((e) => progress.statuses[e.id] === "completed").length;
        const started = exs.some(
          (e) =>
            progress.statuses[e.id] === "completed" ||
            progress.statuses[e.id] === "in_progress" ||
            progress.statuses[e.id] === "unlocked",
        );
        // 第一个未完成的练习作为 continue 点
        const next = exs.find(
          (e) => progress.statuses[e.id] !== "completed",
        );
        return { course: c, done, total: exs.length, started, next };
      })
      .filter((x) => x.started)
      .slice(0, 4);
  }, [user, progress]);

  // 用户 builds
  const userBuilds = useMemo(
    () => (user ? builds.filter((b) => b.userId === user.id) : []),
    [user, builds],
  );

  // 用户 posts
  const userPosts = useMemo(
    () => (user ? posts.filter((p) => p.userId === user.id) : []),
    [user, posts],
  );

  // 徽章状态
  const badgeState = useMemo(() => {
    return allBadges.map((b) => {
      let earned = false;
      if (b.id === "bdg_first_steps" && user) {
        earned = Object.values(progress.statuses).some((s) => s === "completed");
      } else if (b.id === "bdg_streak_7") earned = (user?.streakDays ?? 0) >= 7;
      else if (b.id === "bdg_streak_30") earned = (user?.streakDays ?? 0) >= 30;
      else if (b.id === "bdg_streak_100") earned = (user?.streakDays ?? 0) >= 100;
      else if (b.id === "bdg_first_build") earned = userBuilds.some((b2) => b2.isPublished);
      else if (b.id === "bdg_first_post") earned = userPosts.length > 0;
      else if (b.id === "bdg_level_10") earned = (user?.level ?? 0) >= 10;
      return { ...b, earned };
    });
  }, [user, progress, userBuilds, userPosts]);

  if (!user || !xpInfo) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted">Loading...</div>
    );
  }

  const earnedBadges = badgeState.filter((b) => b.earned);

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
      {/* User card */}
      <div className="rounded-2xl border border-rule bg-gradient-to-br from-bg2 to-bg3 p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-5xl opacity-20">⚔️</div>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div
            className="h-20 w-20 rounded-full ring-4 ring-accent/50 shrink-0"
            style={{ background: user.avatarGradient }}
          />
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
            Edit Profile
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
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">Continue Learning</h2>
              <Link href="/courses" className="text-xs text-accent hover:text-accent2">All courses →</Link>
            </div>
            {startedCourses.length === 0 ? (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🚀</div>
                <p className="text-muted mb-3">You haven&apos;t started any courses yet.</p>
                <Link href="/courses" className="inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  Browse courses
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
                          Continue →
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
              <h2 className="font-outfit text-lg font-bold">Your Builds</h2>
              <Link href="/builds" className="text-xs text-accent hover:text-accent2">Open editor →</Link>
            </div>
            {userBuilds.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">🏗️</div>
                <p className="text-muted text-sm mb-3">No builds yet.</p>
                <Link href="/builds" className="inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  Create your first Build
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
                      <span>{b.isPublished ? "✓ Published" : "Draft"}</span>
                      <span>👁 {formatNumber(b.viewCount)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>

          {/* Community activity */}
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">Your Community Activity</h2>
            {userPosts.length === 0 ? (
              <div className="text-center py-6">
                <div className="text-3xl mb-2">💬</div>
                <p className="text-muted text-sm mb-3">You haven&apos;t posted yet.</p>
                <Link href="/community" className="inline-block px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold">
                  Visit community
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
                        ❤️ {p.likeCount} · 💬 {p.commentCount} · {p.category}
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
              <h2 className="font-outfit text-lg font-bold">Badges</h2>
              <span className="text-xs text-muted">{earnedBadges.length}/{badgeState.length}</span>
            </div>
            <BadgeGrid badges={badgeState.slice(0, 6)} />
            <Link href="#all-badges" className="block text-center text-xs text-accent mt-3 hover:text-accent2">
              View all badges →
            </Link>
          </section>

          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">Quick Stats</h2>
            <div className="space-y-3 text-sm">
              <Stat label="Total XP" value={user.xpTotal.toLocaleString()} icon="✨" />
              <Stat label="Current Level" value={`Lvl ${user.level}`} icon="🎮" />
              <Stat label="Day Streak" value={`${user.streakDays} days`} icon="🔥" />
              <Stat label="Exercises Done" value={String(Object.values(progress.statuses).filter((s) => s === "completed").length)} icon="🎯" />
              <Stat label="Builds" value={String(userBuilds.length)} icon="🏗️" />
              <Stat label="Posts" value={String(userPosts.length)} icon="💬" />
            </div>
          </section>

          <section id="all-badges" className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">All Badges</h2>
            <BadgeGrid badges={badgeState} />
          </section>
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
