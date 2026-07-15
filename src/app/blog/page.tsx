"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { blogPosts } from "@/data/blog";
import { timeAgo, cn } from "@/lib/utils";

const CATEGORIES = [
  { key: "All", label: "全部" },
  { key: "Product Updates", label: "产品更新" },
  { key: "Learner Stories", label: "学习者故事" },
  { key: "Announcements", label: "公告" },
  { key: "Tutorials", label: "教程" },
] as const;

const CATEGORY_LABEL: Record<string, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
);

export default function BlogPage() {
  const [cat, setCat] = useState<string>("All");

  const posts = useMemo(() => {
    let list = [...blogPosts].sort((a, b) => +new Date(b.publishedAt) - +new Date(a.publishedAt));
    if (cat !== "All") list = list.filter((p) => p.category === cat);
    return list;
  }, [cat]);

  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">📝</div>
        <h1 className="font-outfit text-4xl font-bold">
          CodeGame <span className="gradient-text">博客</span>
        </h1>
        <p className="text-muted mt-2">产品更新、学习者故事和编程技巧。</p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap justify-center gap-2 mb-8">
        {CATEGORIES.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium border transition",
              cat === c.key ? "border-accent bg-accent text-white" : "border-rule bg-bg2 text-muted hover:text-ink",
            )}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Featured */}
      {featured && (
        <Link
          href={`/blog/${featured.slug}`}
          className="group block rounded-2xl overflow-hidden border border-rule bg-bg2 hover:border-accent transition mb-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="h-48 md:h-auto" style={{ background: featured.coverGradient }} />
            <div className="p-6">
              <span className="text-[10px] uppercase tracking-wider text-accent2 font-bold">
                {CATEGORY_LABEL[featured.category] ?? featured.category} · 精选
              </span>
              <h2 className="font-outfit text-2xl font-bold mt-2 group-hover:text-accent transition">
                {featured.title}
              </h2>
              <p className="text-muted text-sm mt-2 line-clamp-3">{featured.excerpt}</p>
              <div className="mt-4 flex items-center gap-2 text-xs text-muted">
                <div className="h-6 w-6 rounded-full" style={{ background: featured.authorAvatar }} />
                <span>{featured.author}</span>
                <span>·</span>
                <span>{timeAgo(featured.publishedAt)}</span>
                <span>·</span>
                <span>{featured.readingMinutes} 分钟阅读</span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {rest.map((p) => (
          <Link
            key={p.id}
            href={`/blog/${p.slug}`}
            className="group rounded-xl overflow-hidden border border-rule bg-bg2 hover:border-accent hover:-translate-y-1 transition-all"
          >
            <div className="h-32" style={{ background: p.coverGradient }} />
            <div className="p-4">
              <span className="text-[10px] uppercase tracking-wider text-accent2 font-bold">{CATEGORY_LABEL[p.category] ?? p.category}</span>
              <h3 className="font-outfit font-bold mt-1 group-hover:text-accent transition line-clamp-2">{p.title}</h3>
              <p className="text-xs text-muted mt-2 line-clamp-2">{p.excerpt}</p>
              <div className="mt-3 text-[11px] text-muted">
                {timeAgo(p.publishedAt)} · {p.readingMinutes} 分钟阅读
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
