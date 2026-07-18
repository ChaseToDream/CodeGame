"use client";

import { useEffect, useRef } from "react";
import type { Badge } from "@/types";

interface BadgeUnlockToastProps {
  /** 待展示的已解锁徽章；为空时不渲染 */
  badges: Badge[];
  /** 用户读完当前徽章后调用，关闭 toast 并展示下一个（若有） */
  onDismiss: () => void;
}

/**
 * 徽章解锁通知 —— 底部滑入式 toast。
 * 依次展示本次新解锁的徽章（每次一个），点击或 3.5s 后自动切到下一个。
 */
export function BadgeUnlockToast({ badges, onDismiss }: BadgeUnlockToastProps) {
  const current = badges[0];

  // 用 ref 持有最新的 onDismiss，避免父组件传入内联函数导致 setTimeout 计时器
  // 在每次父组件重渲染时被清零重启，toast 永远无法自动消失
  const onDismissRef = useRef(onDismiss);
  useEffect(() => {
    onDismissRef.current = onDismiss;
  }, [onDismiss]);

  useEffect(() => {
    if (!current) return;
    const t = setTimeout(() => onDismissRef.current(), 3500);
    return () => clearTimeout(t);
  }, [current]);

  if (!current) return null;

  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] w-[min(92vw,360px)] cursor-pointer animate-slideUp"
      onClick={onDismiss}
      role="status"
      aria-live="polite"
    >
      <div className="rounded-xl border border-warning/50 bg-gradient-to-br from-bg2 to-bg3 p-4 shadow-glow flex items-center gap-3">
        <div className="h-14 w-14 shrink-0 rounded-lg bg-warning/15 flex items-center justify-center text-3xl">
          {current.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[11px] uppercase tracking-widest text-warning font-bold">
            🏅 新徽章解锁
          </div>
          <div className="font-outfit font-bold text-ink text-sm mt-0.5 truncate">
            {current.name}
          </div>
          <div className="text-[11px] text-muted mt-0.5 line-clamp-2">
            {current.description}
          </div>
        </div>
      </div>
    </div>
  );
}
