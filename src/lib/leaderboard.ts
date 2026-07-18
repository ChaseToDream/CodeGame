import type { LeaderboardEntry } from "@/types";
import { leaderboardSeedUsers } from "@/data/leaderboard";
import { levelFromXp } from "@/lib/utils";

/**
 * 排行榜计算工具。
 *
 * 设计要点：
 * - 将当前用户与虚拟对手合并后按 XP 降序排序，XP 相同按 streakDays 降序，再相同按 username 升序
 * - 等级由 levelFromXp 派生，与项目其他位置（utils.ts）保持一致
 * - 当前用户标记 isCurrentUser=true，便于 UI 高亮
 * - 排名从 1 开始（人类友好），返回排名供 UI 显示奖牌 emoji
 */

export interface LeaderboardRow extends LeaderboardEntry {
  /** 1-based 排名 */
  rank: number;
}

/**
 * 计算完整排行榜（含当前用户）。
 *
 * @param currentUser 当前登录用户的部分字段（与 LeaderboardEntry 兼容）
 * @returns 按 XP 降序排序的排行榜，包含 rank 字段
 */
export function computeLeaderboard(
  currentUser: Omit<LeaderboardEntry, "level" | "isCurrentUser">,
): LeaderboardRow[] {
  // 合并虚拟对手与当前用户
  const allEntries: LeaderboardEntry[] = [
    ...leaderboardSeedUsers.map((u) => ({
      ...u,
      level: levelFromXp(u.xpTotal).level,
    })),
    {
      ...currentUser,
      level: levelFromXp(currentUser.xpTotal).level,
      isCurrentUser: true,
    },
  ];

  // 排序：XP 降序 → streakDays 降序 → username 升序（保证稳定排序）
  const sorted = allEntries.sort((a, b) => {
    if (b.xpTotal !== a.xpTotal) return b.xpTotal - a.xpTotal;
    if (b.streakDays !== a.streakDays) return b.streakDays - a.streakDays;
    return a.username.localeCompare(b.username);
  });

  // 计算 1-based 排名
  return sorted.map((entry, idx) => ({
    ...entry,
    rank: idx + 1,
  }));
}

/**
 * 根据排名返回奖牌 emoji。
 * - 1: 🥇 2: 🥈 3: 🥉
 * - 4-10: 无奖牌但属于"前 10"
 * - 其他: 无特别标记
 */
export function getMedalForRank(rank: number): string | null {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

/**
 * 判断排名是否属于"前 10"（用于 UI 强调）。
 */
export function isTopTen(rank: number): boolean {
  return rank >= 1 && rank <= 10;
}
