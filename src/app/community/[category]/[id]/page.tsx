"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { communityPosts as seedPosts } from "@/data/posts";
import { builds as seedBuilds } from "@/data/builds";
import { timeAgo, cn } from "@/lib/utils";

export default function PostDetailPage() {
  const params = useParams<{ category: string; id: string }>();
  const { posts, togglePostLike, addComment, user, isAuthed } = useUserStore();
  const [comment, setComment] = useState("");

  const post = useMemo(
    () => [...posts, ...seedPosts].find((p) => p.id === params.id),
    [posts, params.id],
  );

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">Post not found</h1>
        <Link href="/community" className="text-accent hover:text-accent2">← Back to community</Link>
      </div>
    );
  }

  const attachedBuild = post.attachedBuildId
    ? [...seedBuilds, ...useUserStore.getState().builds].find((b) => b.id === post.attachedBuildId)
    : null;

  const submitComment = () => {
    if (!comment.trim() || !isAuthed) return;
    addComment(post.id, comment.trim());
    setComment("");
  };

  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10">
      <nav className="text-sm text-muted mb-4">
        <Link href="/community" className="hover:text-ink">Community</Link>
        <span className="mx-2">/</span>
        <span className="text-ink capitalize">{post.category.replace("_", " ")}</span>
      </nav>

      <article className="rounded-xl border border-rule bg-bg2 p-6 mb-6 relative">
        {post.isStaffPick && (
          <span className="absolute -top-2 left-6 px-2 py-0.5 rounded bg-gradient-to-r from-warning to-accent2 text-bg text-[10px] font-bold font-pixel">
            ⭐ STAFF PICK
          </span>
        )}
        <div className="flex items-center gap-3 mb-4">
          <div className="h-12 w-12 rounded-full ring-2 ring-accent/30" style={{ background: post.authorAvatar }} />
          <div>
            <div className="font-bold text-ink">@{post.authorName}</div>
            <div className="text-xs text-muted">
              <span className="text-accent2 font-pixel">Lvl {post.authorLevel}</span> · {timeAgo(post.createdAt)}
            </div>
          </div>
          <span className="ml-auto px-2 py-1 rounded bg-bg3 text-[10px] text-accent uppercase tracking-wide font-bold">
            {post.category.replace("_", " ")}
          </span>
        </div>

        <h1 className="font-outfit text-2xl font-bold mb-3">{post.title}</h1>
        <div className="prose-cdx text-sm">
          {post.content.split("\n").map((line, i) => (
            <p key={i} className={line.trim() ? "" : "h-2"}>{line}</p>
          ))}
        </div>

        {attachedBuild && (
          <Link
            href={`/builds/${attachedBuild.id}`}
            className="mt-4 flex items-center gap-3 p-3 rounded-lg border border-rule bg-bg3 hover:border-accent transition"
          >
            <div className="h-14 w-20 rounded shrink-0 flex items-center justify-center text-2xl" style={{ background: attachedBuild.thumbnailGradient }}>
              🏗️
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-ink line-clamp-1">{attachedBuild.title}</div>
              <div className="text-xs text-muted line-clamp-1">{attachedBuild.description}</div>
            </div>
            <span className="px-3 py-1.5 rounded text-xs bg-accent text-white font-semibold shrink-0">▶ Live Demo</span>
          </Link>
        )}

        <div className="mt-5 pt-4 border-t border-rule flex items-center gap-4">
          <button
            onClick={() => togglePostLike(post.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition",
              post.likedByMe ? "bg-accent2/20 text-accent2" : "text-muted hover:text-accent2 hover:bg-bg3",
            )}
          >
            ❤️ {post.likeCount}
          </button>
          <span className="text-sm text-muted">💬 {post.comments.length} comments</span>
        </div>
      </article>

      {/* Comments */}
      <section>
        <h2 className="font-outfit text-lg font-bold mb-4">Comments</h2>

        {isAuthed ? (
          <div className="mb-6 flex gap-3">
            <div className="h-9 w-9 rounded-full shrink-0" style={{ background: user?.avatarGradient }} />
            <div className="flex-1">
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="Write a comment..."
                className="w-full px-3 py-2 rounded-lg bg-bg2 border border-rule text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition resize-y"
              />
              <div className="mt-2 flex justify-end">
                <button
                  onClick={submitComment}
                  disabled={!comment.trim()}
                  className="px-4 py-1.5 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition"
                >
                  Comment
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="mb-6 p-4 rounded-lg border border-rule bg-bg2 text-center text-sm text-muted">
            <Link href="/login" className="text-accent hover:underline">Log in</Link> to join the conversation.
          </div>
        )}

        <div className="space-y-4">
          {post.comments.length === 0 ? (
            <p className="text-center text-sm text-muted py-6">No comments yet. Be the first!</p>
          ) : (
            post.comments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <div className="h-9 w-9 rounded-full shrink-0" style={{ background: c.authorAvatar }} />
                <div className="flex-1">
                  <div className="rounded-lg bg-bg2 border border-rule p-3">
                    <div className="flex items-center gap-2 text-xs text-muted mb-1">
                      <span className="font-bold text-ink">@{c.authorName}</span>
                      <span>·</span>
                      <span>{timeAgo(c.createdAt)}</span>
                    </div>
                    <p className="text-sm text-ink">{c.content}</p>
                  </div>
                  <div className="mt-1 ml-2 text-[11px] text-muted">❤️ {c.likeCount}</div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}
