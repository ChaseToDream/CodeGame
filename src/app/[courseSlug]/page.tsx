import type { Metadata } from "next";
import { courses } from "@/data/courses";
import CourseDetailClient from "./CourseDetailClient";

// 预渲染所有课程详情页（必须在 server component 中导出）
export function generateStaticParams() {
  return courses.map((c) => ({ courseSlug: c.slug }));
}

// 仅允许 generateStaticParams 列出的路径被渲染；
// 不存在的 courseSlug 直接触发 not-found.tsx，避免显示组件内的"未找到课程"
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: { courseSlug: string };
}): Promise<Metadata> {
  const course = courses.find((c) => c.slug === params.courseSlug);
  if (!course) {
    return { title: "课程未找到 · CodeGame" };
  }
  return {
    title: `${course.title} · CodeGame`,
    description: course.description,
    openGraph: {
      title: `${course.title} · CodeGame`,
      description: course.description,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${course.title} · CodeGame`,
      description: course.description,
    },
  };
}

export default function Page() {
  return <CourseDetailClient />;
}
