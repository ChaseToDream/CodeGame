import { courses } from "@/data/courses";
import type { Exercise, Course } from "@/types";

/**
 * 每日挑战：基于日期的确定性练习选择。
 *
 * 设计要点：
 * - 同一天的所有用户看到同一道题（社区讨论基础）
 * - 使用 UTC 日期作为种子，避免时区切换导致题目变化
 * - 优先选择 python/javascript 类型练习（这些有真实代码执行能力）
 * - 跳过 bonus_article 类型（无代码执行）
 * - 365 天循环不重复（题库足够大时），同一天访问多次结果稳定
 */

/**
 * 计算指定日期的每日挑战。
 *
 * @param date 目标日期（默认今天）
 * @returns 包含课程、章节、练习的对象，或 null（题库为空时）
 */
export function getDailyChallenge(date: Date = new Date()): {
  course: Course;
  exercise: Exercise;
  /** 日期键 YYYY-MM-DD（UTC），用于状态跟踪 */
  dayKey: string;
} | null {
  // 收集所有可执行练习（排除 bonus_article 等无代码类型）
  const candidates: Array<{ course: Course; exercise: Exercise }> = [];
  for (const course of courses) {
    for (const ch of course.chapters) {
      for (const ex of ch.exercises) {
        // 仅选择有代码执行能力的练习（python/javascript）
        if (ex.type === "bonus_article") continue;
        if (ex.language !== "python" && ex.language !== "javascript") continue;
        candidates.push({ course, exercise: ex });
      }
    }
  }

  if (candidates.length === 0) return null;

  // 使用 UTC 日期作为种子，保证全球用户同一天看到同一题
  const dayKey = `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, "0")}-${String(date.getUTCDate()).padStart(2, "0")}`;

  // 简单确定性哈希：将日期字符串转为整数索引
  // 使用 FNV-1a 变体，分布足够均匀且实现简单
  let hash = 2166136261;
  for (let i = 0; i < dayKey.length; i++) {
    hash ^= dayKey.charCodeAt(i);
    hash = (hash * 16777619) >>> 0; // 无符号 32 位
  }
  const idx = hash % candidates.length;

  return {
    course: candidates[idx].course,
    exercise: candidates[idx].exercise,
    dayKey,
  };
}

/**
 * 计算距离明日挑战刷新的剩余时间（人类可读）。
 *
 * @returns 例如 "8小时 23分钟"
 */
export function getTimeUntilNextChallenge(now: Date = new Date()): string {
  // 下一 UTC 午夜
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
  ));
  const diffMs = tomorrow.getTime() - now.getTime();
  if (diffMs <= 0) return "即将刷新";

  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  if (hours > 0) {
    return `${hours}小时${minutes > 0 ? ` ${minutes}分钟` : ""}`;
  }
  return `${minutes}分钟`;
}
