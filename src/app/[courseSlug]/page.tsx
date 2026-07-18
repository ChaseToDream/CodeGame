import { courses } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

// 预渲染所有课程详情页（必须在 server component 中导出）
export function generateStaticParams() {
  return courses.map((c) => ({ courseSlug: c.slug }));
}

// 仅允许 generateStaticParams 列出的路径被渲染；
// 不存在的 courseSlug 直接触发 not-found.tsx，避免显示组件内的"未找到课程"
export const dynamicParams = false;

export default function Page() {
  return <CourseDetailClient />;
}
