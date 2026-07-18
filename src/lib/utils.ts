import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Difficulty } from "@/types";

/** 合并 Tailwind 类名，处理冲突 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 课程难度本地化映射：与 CourseCard 显示风格保持一致。
 * 集中维护避免各页面分别硬编码导致漂移。
 */
export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: "入门",
  intermediate: "进阶",
  advanced: "高级",
};

/** 用户角色本地化映射 */
export const ROLE_LABEL: Record<"member" | "staff", string> = {
  member: "成员",
  staff: "官方",
};

/** 社区帖子分类本地化映射 */
export const POST_CATEGORY_LABEL: Record<string, string> = {
  general: "综合",
  career: "职业",
  project_showcase: "作品展示",
  introductions: "自我介绍",
};

/**
 * 根据作品标题推断展示图标。
 * 集中维护避免各页面分别 includes 判断导致漂移。
 * 默认返回 🌱。
 */
export function getBuildIcon(title: string): string {
  const t = title.toLowerCase();
  if (t.includes("snake") || t.includes("贪吃蛇")) return "🐍";
  if (t.includes("timer") || t.includes("计时")) return "⏰";
  if (t.includes("pixel") || t.includes("像素")) return "🎨";
  return "🌱";
}

/** 数字简写：K 用 1 位小数，M 用 2 位小数（M 数值更大需更多精度）。
 *  整数位去尾 0：1M / 1K 而非 1.00M / 1.0K */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, "") + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
  return n.toString();
}

/** 等级所需 XP：每级递增 */
export function xpForLevel(level: number): number {
  return level * 250;
}

/** 根据 XP 总数计算等级与当前等级区间 */
export function levelFromXp(xp: number): {
  level: number;
  levelStart: number;
  levelEnd: number;
} {
  let level = 1;
  let acc = 0;
  while (xp >= acc + xpForLevel(level)) {
    acc += xpForLevel(level);
    level += 1;
  }
  return { level, levelStart: acc, levelEnd: acc + xpForLevel(level) };
}

/** 相对时间，例如 "3小时前"。未来时间（时钟偏移）统一显示为"刚刚"。
 *  无效日期（NaN）返回 "未知时间"，避免显示 "NaN秒前" */
export function timeAgo(iso: string): string {
  const ts = new Date(iso).getTime();
  if (Number.isNaN(ts)) return "未知时间";
  const diff = Date.now() - ts;
  if (diff < 0) return "刚刚";
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}秒前`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}分钟前`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}小时前`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}天前`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}个月前`;
  return `${Math.floor(mo / 12)}年前`;
}

/**
 * 生成简短 ID。
 * 优先使用 crypto.randomUUID（现代浏览器原生支持，128 位熵），
 * 退化时使用 Math.random + Date.now 组合，比单纯 Math.random 冲突率更低。
 */
export function genId(prefix = "id"): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
  }
  return `${prefix}_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
