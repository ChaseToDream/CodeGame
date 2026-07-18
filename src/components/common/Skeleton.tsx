"use client";

import { cn } from "@/lib/utils";

/**
 * 骨架屏组件集合。
 *
 * 用于页面加载/数据等待期间展示占位 UI，
 * 比空白 spinner 更友好，能提前告知用户内容的大致布局。
 */

interface SkeletonProps {
  className?: string;
}

/** 基础骨架块：带 shimmer 动画的矩形 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "rounded-lg bg-bg3 animate-shimmer bg-[linear-gradient(90deg,var(--bg3)_25%,var(--bg2)_50%,var(--bg3)_75%)] bg-[length:200%_100%]",
        className,
      )}
      aria-hidden="true"
    />
  );
}

/** 文本行骨架 */
export function SkeletonLine({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-4 w-full", className)} />;
}

/** 圆形骨架（头像） */
export function SkeletonCircle({ className }: SkeletonProps) {
  return <Skeleton className={cn("h-10 w-10 rounded-full", className)} />;
}

/** 卡片骨架 */
export function SkeletonCard({ className }: SkeletonProps) {
  return (
    <div className={cn("rounded-xl border border-rule bg-bg2 p-5 space-y-3", className)}>
      <Skeleton className="h-5 w-2/3" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-4/5" />
      <SkeletonLine className="w-3/5" />
    </div>
  );
}

/** 课程列表骨架 */
export function CourseListSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-xl border border-rule bg-bg2 p-5 space-y-3">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <Skeleton className="h-5 w-3/4" />
          <SkeletonLine className="w-full" />
          <SkeletonLine className="w-2/3" />
          <Skeleton className="h-2 w-full rounded-full" />
        </div>
      ))}
    </div>
  );
}

/** 仪表盘骨架 */
export function DashboardSkeleton() {
  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      <Skeleton className="h-48 w-full rounded-2xl" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-32 w-full rounded-xl" />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="space-y-6">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </div>
    </div>
  );
}

/** 帖子详情骨架 */
export function PostDetailSkeleton() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <SkeletonCircle className="h-12 w-12" />
        <div className="space-y-2 flex-1">
          <SkeletonLine className="w-1/3" />
          <SkeletonLine className="w-1/4" />
        </div>
      </div>
      <Skeleton className="h-8 w-2/3" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-full" />
      <SkeletonLine className="w-4/5" />
      <SkeletonLine className="w-3/4" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}