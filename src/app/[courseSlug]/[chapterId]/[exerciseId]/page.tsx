import { courses } from "@/data/courses";
import ExerciseClient from "./ExerciseClient";

// 预渲染所有课程的所有练习页，使其可被 CDN 缓存（必须在 server component 中导出）
export function generateStaticParams() {
  return courses.flatMap((c) =>
    c.chapters.flatMap((ch) =>
      ch.exercises.map((ex) => ({
        courseSlug: c.slug,
        chapterId: ch.id,
        exerciseId: ex.id,
      })),
    ),
  );
}

// 仅允许 generateStaticParams 列出的路径被渲染；
// 不存在的 exerciseId（如 /python/ch-1/ex-1）直接触发 not-found.tsx，
// 避免 ExerciseClient 内部显示"未找到练习"造成体验不一致
export const dynamicParams = false;

export default function Page() {
  return <ExerciseClient />;
}
