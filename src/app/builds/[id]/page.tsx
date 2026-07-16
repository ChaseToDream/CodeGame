import { builds as seedBuilds } from "@/data/builds";
import BuildDetailClient from "./BuildDetailClient";

// 预渲染所有种子作品，使其可被 CDN 缓存（必须在 server component 中导出）
export function generateStaticParams() {
  return seedBuilds.map((b) => ({ id: b.id }));
}

export default function Page() {
  return <BuildDetailClient />;
}
