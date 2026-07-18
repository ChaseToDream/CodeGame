import type { LeaderboardEntry } from "@/types";

/**
 * 排行榜虚拟对手用户种子数据。
 *
 * 设计要点：
 * - XP 分布覆盖新手到高手，让当前用户无论水平高低都能找到合适排名位置
 * - 等级由 lib/leaderboard.ts 的 computeLeaderboard 运行时派生，避免数据冗余
 * - 头像渐变与现有用户头像风格一致（linear-gradient(135deg, ...)）
 * - 国旗 emoji 多样化，体现全球学习者社区氛围
 * - 用户名风格与社区种子帖子（data/posts.ts）保持一致
 *
 * 注：此数据为静态展示用，当前用户的实时 XP 会在运行时插入并重新排序。
 */
export const leaderboardSeedUsers: Omit<LeaderboardEntry, "level">[] = [
  {
    id: "u_aria",
    username: "aria_makes",
    avatarGradient: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
    xpTotal: 1840,
    streakDays: 14,
    countryFlag: "🇯🇵",
  },
  {
    id: "u_marco",
    username: "marco.dev",
    avatarGradient: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
    xpTotal: 4250,
    streakDays: 42,
    countryFlag: "🇮🇹",
  },
  {
    id: "u_sarah",
    username: "sarah_codes",
    avatarGradient: "linear-gradient(135deg, #FF6B9D, #7C5CFC)",
    xpTotal: 3120,
    streakDays: 7,
    countryFlag: "🇺🇸",
  },
  {
    id: "u_kenji",
    username: "kenji.codes",
    avatarGradient: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
    xpTotal: 5640,
    streakDays: 30,
    countryFlag: "🇯🇵",
  },
  {
    id: "u_elena",
    username: "elena_dev",
    avatarGradient: "linear-gradient(135deg, #FF6B9D, #F0A04B)",
    xpTotal: 980,
    streakDays: 5,
    countryFlag: "🇪🇸",
  },
  {
    id: "u_raj",
    username: "raj_builds",
    avatarGradient: "linear-gradient(135deg, #4ECDC4, #FF6B9D)",
    xpTotal: 6720,
    streakDays: 21,
    countryFlag: "🇮🇳",
  },
  {
    id: "u_maria",
    username: "maria.makes",
    avatarGradient: "linear-gradient(135deg, #F0A04B, #7C5CFC)",
    xpTotal: 2310,
    streakDays: 12,
    countryFlag: "🇧🇷",
  },
  {
    id: "u_tom",
    username: "tom_learns",
    avatarGradient: "linear-gradient(135deg, #7C5CFC, #FF6B9D)",
    xpTotal: 540,
    streakDays: 3,
    countryFlag: "🇬🇧",
  },
  {
    id: "u_lin",
    username: "lin_codes",
    avatarGradient: "linear-gradient(135deg, #4ECDC4, #F0A04B)",
    xpTotal: 7890,
    streakDays: 60,
    countryFlag: "🇨🇳",
  },
  {
    id: "u_pierre",
    username: "pierre.dev",
    avatarGradient: "linear-gradient(135deg, #FF6B9D, #4ECDC4)",
    xpTotal: 3450,
    streakDays: 18,
    countryFlag: "🇫🇷",
  },
  {
    id: "u_olga",
    username: "olga_makes",
    avatarGradient: "linear-gradient(135deg, #7C5CFC, #F0A04B)",
    xpTotal: 5120,
    streakDays: 9,
    countryFlag: "🇷🇺",
  },
  {
    id: "u_sam",
    username: "sam_builds",
    avatarGradient: "linear-gradient(135deg, #F0A04B, #4ECDC4)",
    xpTotal: 1450,
    streakDays: 25,
    countryFlag: "🇦🇺",
  },
];
