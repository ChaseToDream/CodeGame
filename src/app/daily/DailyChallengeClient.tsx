"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { getDailyChallenge, getTimeUntilNextChallenge } from "@/lib/daily-challenge";
import { StoreHydration } from "@/components/layout/StoreHydration";

export default function DailyChallengeClient() {
  const { progress, completeExercise } = useUserStore(
    useShallow((s) => ({
      progress: s.progress,
      completeExercise: s.completeExercise,
    })),
  );

  const challenge = useMemo(() => getDailyChallenge(), []);
  const [timeLeft, setTimeLeft] = useState("");
  const [now, setNow] = useState(() => Date.now());

  // 每分钟刷新倒计时
  useEffect(() => {
    setTimeLeft(getTimeUntilNextChallenge());
    const timer = setInterval(() => {
      setTimeLeft(getTimeUntilNextChallenge());
      setNow(Date.now());
    }, 60_000);
    return () => clearInterval(timer);
  }, []);

  if (!challenge) {
    return (
      <StoreHydration>
        <div className="mx-auto max-w-3xl px-4 py-20 text-center">
          <div className="text-5xl mb-4">🌙</div>
          <h1 className="font-outfit text-2xl font-bold mb-2">暂无可用的每日挑战</h1>
          <p className="text-muted mb-6">题库暂时没有可执行的练习，请稍后再来。</p>
          <Link href="/courses" className="text-accent hover:text-accent2">
            ← 浏览全部课程
          </Link>
        </div>
      </StoreHydration>
    );
  }

  const { course, exercise, dayKey } = challenge;
  const isCompleted = progress.statuses[exercise.id] === "completed";

  // 计算今日是否已访问（用于 UI 强调"已完成今日挑战"）
  const todayLabel = new Date(dayKey).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });

  // 屏蔽未使用的 now 变量，仅用于触发重渲染
  void now;

  return (
    <StoreHydration>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🎯</div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold mb-2">每日挑战</h1>
          <p className="text-muted">
            {todayLabel}（UTC）· 每天 1 题，保持学习节奏
          </p>
        </div>

        {/* 倒计时 */}
        <div className="rounded-xl border border-accent/30 bg-accent/5 p-4 mb-6 text-center">
          <div className="text-xs text-muted uppercase tracking-wide mb-1">
            距离明日挑战刷新
          </div>
          <div className="font-pixel text-2xl text-accent2">{timeLeft}</div>
        </div>

        {/* 挑战卡片 */}
        <div className="rounded-2xl border border-rule bg-bg2 overflow-hidden">
          {/* 课程标识 */}
          <div
            className="h-2"
            style={{ background: course.bannerGradient }}
          />
          <div className="p-6">
            <div className="flex items-start gap-4 mb-4">
              <div className="text-4xl shrink-0">{course.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="text-xs text-muted mb-1">
                  {course.title} · +{exercise.xpReward} XP
                </div>
                <h2 className="font-outfit text-xl font-bold text-ink mb-1">
                  {exercise.title}
                </h2>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wide bg-bg3 text-muted">
                    {exercise.language}
                  </span>
                  {isCompleted && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-success/20 text-success">
                      ✓ 已完成
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* 状态卡片 */}
            {isCompleted ? (
              <div className="rounded-lg border border-success/40 bg-success/10 p-5 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <div className="font-outfit text-lg font-bold text-success mb-1">
                  今日挑战已完成！
                </div>
                <p className="text-sm text-muted">
                  明天再来挑战新题目，保持你的连续学习记录。
                </p>
              </div>
            ) : (
              <div className="rounded-lg border border-accent/30 bg-accent/5 p-5">
                <p className="text-sm text-ink mb-4">
                  准备好挑战今日的练习了吗？完成可获得{" "}
                  <span className="font-bold text-accent">+{exercise.xpReward} XP</span> 奖励。
                </p>
                <Link
                  href={`/${course.slug}/${exercise.chapterId}/${exercise.id}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
                >
                  <span>开始挑战</span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                    <path d="M6 3l5 5-5 5V3z" />
                  </svg>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* 鼓励信息 */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="rounded-xl border border-rule bg-bg2 p-4 text-center">
            <div className="text-2xl mb-1">📅</div>
            <div className="text-xs text-muted">每日一题</div>
            <div className="text-sm font-bold text-ink">保持节奏</div>
          </div>
          <div className="rounded-xl border border-rule bg-bg2 p-4 text-center">
            <div className="text-2xl mb-1">🔥</div>
            <div className="text-xs text-muted">连续学习</div>
            <div className="text-sm font-bold text-ink">积累天数</div>
          </div>
          <div className="rounded-xl border border-rule bg-bg2 p-4 text-center">
            <div className="text-2xl mb-1">⭐</div>
            <div className="text-xs text-muted">XP 奖励</div>
            <div className="text-sm font-bold text-ink">提升等级</div>
          </div>
        </div>

        {/* 底部 CTA */}
        <div className="mt-6 text-center">
          <Link
            href="/leaderboard"
            className="inline-block text-sm text-accent hover:text-accent2 transition"
          >
            查看排行榜 →
          </Link>
        </div>
      </div>
    </StoreHydration>
  );
}
