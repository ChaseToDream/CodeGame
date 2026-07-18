import { describe, it, expect } from "vitest";
import {
  computeLeaderboard,
  getMedalForRank,
  isTopTen,
} from "./leaderboard";
import { leaderboardSeedUsers } from "@/data/leaderboard";

describe("computeLeaderboard", () => {
  it("包含所有种子用户 + 当前用户（共 13 条）", () => {
    const rows = computeLeaderboard({
      id: "u_local",
      username: "玩家",
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: 0,
      streakDays: 0,
      countryFlag: "🏳️",
    });
    expect(rows).toHaveLength(leaderboardSeedUsers.length + 1);
  });

  it("按 XP 降序排序", () => {
    const rows = computeLeaderboard({
      id: "u_local",
      username: "玩家",
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: 100,
      streakDays: 0,
      countryFlag: "🏳️",
    });
    for (let i = 1; i < rows.length; i++) {
      // XP 降序：前一个 >= 后一个
      expect(rows[i - 1].xpTotal).toBeGreaterThanOrEqual(rows[i].xpTotal);
    }
  });

  it("rank 从 1 开始且连续", () => {
    const rows = computeLeaderboard({
      id: "u_local",
      username: "玩家",
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: 500,
      streakDays: 0,
      countryFlag: "🏳️",
    });
    expect(rows[0].rank).toBe(1);
    for (let i = 0; i < rows.length; i++) {
      expect(rows[i].rank).toBe(i + 1);
    }
  });

  it("当前用户被标记 isCurrentUser=true", () => {
    const rows = computeLeaderboard({
      id: "u_local",
      username: "玩家",
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: 0,
      streakDays: 0,
      countryFlag: "🏳️",
    });
    const me = rows.find((r) => r.isCurrentUser);
    expect(me).toBeDefined();
    expect(me?.id).toBe("u_local");
  });

  it("等级由 XP 派生（xpTotal=0 → level=1）", () => {
    const rows = computeLeaderboard({
      id: "u_local",
      username: "玩家",
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: 0,
      streakDays: 0,
      countryFlag: "🏳️",
    });
    const me = rows.find((r) => r.isCurrentUser);
    expect(me?.level).toBe(1);
  });

  it("XP 最高者排名第一", () => {
    const rows = computeLeaderboard({
      id: "u_local",
      username: "玩家",
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: 0,
      streakDays: 0,
      countryFlag: "🏳️",
    });
    const maxSeedXp = Math.max(...leaderboardSeedUsers.map((u) => u.xpTotal));
    expect(rows[0].xpTotal).toBe(maxSeedXp);
  });

  it("XP 相同时按 streakDays 降序排序", () => {
    // 构造与某个种子用户 XP 相同但 streakDays 更高的情况
    const targetUser = leaderboardSeedUsers[0];
    const rows = computeLeaderboard({
      id: "u_local",
      username: "AAA_player", // username 排序最靠前，确保 streakDays 优先
      avatarGradient: "linear-gradient(135deg, #000, #fff)",
      xpTotal: targetUser.xpTotal,
      streakDays: targetUser.streakDays + 100,
      countryFlag: "🏳️",
    });
    // 找到 XP 相同的连续段，当前用户应排在前面
    const sameXpRows = rows.filter((r) => r.xpTotal === targetUser.xpTotal);
    expect(sameXpRows[0].isCurrentUser).toBe(true);
  });
});

describe("getMedalForRank", () => {
  it("第 1 名返回 🥇", () => {
    expect(getMedalForRank(1)).toBe("🥇");
  });
  it("第 2 名返回 🥈", () => {
    expect(getMedalForRank(2)).toBe("🥈");
  });
  it("第 3 名返回 🥉", () => {
    expect(getMedalForRank(3)).toBe("🥉");
  });
  it("第 4 名及以后返回 null", () => {
    expect(getMedalForRank(4)).toBeNull();
    expect(getMedalForRank(10)).toBeNull();
    expect(getMedalForRank(100)).toBeNull();
  });
  it("无效排名（0 或负数）返回 null", () => {
    expect(getMedalForRank(0)).toBeNull();
    expect(getMedalForRank(-1)).toBeNull();
  });
});

describe("isTopTen", () => {
  it("1-10 返回 true", () => {
    for (let i = 1; i <= 10; i++) {
      expect(isTopTen(i)).toBe(true);
    }
  });
  it("11 及以后返回 false", () => {
    expect(isTopTen(11)).toBe(false);
    expect(isTopTen(100)).toBe(false);
  });
  it("0 或负数返回 false", () => {
    expect(isTopTen(0)).toBe(false);
    expect(isTopTen(-1)).toBe(false);
  });
});
