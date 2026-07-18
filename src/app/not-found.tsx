import Link from "next/link";

/**
 * 全局 404 页面：当路由无法匹配时显示。
 * 提供搜索建议、热门页面快捷入口和智能导航。
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:py-20 text-center">
      <div className="text-7xl mb-4 animate-floaty">🗺️</div>
      <h1 className="font-outfit text-4xl font-bold mb-3 gradient-text">
        404
      </h1>
      <h2 className="font-outfit text-xl font-bold mb-3 text-ink">
        这里的路还没铺好
      </h2>
      <p className="text-muted mb-8 max-w-md mx-auto">
        你访问的页面不存在，或者已被移动。试试下面的热门入口，或者返回首页重新出发。
      </p>

      {/* 快捷入口 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8 max-w-lg mx-auto">
        <QuickLink href="/" icon="🏠" label="首页" />
        <QuickLink href="/courses" icon="📚" label="课程" />
        <QuickLink href="/daily" icon="🎯" label="每日挑战" />
        <QuickLink href="/leaderboard" icon="🏆" label="排行榜" />
        <QuickLink href="/builds" icon="🎨" label="作品集" />
        <QuickLink href="/community" icon="💬" label="社区" />
      </div>

      {/* 主操作按钮 */}
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

      <p className="mt-10 text-[11px] text-muted/60">
        如果你认为这是一个错误，请通过社区反馈告诉我们。
      </p>
    </div>
  );
}

function QuickLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-4 py-3 rounded-xl border border-rule bg-bg2 text-sm font-medium text-ink hover:border-accent hover:bg-bg3 transition group"
    >
      <span className="text-lg group-hover:scale-110 transition-transform">
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}