import { courses } from "@/data/courses";
import ChapterClient from "./ChapterClient";

// 预渲染所有课程的所有章节页，使其可被 CDN 缓存
export function generateStaticParams() {
  return courses.flatMap((c) =>
    c.chapters.map((ch) => ({
      courseSlug: c.slug,
      chapterId: ch.id,
    })),
  );
}

// 仅允许 generateStaticParams 列出的路径被渲染；
// 不存在的 chapterId 直接触发 not-found.tsx，体验一致
export const dynamicParams = false;

export default function Page() {
  return <ChapterClient />;
}
