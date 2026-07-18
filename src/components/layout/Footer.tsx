import Link from "next/link";

const FOOTER_LINKS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "产品",
    links: [
      { label: "课程", href: "/courses" },
      { label: "作品", href: "/builds" },
      { label: "社区", href: "/community" },
      { label: "博客", href: "/blog" },
    ],
  },
  {
    title: "资源",
    links: [
      { label: "仪表盘", href: "/dashboard" },
      { label: "世界", href: "/worlds" },
      { label: "设置", href: "/settings" },
    ],
  },
  {
    title: "公司",
    links: [
      // 三个链接差异化，避免都指向 /blog 造成重复
      { label: "关于我们", href: "/blog/meet-lumi-your-ai-coding-companion" },
      { label: "学习者故事", href: "/blog/from-barista-to-developer-marcos-story" },
      { label: "招聘", href: "/blog/30-nites-of-code-2026" },
    ],
  },
  {
    title: "联系我们",
    links: [
      { label: "Discord", href: "https://discord.gg/codegame", external: true },
      { label: "Twitter", href: "https://twitter.com/codegame", external: true },
      { label: "GitHub", href: "https://github.com/codegame", external: true },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-rule bg-bg2/60 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-pixel text-2xl text-accent mb-2">CodeGame</div>
            <p className="text-sm text-muted">
              最有趣且入门友好的学编程方式。
            </p>
          </div>
          {FOOTER_LINKS.map((section) => (
            <div key={section.title}>
              <h4 className="text-xs font-bold uppercase tracking-wider text-accent2 mb-3">
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.links.map((l) => (
                  <li key={l.label}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-muted hover:text-ink transition"
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-sm text-muted hover:text-ink transition"
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-rule flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} CodeGame. 保留所有权利。
          </p>
          <div className="flex items-center gap-4 text-muted">
            <span className="text-lg" title="Discord">💬</span>
            <span className="text-lg" title="Twitter">🐦</span>
            <span className="text-lg" title="GitHub">🐙</span>
            <span className="text-lg" title="YouTube">📺</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
