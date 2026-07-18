"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { computeLeaderboard, getMedalForRank, isTopTen } from "@/lib/leaderboard";
import { formatNumber } from "@/lib/utils";
import { StoreHydration } from "@/components/layout/StoreHydration";

export default function LeaderboardClient() {
  const { userId, username, avatarGradient, xpTotal, streakDays, countryFlag } = useUserStore(
    useShallow((s) => ({
      userId: s.user.id,
      username: s.user.username,
      avatarGradient: s.user.avatarGradient,
      xpTotal: s.user.xpTotal,
      streakDays: s.user.streakDays,
      countryFlag: s.user.countryFlag,
    })),
  );

  const rows = useMemo(
    () =>
      computeLeaderboard({
        id: userId,
        username,
        avatarGradient,
        xpTotal,
        streakDays,
        countryFlag,
      }),
    [userId, username, avatarGradient, xpTotal, streakDays, countryFlag],
  );

  const myRow = rows.find((r) => r.isCurrentUser);

  return (
    <StoreHydration>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* 头部 */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏆</div>
          <h1 className="font-outfit text-3xl sm:text-4xl font-bold mb-2">排行榜</h1>
          <p className="text-muted">
            与全球学习者一起进步，连续学习、完成挑战、发布作品都能获得 XP。
          </p>
        </div>

        {/* 我的排名摘要 */}
        {myRow && (
          <div className="rounded-2xl border border-accent/40 bg-accent/5 p-5 mb-6">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="text-3xl font-pixel text-accent2">#{myRow.rank}</div>
                <div>
                  <div className="text-sm text-muted">你的当前排名</div>
                  <div className="font-outfit text-lg font-bold">
                    {isTopTen(myRow.rank)
                      ? myRow.rank <= 3
                        ? "登上领奖台！🎉"
                        : "前 10 强！💪"
                      : "继续努力，向前 10 进发！"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <div className="text-muted text-xs">总 XP</div>
                  <div className="font-bold text-accent">{formatNumber(myRow.xpTotal)}</div>
                </div>
                <div>
                  <div className="text-muted text-xs">连续天数</div>
                  <div className="font-bold text-warning">🔥 {myRow.streakDays}</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 前三名领奖台（仅当用户在前 10 时突出显示） */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {rows.slice(0, 3).map((row, idx) => {
            const podiumOrder = [1, 0, 2]; // 视觉上：2nd | 1st | 3rd
            const slot = podiumOrder.indexOf(idx);
            const heights = ["h-32", "h-40", "h-28"];
            const gradients = [
              "from-gray-400 to-gray-600",
              "from-yellow-400 to-yellow-600",
              "from-orange-600 to-orange-800",
            ];
            return (
              <div key={row.id} className="flex flex-col items-center">
                <div className="text-2xl mb-1">{getMedalForRank(row.rank)}</div>
                <div
                  className={`w-12 h-12 rounded-full ring-2 ${
                    row.isCurrentUser ? "ring-accent" : "ring-rule"
                  } mb-2`}
                  style={{ background: row.avatarGradient }}
                />
                <div className="text-xs font-bold text-ink truncate max-w-full">
                  {row.username}
                </div>
                <div className="text-[10px] text-muted mb-2">
                  {formatNumber(row.xpTotal)} XP
                </div>
                <div
                  className={`w-full ${heights[slot]} rounded-t-lg bg-gradient-to-b ${gradients[slot]} flex items-start justify-center pt-2`}
                >
                  <span className="font-pixel text-2xl text-white drop-shadow">
                    {row.rank}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 完整排行榜 */}
        <div className="rounded-xl border border-rule bg-bg2 overflow-hidden">
          <div className="px-4 py-3 border-b border-rule bg-bg3">
            <h2 className="font-outfit text-sm font-bold text-ink">完整排名</h2>
          </div>
          <ul className="divide-y divide-rule">
            {rows.map((row) => (
              <li
                key={row.id}
                className={`flex items-center gap-3 px-4 py-3 ${
                  row.isCurrentUser ? "bg-accent/10" : "hover:bg-bg3/50"
                } transition`}
              >
                <div className="w-8 text-center font-pixel text-sm">
                  {getMedalForRank(row.rank) ?? (
                    <span className={isTopTen(row.rank) ? "text-accent2" : "text-muted"}>
                      {row.rank}
                    </span>
                  )}
                </div>
                <div
                  className={`w-9 h-9 rounded-full shrink-0 ring-2 ${
                    row.isCurrentUser ? "ring-accent" : "ring-transparent"
                  }`}
                  style={{ background: row.avatarGradient }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink truncate">
                      {row.username}
                    </span>
                    <span className="text-xs">{row.countryFlag}</span>
                    {row.isCurrentUser && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-accent text-white font-bold">
                        你
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-muted">
                    Lv.{row.level} · 🔥 {row.streakDays} 天
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-sm text-accent">
                    {formatNumber(row.xpTotal)}
                  </div>
                  <div className="text-[10px] text-muted">XP</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* CTA */}
        <div className="mt-6 rounded-xl border border-rule bg-bg2 p-5 text-center">
          <p className="text-sm text-muted mb-3">
            完成练习、发布作品、参与社区讨论都能获得 XP，提升你的排名。
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/courses"
              className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white text-sm font-semibold hover:shadow-glow transition"
            >
              继续学习 →
            </Link>
            <Link
              href="/daily"
              className="px-4 py-2 rounded-lg border border-rule text-ink text-sm font-semibold hover:bg-bg3 transition"
            >
              每日挑战
            </Link>
          </div>
        </div>
      </div>
    </StoreHydration>
  );
}
