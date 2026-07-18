/**
 * 全局加载状态：Next.js App Router 自动在页面切换时显示。
 * 提供骨架屏动画，避免白屏闪烁。
 */
export default function Loading() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-12 animate-pulse">
      {/* 标题骨架 */}
      <div className="mb-8">
        <div className="h-8 w-64 bg-bg3 rounded-lg mb-2" />
        <div className="h-4 w-96 bg-bg3 rounded" />
      </div>

      {/* 内容骨架 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl border border-rule bg-bg2 p-4">
            <div className="h-4 w-3/4 bg-bg3 rounded mb-3" />
            <div className="h-3 w-full bg-bg3 rounded mb-2" />
            <div className="h-3 w-2/3 bg-bg3 rounded mb-4" />
            <div className="h-8 w-24 bg-bg3 rounded-lg" />
          </div>
        ))}
      </div>
    </div>
  );
}