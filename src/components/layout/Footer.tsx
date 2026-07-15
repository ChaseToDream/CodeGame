import Link from "next/link";

const FOOTER_LINKS: { title: string; links: { label: string; href: string }[] }[] = [
  {
    title: "Product",
    links: [
      { label: "Courses", href: "/courses" },
      { label: "Builds", href: "/builds" },
      { label: "Community", href: "/community" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Worlds", href: "/worlds" },
      { label: "Settings", href: "/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/blog" },
      { label: "Learner Stories", href: "/blog" },
      { label: "Careers", href: "/community" },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Discord", href: "/community" },
      { label: "Twitter", href: "/community" },
      { label: "GitHub", href: "/builds" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-rule bg-bg2/60 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="font-pixel text-2xl text-accent mb-2">Codédex</div>
            <p className="text-sm text-muted">
              The most fun and beginner-friendly way to learn to code.
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
                    <Link
                      href={l.href}
                      className="text-sm text-muted hover:text-ink transition"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 pt-6 border-t border-rule flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted">
            © {new Date().getFullYear()} Codédex Clone. Built for educational purposes.
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
