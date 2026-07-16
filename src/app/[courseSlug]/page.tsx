import { courses } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

// 预渲染所有课程详情页（必须在 server component 中导出）
export function generateStaticParams() {
  return courses.map((c) => ({ courseSlug: c.slug }));
}

export default function Page() {
  return <CourseDetailClient />;
}
