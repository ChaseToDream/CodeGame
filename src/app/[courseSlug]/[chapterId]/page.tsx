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

export default function Page() {
  return <ChapterClient />;
}
