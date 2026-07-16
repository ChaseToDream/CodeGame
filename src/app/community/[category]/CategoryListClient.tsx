"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { communityPosts as seedPosts } from "@/data/posts";
import { timeAgo, cn } from "@/lib/utils";
import type { PostCategory } from "@/types";
import { NewPostModal } from "@/components/community/NewPostModal";

// 分类标签映射：与社区首页保持一致
const CATEGORY_LABEL: Record<PostCategory, string> = {
  general: "综合",
  career: "职业",
  project_showcase: "作品展示",
  introductions: "自我介绍",
};

const CATEGORY_EMOJI: Record<PostCategory, string> = {
  general: "💬",
  career: "💼",
  project_showcase: "🏗️",
  introductions: "👋",
};

interface CategoryListClientProps {
  category: PostCategory;
  /** 服务端预取的种子帖子 id 列表，用于首屏快速渲染 */
  initialPostIds: string[];
}

/**
 * 社区分类列表页：展示某个分类下的所有帖子（用户帖 + 种子帖）。
 * 与社区首页设计语言保持一致，避免 UI 视觉割裂。
 */
export default function CategoryListClient({
  category,
  initialPostIds,
}: CategoryListClientProps) {
  const { posts, user, togglePostLike } = useUserStore(
    useShallow((s) => ({
      posts: s.posts,
      user: s.user,
      togglePostLike: s.togglePostLike,
    })),
  );
  const [sort, setSort] = useState<"top" | "newest">("top");
  const [showNewPost, setShowNewPost] = useState(false);

  // 合并用户帖与种子帖并去重（修复原数组未去重问题），再按分类筛选
  const allPosts = useMemo(() => {
    const seen = new Set<string>();
    const merged: typeof posts = [];
    for (const p of [...posts, ...seedPosts]) {
      if (seen.has(p.id)) continue;
      seen.add(p.id);
      if (p.category === category) merged.push(p);
    }
    if (sort === "top") merged.sort((a, b) => b.likeCount - a.likeCount);
    else merged.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return merged;
  }, [posts, category, sort]);

  const canPost = user.xpTotal >= 100;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">{CATEGORY_EMOJI[category]}</div>
        <h1 className="font-outfit text-4xl font-bold">
          <span className="gradient-text">{CATEGORY_LABEL[category]}</span> 板块
        </h1>
        <p className="text-muted mt-2">
          {initialPostIds.length > 0
            ? `共 ${allPosts.length} 个帖子`
            : "这个板块还没有帖子，来发第一个吧！"}
        </p>
      </div>

      {/* Breadcrumb */}
      <nav className="text-sm text-muted mb-6">
        <Link href="/community" className="hover:text-ink">
          社区
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{CATEGORY_LABEL[category]}</span>
      </nav>

      {/* XP gate notice */}
      {!canPost && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 mb-6 text-sm text-ink">
          🔒 你需要 <strong className="text-warning">100 XP</strong> 才能在社区发帖。你目前有 <strong>{user.xpTotal} XP</strong> —— 再完成几个练习即可解锁发帖功能！
        </div>
      )}

      {/* Sort */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {(["top", "newest"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                sort === s
                  ? "border-accent2 bg-accent2 text-bg"
                  : "border-rule bg-bg2 text-muted hover:text-ink",
              )}
            >
              {s === "top" ? "🔥 热门" : "🆕 最新"}
            </button>
          ))}
        </div>
        <Link
          href="/community"
          className="text-xs text-muted hover:text-ink transition"
        >
          ← 返回全部板块
        </Link>
      </div>

      {/* Posts */}
      {allPosts.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <div className="text-5xl mb-3">📭</div>
          这个板块还没有帖子。
        </div>
      ) : (
        <div className="space-y-4">
          {allPosts.map((p) => (
            <article
              key={p.id}
              className="rounded-xl border border-rule bg-bg2 p-4 sm:p-5 hover:border-accent/50 transition relative"
            >
              {p.isStaffPick && (
                <span className="absolute -top-2 left-4 px-2 py-0.5 rounded bg-gradient-to-r from-warning to-accent2 text-bg text-[10px] font-bold font-pixel">
                  ⭐ 编辑精选
                </span>
              )}
              <div className="flex gap-3">
                <div
                  className="h-10 w-10 rounded-full shrink-0 ring-2 ring-accent/30"
                  style={{ background: p.authorAvatar }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap text-xs text-muted mb-1">
                    <span className="font-bold text-ink">@{p.authorName}</span>
                    <span className="px-1.5 py-0.5 rounded bg-bg3 text-accent2 font-pixel">
                      Lvl {p.authorLevel}
                    </span>
                    <span>·</span>
                    <span>{timeAgo(p.createdAt)}</span>
                  </div>
                  <Link href={`/community/${p.category}/${p.id}`}>
                    <h3 className="font-outfit font-bold text-lg text-ink hover:text-accent transition">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted mt-1 line-clamp-3">
                    {p.content}
                  </p>
                  <div className="mt-3 flex items-center gap-4 text-xs text-muted">
                    <button
                      onClick={() => togglePostLike(p.id)}
                      className={cn(
                        "flex items-center gap-1 hover:text-accent2 transition",
                        p.likedByMe && "text-accent2",
                      )}
                    >
                      ❤️ {p.likeCount}
                    </button>
                    <Link
                      href={`/community/${p.category}/${p.id}`}
                      className="flex items-center gap-1 hover:text-ink transition"
                    >
                      💬 {p.commentCount}
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Floating new post button */}
      <button
        onClick={() => {
          if (!canPost) {
            alert(`🔒 你需要 100 XP 才能发帖。你目前有 ${user.xpTotal} XP。请先完成几个练习！`);
            return;
          }
          setShowNewPost(true);
        }}
        className="fixed bottom-6 right-6 h-14 w-14 sm:h-auto sm:w-auto sm:px-5 sm:py-3 rounded-full bg-gradient-to-r from-accent to-accent2 text-white font-semibold shadow-glow hover:scale-105 transition flex items-center justify-center gap-2 z-30"
      >
        <span className="text-xl">✏️</span>
        <span className="hidden sm:inline">发新帖</span>
      </button>

      {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} />}
    </div>
  );
}
