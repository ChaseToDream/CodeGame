import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/** 合并 Tailwind 类名，处理冲突 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** 数字加千分位 */
export function formatNumber(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2).replace(/\.00$/, "") + "M";
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

/** 相对时间，例如 "3h ago" */
export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  const mo = Math.floor(day / 30);
  if (mo < 12) return `${mo}mo ago`;
  return `${Math.floor(mo / 12)}y ago`;
}

/** 生成简短 ID */
export function genId(prefix = "id"): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}
