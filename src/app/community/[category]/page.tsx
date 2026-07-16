import { communityPosts } from "@/data/posts";
import { notFound } from "next/navigation";
import type { PostCategory } from "@/types";
import CategoryListClient from "./CategoryListClient";

// 仅预渲染合法分类的列表页，避免任意 [category] 都被静态生成
const VALID_CATEGORIES: PostCategory[] = [
  "general",
  "career",
  "project_showcase",
  "introductions",
];

export function generateStaticParams() {
  return VALID_CATEGORIES.map((category) => ({ category }));
}

export default function Page({
  params,
}: {
  params: { category: string };
}) {
  // 校验路由参数：非法分类返回 404，保持与 not-found.tsx 一致的体验
  if (!VALID_CATEGORIES.includes(params.category as PostCategory)) {
    notFound();
  }
  // 预取该分类下的种子帖子 id，用于客户端 hydration 前的初始渲染
  const initialIds = communityPosts
    .filter((p) => p.category === params.category)
    .map((p) => p.id);
  return (
    <CategoryListClient
      category={params.category as PostCategory}
      initialPostIds={initialIds}
    />
  );
}
