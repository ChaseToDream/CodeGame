"use client";

import { useCallback } from "react";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import type { BookmarkType } from "@/types";

/**
 * 书签按钮（收藏/取消收藏）。
 *
 * 设计要点：
 * 1. 通过订阅 bookmarks 数组派生 active 状态，避免使用 isBookmarked()
 *    方法（getState 不订阅，状态切换不会触发重渲染）。
 * 2. 调用 toggleBookmark 后由 store 触发订阅，自动更新 active 视觉态。
 * 3. 提供 sm/md 两种尺寸与多种视觉风格（icon 仅图标 / with-label 图标+文字），
 *    适配不同位置（卡片角落 / 详情页头部 / 列表项右侧）。
 * 4. 阻止冒泡：常用于卡片内嵌场景，避免点击收藏跳转到详情页。
 */

type Variant = "ghost" | "solid" | "minimal";
type Size = "sm" | "md";

interface BookmarkButtonProps {
  type: BookmarkType;
  id: string;
  variant?: Variant;
  size?: Size;
  withLabel?: boolean;
  /** 点击事件是否阻止冒泡。默认 true，因为按钮常嵌在可点击卡片内。
   *  显式传 false 可在详情页等独立按钮场景保留默认行为。 */
  stopPropagation?: boolean;
  className?: string;
}

const SIZE_CLASSES: Record<Size, string> = {
  sm: "h-8 w-8 text-sm",
  md: "h-10 w-10 text-base",
};

const LABEL_SIZE_CLASSES: Record<Size, string> = {
  sm: "px-2.5 py-1.5 text-xs gap-1",
  md: "px-3 py-2 text-sm gap-1.5",
};

export function BookmarkButton({
  type,
  id,
  variant = "ghost",
  size = "md",
  withLabel = false,
  stopPropagation = true,
  className,
}: BookmarkButtonProps) {
  // 订阅 bookmarks 数组：派生 active 状态。
  // useShallow 返回的 bookmarks 引用稳定，store 内 set 总会替换数组，因此能正确触发订阅。
  const bookmarks = useUserStore(useShallow((s) => s.bookmarks));
  const toggleBookmark = useUserStore((s) => s.toggleBookmark);
  const active = bookmarks.some((b) => b.type === type && b.id === id);

  const onClick = useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (stopPropagation) {
        e.preventDefault();
        e.stopPropagation();
      }
      toggleBookmark(type, id);
    },
    [type, id, toggleBookmark, stopPropagation],
  );

  // 视觉风格
  const baseClass = withLabel
    ? cn(
        "inline-flex items-center justify-center rounded-lg border font-semibold transition",
        LABEL_SIZE_CLASSES[size],
        active
          ? "border-accent2 bg-accent2/15 text-accent2"
          : "border-rule bg-bg2/80 text-muted hover:text-ink hover:border-accent2/60",
      )
    : cn(
        "inline-flex items-center justify-center rounded-lg border transition",
        SIZE_CLASSES[size],
        variant === "solid" && !active && "bg-bg/60 border-bg/60 text-white hover:bg-bg/80",
        variant === "ghost" && !active && "border-rule bg-bg2/80 text-muted hover:text-ink hover:border-accent2/60",
        variant === "minimal" && !active && "border-transparent bg-transparent text-muted hover:text-ink",
        active && "border-accent2 bg-accent2/15 text-accent2",
      );

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(baseClass, className)}
      aria-pressed={active}
      aria-label={active ? "取消收藏" : "添加到收藏"}
      title={active ? "取消收藏" : "添加到收藏"}
    >
      <span aria-hidden="true" className={cn(active && "scale-110 transition-transform")}>
        {active ? "★" : "☆"}
      </span>
      {withLabel && <span>{active ? "已收藏" : "收藏"}</span>}
    </button>
  );
}
