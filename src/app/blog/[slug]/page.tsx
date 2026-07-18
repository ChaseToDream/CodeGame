import type { Metadata } from "next";
import { blogPosts } from "@/data/blog";
import BlogPostClient from "./BlogPostClient";

// 预渲染所有博客文章，使其可被 CDN 缓存（必须在 server component 中导出）
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = blogPosts.find((p) => p.slug === params.slug);
  if (!post) {
    return { title: "文章未找到 · CodeGame" };
  }
  return {
    title: `${post.title} · CodeGame 博客`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default function Page() {
  return <BlogPostClient />;
}
