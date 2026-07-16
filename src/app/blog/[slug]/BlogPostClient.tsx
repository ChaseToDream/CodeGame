"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { getBlogPostBySlug, blogPosts } from "@/data/blog";
import { timeAgo } from "@/lib/utils";
import { SafeMarkdown } from "@/components/content/SafeMarkdown";

const CATEGORY_LABEL: Record<string, string> = {
  All: "全部",
  "Product Updates": "产品更新",
  "Learner Stories": "学习者故事",
  Announcements: "公告",
  Tutorials: "教程",
};

export default function BlogPostClient() {
  const params = useParams<{ slug: string }>();
  const post = getBlogPostBySlug(params.slug);

  const related = useMemo(
    () => blogPosts.filter((p) => p.slug !== params.slug).slice(0, 3),
    [params.slug],
  );

  if (!post) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">未找到文章</h1>
        <Link href="/blog" className="text-accent hover:text-accent2">← 返回博客</Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
      <nav className="text-sm text-muted mb-6">
        <Link href="/blog" className="hover:text-ink">博客</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{CATEGORY_LABEL[post.category] ?? post.category}</span>
      </nav>

      <span className="text-[10px] uppercase tracking-wider text-accent2 font-bold">{CATEGORY_LABEL[post.category] ?? post.category}</span>
      <h1 className="font-outfit text-3xl sm:text-4xl font-bold mt-2 mb-4">{post.title}</h1>

      <div className="flex items-center gap-3 mb-8 text-sm text-muted">
        <div className="h-10 w-10 rounded-full" style={{ background: post.authorAvatar }} />
        <div>
          <div className="font-bold text-ink">{post.author}</div>
          <div className="text-xs">{timeAgo(post.publishedAt)} · {post.readingMinutes} 分钟阅读</div>
        </div>
      </div>

      <div className="h-56 rounded-xl mb-8" style={{ background: post.coverGradient }} />

      <div className="prose-cdx">
        <SafeMarkdown>{post.content}</SafeMarkdown>
      </div>

      <div className="mt-12 pt-8 border-t border-rule">
        <h2 className="font-outfit text-xl font-bold mb-4">更多文章</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {related.map((p) => (
            <Link
              key={p.id}
              href={`/blog/${p.slug}`}
              className="group rounded-lg overflow-hidden border border-rule bg-bg2 hover:border-accent transition"
            >
              <div className="h-20" style={{ background: p.coverGradient }} />
              <div className="p-3">
                <div className="font-bold text-sm text-ink group-hover:text-accent line-clamp-2">{p.title}</div>
                <div className="text-[10px] text-muted mt-1">{p.readingMinutes} 分钟阅读</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
