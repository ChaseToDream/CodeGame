import { blogPosts } from "@/data/blog";
import BlogPostClient from "./BlogPostClient";

// 预渲染所有博客文章，使其可被 CDN 缓存（必须在 server component 中导出）
export function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export default function Page() {
  return <BlogPostClient />;
}
