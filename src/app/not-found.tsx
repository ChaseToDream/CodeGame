import Link from "next/link";

/**
 * 全局 404 页面：当路由无法匹配时显示。
 * Next.js App Router 约定：not-found.tsx 可为服务端组件。
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-7xl mb-4 animate-floaty">🗺️</div>
      <h1 className="font-outfit text-4xl font-bold mb-3 gradient-text">
        404
      </h1>
      <h2 className="font-outfit text-xl font-bold mb-3 text-ink">
        这里的路还没铺好
      </h2>
      <p className="text-muted mb-8">
        你访问的页面不存在，或者已被移动。让我们一起回到正轨。
      </p>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
        >
          返回首页
        </Link>
        <Link
          href="/courses"
          className="px-6 py-3 rounded-lg border border-rule bg-bg2 text-ink font-semibold hover:border-accent transition"
        >
          浏览课程
        </Link>
      </div>
    </div>
  );
}
