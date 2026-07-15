"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { courses } from "@/data/courses";
import { badges as allBadges } from "@/data/badges";
import { XPBadge } from "@/components/game/XPBadge";
import { LevelProgressBar } from "@/components/game/LevelProgressBar";
import { BadgeGrid } from "@/components/game/BadgeGrid";
import { levelFromXp, formatNumber, timeAgo } from "@/lib/utils";

export default function UserProfilePage() {
  const params = useParams<{ username: string }>();
  const username = decodeURIComponent(params?.username ?? "");

  const { user, isAuthed, progress, builds, posts } = useUserStore();

  // 当前 mock 只有一个本地用户；如果路径上的 username 与当前用户一致，展示数据；否则给出 not-found
  const isOwner = isAuthed && user?.username === username;

  // 用户 builds / posts
  const userBuilds = useMemo(
    () => (user ? builds.filter((b) => b.userId === user.id) : []),
    [user, builds],
  );
  const userPosts = useMemo(
    () => (user ? posts.filter((p) => p.userId === user.id) : []),
    [user, posts],
  );

  // 已完成练习数
  const completedCount = useMemo(
    () => Object.values(progress.statuses).filter((s) => s === "completed").length,
    [progress],
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

  // 学习中的课程
  const startedCourses = useMemo(() => {
    if (!user) return [];
    return courses
      .map((c) => {
        const exs = c.chapters.flatMap((ch) => ch.exercises);
        const done = exs.filter((e) => progress.statuses[e.id] === "completed").length;
        const started = exs.some(
          (e) => progress.statuses[e.id] === "completed" || progress.statuses[e.id] === "in_progress",
        );
        return { course: c, done, total: exs.length, started };
      })
      .filter((x) => x.started)
      .slice(0, 6);
  }, [user, progress]);

  if (!isOwner || !user) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔍</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">User not found</h1>
        <p className="text-muted mb-6">
          {`We couldn't find @${username || "username"}. This clone only stores the local logged-in user.`}
        </p>
        <Link href="/community" className="px-5 py-2.5 rounded-lg bg-accent text-white font-semibold inline-block">
          Browse community
        </Link>
      </div>
    );
  }

  const xpInfo = levelFromXp(user.xpTotal);
  const earnedBadges = badgeState.filter((b) => b.earned);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
      {/* Profile header */}
      <div className="rounded-2xl border border-rule bg-gradient-to-br from-bg2 to-bg3 p-6 sm:p-8 mb-8 relative overflow-hidden">
        <div className="absolute top-4 right-4 text-6xl opacity-15 select-none">🛡️</div>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div
            className="h-24 w-24 rounded-full ring-4 ring-accent/50 shrink-0"
            style={{ background: user.avatarGradient }}
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="font-outfit text-3xl font-bold">
                <span className="text-muted">@</span>
                {user.username}
              </h1>
              <span className="text-2xl">{user.countryFlag}</span>
              <span className="px-2 py-0.5 rounded-md bg-bg3 border border-rule text-[10px] uppercase tracking-wider text-accent3">
                {user.role}
              </span>
            </div>
            <p className="text-muted mt-1.5">{user.bio}</p>
            <div className="mt-3 flex items-center gap-3 flex-wrap">
              <XPBadge xp={user.xpTotal} level={user.level} size="md" />
              <span className="text-xs text-muted">
                🔥 {user.streakDays}d streak · joined {timeAgo(user.createdAt)}
              </span>
            </div>
          </div>
          {isOwner && (
            <Link
              href="/settings"
              className="px-4 py-2 rounded-lg border border-rule text-sm text-ink hover:border-accent transition"
            >
              Edit Profile
            </Link>
          )}
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

      {/* Quick stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        <StatCard label="Total XP" value={formatNumber(user.xpTotal)} icon="✨" />
        <StatCard label="Level" value={`Lv ${user.level}`} icon="🎮" />
        <StatCard label="Exercises" value={String(completedCount)} icon="🎯" />
        <StatCard label="Badges" value={`${earnedBadges.length}/${badgeState.length}`} icon="🏅" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: learning + builds + posts */}
        <div className="lg:col-span-2 space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">Learning Journey</h2>
            {startedCourses.length === 0 ? (
              <p className="text-muted text-sm">No courses started yet.</p>
            ) : (
              <div className="space-y-3">
                {startedCourses.map(({ course, done, total }) => {
                  const p = total === 0 ? 0 : Math.round((done / total) * 100);
                  return (
                    <Link
                      key={course.id}
                      href={`/${course.slug}`}
                      className="flex items-center gap-3 p-3 rounded-lg bg-bg3 hover:border-accent border border-transparent transition"
                    >
                      <div
                        className="h-10 w-10 rounded-lg flex items-center justify-center text-xl shrink-0"
                        style={{ background: course.bannerGradient }}
                      >
                        {course.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-ink text-sm">{course.title}</span>
                          <span className="text-xs text-muted">{done}/{total}</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-bg2 overflow-hidden mt-1.5">
                          <div
                            className="h-full bg-gradient-to-r from-accent to-accent2"
                            style={{ width: `${p}%` }}
                          />
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">Builds</h2>
              <span className="text-xs text-muted">{userBuilds.length} total</span>
            </div>
            {userBuilds.length === 0 ? (
              <p className="text-muted text-sm">No builds yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {userBuilds.slice(0, 4).map((b) => (
                  <Link
                    key={b.id}
                    href={`/builds/${b.id}`}
                    className="rounded-lg border border-rule bg-bg3 p-3 hover:border-accent transition"
                  >
                    <div
                      className="h-14 rounded mb-2 flex items-center justify-center text-xl"
                      style={{ background: b.thumbnailGradient }}
                    >
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

          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">Community Posts</h2>
              <span className="text-xs text-muted">{userPosts.length} total</span>
            </div>
            {userPosts.length === 0 ? (
              <p className="text-muted text-sm">No posts yet.</p>
            ) : (
              <ul className="space-y-2">
                {userPosts.slice(0, 5).map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/community/${p.category}/${p.id}`}
                      className="block p-3 rounded-lg bg-bg3 hover:border-accent border border-transparent transition"
                    >
                      <div className="text-sm font-medium text-ink line-clamp-1">{p.title}</div>
                      <div className="text-[11px] text-muted mt-1">
                        ❤️ {p.likeCount} · 💬 {p.commentCount} · {timeAgo(p.createdAt)}
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Right: badges */}
        <div className="space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-outfit text-lg font-bold">Badges</h2>
              <span className="text-xs text-muted">{earnedBadges.length}/{badgeState.length}</span>
            </div>
            <BadgeGrid badges={badgeState} />
          </section>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon }: { label: string; value: string; icon: string }) {
  return (
    <div className="rounded-xl border border-rule bg-bg2 p-4 text-center">
      <div className="text-2xl mb-1">{icon}</div>
      <div className="font-pixel text-xl text-accent">{value}</div>
      <div className="text-[10px] uppercase tracking-wider text-muted mt-1">{label}</div>
    </div>
  );
}
