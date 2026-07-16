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

export default function Page() {
  return <ExerciseClient />;
}
