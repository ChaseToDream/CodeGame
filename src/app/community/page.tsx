"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { communityPosts as seedPosts } from "@/data/posts";
import { builds as seedBuilds } from "@/data/builds";
import { timeAgo, cn } from "@/lib/utils";
import type { PostCategory } from "@/types";
import { NewPostModal } from "@/components/community/NewPostModal";

const CATEGORIES: { key: PostCategory | "all"; label: string; emoji: string }[] = [
  { key: "all", label: "全部", emoji: "📋" },
  { key: "general", label: "综合", emoji: "💬" },
  { key: "career", label: "职业", emoji: "💼" },
  { key: "project_showcase", label: "作品展示", emoji: "🏗️" },
  { key: "introductions", label: "自我介绍", emoji: "👋" },
];

const CATEGORY_LABEL: Record<string, string> = {
  general: "综合",
  career: "职业",
  project_showcase: "作品展示",
  introductions: "自我介绍",
};

export default function CommunityPage() {
  const { posts, user, isAuthed, togglePostLike } = useUserStore();
  const [sort, setSort] = useState<"top" | "newest">("top");
  const [category, setCategory] = useState<PostCategory | "all">("all");
  const [showNewPost, setShowNewPost] = useState(false);

  const allPosts = useMemo(() => {
    let list = [...posts, ...seedPosts.filter((p) => !posts.find((x) => x.id === p.id))];
    if (category !== "all") list = list.filter((p) => p.category === category);
    if (sort === "top") list.sort((a, b) => b.likeCount - a.likeCount);
    else list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [posts, sort, category]);

  const canPost = isAuthed && user && user.xpTotal >= 100;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="text-5xl mb-3">💬</div>
        <h1 className="font-outfit text-4xl font-bold">
          Codédex <span className="gradient-text">社区</span>
        </h1>
        <p className="text-muted mt-2">分享你的成就，提出问题，互相鼓励。</p>
      </div>

      {/* XP gate notice */}
      {isAuthed && user && !canPost && (
        <div className="rounded-lg border border-warning/40 bg-warning/10 p-4 mb-6 text-sm text-ink">
          🔒 你需要 <strong className="text-warning">100 XP</strong> 才能在社区发帖。你目前有 <strong>{user.xpTotal} XP</strong> —— 再完成几个练习即可解锁发帖功能！
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              onClick={() => setCategory(c.key)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition flex items-center gap-1.5",
                category === c.key
                  ? "border-accent bg-accent text-white"
                  : "border-rule bg-bg2 text-muted hover:text-ink",
              )}
            >
              <span>{c.emoji}</span>
              {c.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {(["top", "newest"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                sort === s ? "border-accent2 bg-accent2 text-bg" : "border-rule bg-bg2 text-muted hover:text-ink",
              )}
            >
              {s === "top" ? "🔥 热门" : "🆕 最新"}
            </button>
          ))}
        </div>
      </div>

      {/* Posts */}
      <div className="space-y-4">
        {allPosts.map((p) => {
          const attachedBuild = p.attachedBuildId
            ? [...seedBuilds, ...useUserStore.getState().builds].find((b) => b.id === p.attachedBuildId)
            : null;
          return (
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
                    <span className="px-1.5 py-0.5 rounded bg-bg3 text-accent2 font-pixel">Lvl {p.authorLevel}</span>
                    <span>·</span>
                    <span>{timeAgo(p.createdAt)}</span>
                    <span>·</span>
                    <span className="text-accent uppercase tracking-wide text-[10px] font-bold">
                      {CATEGORY_LABEL[p.category] ?? p.category.replace("_", " ")}
                    </span>
                  </div>
                  <Link href={`/community/${p.category}/${p.id}`}>
                    <h3 className="font-outfit font-bold text-lg text-ink hover:text-accent transition">
                      {p.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted mt-1 line-clamp-3">{p.content}</p>

                  {attachedBuild && (
                    <Link
                      href={`/builds/${attachedBuild.id}`}
                      className="mt-3 flex items-center gap-3 p-2 rounded-lg border border-rule bg-bg3 hover:border-accent transition"
                    >
                      <div
                        className="h-12 w-16 rounded shrink-0 flex items-center justify-center text-xl"
                        style={{ background: attachedBuild.thumbnailGradient }}
                      >
                        🏗️
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm text-ink line-clamp-1">{attachedBuild.title}</div>
                        <div className="text-[10px] text-muted">@{attachedBuild.authorName}</div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <span className="px-2 py-1 rounded text-[10px] bg-accent/20 text-accent">▶ 在线演示</span>
                        <span className="px-2 py-1 rounded text-[10px] bg-bg2 text-muted">&lt;/&gt; 代码</span>
                      </div>
                    </Link>
                  )}

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
          );
        })}
      </div>

      {/* Floating new post button */}
      <button
        onClick={() => {
          if (!canPost) {
            alert(`🔒 你需要 100 XP 才能发帖。你目前有 ${user?.xpTotal ?? 0} XP。请先完成几个练习！`);
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
