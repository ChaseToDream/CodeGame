import { communityPosts as seedPosts } from "@/data/posts";
import PostDetailClient from "./PostDetailClient";

// 预渲染所有种子帖子，使其可被 CDN 缓存（必须在 server component 中导出）
export function generateStaticParams() {
  return seedPosts.map((p) => ({ category: p.category, id: p.id }));
}

export default function Page() {
  return <PostDetailClient />;
}
