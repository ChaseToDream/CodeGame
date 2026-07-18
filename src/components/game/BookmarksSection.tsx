"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { courses } from "@/data/courses";
import { builds as seedBuilds } from "@/data/builds";
import { communityPosts as seedPosts } from "@/data/posts";
import { blogPosts } from "@/data/blog";
import { getBuildIcon, timeAgo } from "@/lib/utils";
import type { BookmarkItem, BookmarkType } from "@/types";

/**
 * Dashboard 书签区域：跨课程/作品/帖子/博客统一展示用户收藏。
 *
 * 设计要点：
 * 1. 不缓存资源元数据：每次渲染时从原始数据源（courses/seedBuilds/seedPosts/blogPosts +
 *    store 中的用户数据）实时查找，源头数据更新后自动反映。
 * 2. 找不到资源的书签自动过滤：例如某 build 被作者删除后书签仍存在，
 *    显示"已删除"会破坏体验；这里直接跳过，并在书签管理入口提供清理路径。
 * 3. 按类型分组 + 按收藏时间倒序：与"我的收藏"心智模型一致，最近收藏的在前。
 * 4. 每个类型最多展示 4 条，超出提供"查看全部"入口（指向对应列表页 + 后续可加筛选）。
 */

const TYPE_META: Record<BookmarkType, { label: string; icon: string; allHref: string }> = {
  course: { label: "课程", icon: "📚", allHref: "/courses" },
  build: { label: "作品", icon: "🏗️", allHref: "/builds" },
  post: { label: "帖子", icon: "💬", allHref: "/community" },
  blog: { label: "博客", icon: "📰", allHref: "/blog" },
};

/** 单类型最多展示条目数，避免 Dashboard 过长 */
const MAX_PER_TYPE = 4;

interface ResolvedBookmark {
  bookmark: BookmarkItem;
  title: string;
  href: string;
  subtitle?: string;
  icon: string;
  gradient?: string;
}

export function BookmarksSection() {
  const bookmarks = useUserStore(useShallow((s) => s.bookmarks));
  const builds = useUserStore((s) => s.builds);
  const posts = useUserStore((s) => s.posts);

  // 解析每条书签对应的资源（找不到则过滤掉）
  const resolved = useMemo<ResolvedBookmark[]>(() => {
    const out: ResolvedBookmark[] = [];
    for (const bm of bookmarks) {
      const r = resolve(bm, { builds, posts });
      if (r) out.push(r);
    }
    // 按收藏时间倒序
    out.sort((a, z) => +new Date(z.bookmark.addedAt) - +new Date(a.bookmark.addedAt));
    return out;
  }, [bookmarks, builds, posts]);

  // 按类型分组
  const grouped = useMemo(() => {
    const map: Record<BookmarkType, ResolvedBookmark[]> = {
      course: [],
      build: [],
      post: [],
      blog: [],
    };
    for (const r of resolved) {
      map[r.bookmark.type].push(r);
    }
    return map;
  }, [resolved]);

  const totalCount = resolved.length;
  const typeOrder: BookmarkType[] = ["course", "build", "post", "blog"];

  return (
    <section className="rounded-xl border border-rule bg-bg2 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-outfit text-lg font-bold flex items-center gap-2">
          <span aria-hidden="true">⭐</span> 我的收藏
        </h2>
        <span className="text-xs text-muted">{totalCount} 项</span>
      </div>

      {totalCount === 0 ? (
        <div className="text-center py-6">
          <div className="text-3xl mb-2">⭐</div>
          <p className="text-muted text-sm mb-2">还没有收藏任何内容。</p>
          <p className="text-[11px] text-muted">
            在课程、作品、帖子或博客中点击 ☆ 即可收藏，方便稍后回看。
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {typeOrder.map((type) => {
            const items = grouped[type];
            if (items.length === 0) return null;
            const meta = TYPE_META[type];
            const visible = items.slice(0, MAX_PER_TYPE);
            const more = items.length - visible.length;
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted flex items-center gap-1.5">
                    <span aria-hidden="true">{meta.icon}</span>
                    {meta.label}
                    <span className="text-muted/60">· {items.length}</span>
                  </h3>
                  <Link href={meta.allHref} className="text-[11px] text-accent hover:text-accent2">
                    查看全部 →
                  </Link>
                </div>
                <ul className="space-y-1.5">
                  {visible.map((r) => (
                    <li key={`${r.bookmark.type}-${r.bookmark.id}`}>
                      <Link
                        href={r.href}
                        className="flex items-center gap-3 p-2 rounded-lg bg-bg3 hover:bg-bg3/60 hover:border-accent border border-transparent transition group"
                      >
                        <div
                          className="h-8 w-8 rounded flex items-center justify-center text-base shrink-0"
                          style={r.gradient ? { background: r.gradient } : undefined}
                        >
                          {r.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-ink group-hover:text-accent transition line-clamp-1">
                            {r.title}
                          </div>
                          {r.subtitle && (
                            <div className="text-[11px] text-muted line-clamp-1">{r.subtitle}</div>
                          )}
                        </div>
                        <span className="text-[10px] text-muted shrink-0" title={`收藏于 ${timeAgo(r.bookmark.addedAt)}`}>
                          {timeAgo(r.bookmark.addedAt)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {more > 0 && (
                  <Link
                    href={meta.allHref}
                    className="block text-center text-[11px] text-muted hover:text-accent mt-1.5"
                  >
                    还有 {more} 项 →
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

/**
 * 解析单条书签对应的资源元数据。
 * 找不到资源返回 null（已被删除或外部数据），调用方应过滤。
 */
function resolve(
  bm: BookmarkItem,
  ctx: { builds: ReturnType<typeof useUserStore.getState>["builds"]; posts: ReturnType<typeof useUserStore.getState>["posts"] },
): ResolvedBookmark | null {
  if (bm.type === "course") {
    const c = courses.find((x) => x.id === bm.id);
    if (!c) return null;
    return {
      bookmark: bm,
      title: c.title,
      href: `/${c.slug}`,
      subtitle: c.description,
      icon: c.icon,
      gradient: c.bannerGradient,
    };
  }
  if (bm.type === "build") {
    // 合并本地 store 与种子作品
    const seen = new Set(ctx.builds.map((b) => b.id));
    const merged = [...ctx.builds, ...seedBuilds.filter((b) => !seen.has(b.id))];
    const b = merged.find((x) => x.id === bm.id);
    if (!b) return null;
    return {
      bookmark: bm,
      title: b.title,
      href: `/builds/${b.id}`,
      subtitle: b.description || `@${b.authorName}`,
      icon: getBuildIcon(b.title),
      gradient: b.thumbnailGradient,
    };
  }
  if (bm.type === "post") {
    const seen = new Set(ctx.posts.map((p) => p.id));
    const merged = [...ctx.posts, ...seedPosts.filter((p) => !seen.has(p.id))];
    const p = merged.find((x) => x.id === bm.id);
    if (!p) return null;
    return {
      bookmark: bm,
      title: p.title,
      href: `/community/${p.category}/${p.id}`,
      subtitle: `@${p.authorName} · ❤️ ${p.likeCount}`,
      icon: "💬",
    };
  }
  if (bm.type === "blog") {
    const b = blogPosts.find((x) => x.slug === bm.id);
    if (!b) return null;
    return {
      bookmark: bm,
      title: b.title,
      href: `/blog/${b.slug}`,
      subtitle: `${b.author} · ${b.readingMinutes} 分钟阅读`,
      icon: "📰",
      gradient: b.coverGradient,
    };
  }
  return null;
}
