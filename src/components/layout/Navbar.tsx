"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { cn } from "@/lib/utils";
import { XPBadge } from "@/components/game/XPBadge";
import { StreakCounter } from "@/components/game/StreakCounter";

const NAV_LINKS = [
  { href: "/courses", label: "课程" },
  { href: "/builds", label: "作品" },
  { href: "/community", label: "社区" },
  { href: "/blog", label: "博客" },
];

export function Navbar() {
  const pathname = usePathname();
  const user = useUserStore((s) => s.user);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || (href !== "/" && pathname?.startsWith(href));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-bg/85 backdrop-blur-md border-b border-rule shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="font-pixel text-2xl text-accent group-hover:text-accent2 transition-colors">
            CodeGame
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={cn(
                "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive(l.href)
                  ? "text-accent bg-bg3"
                  : "text-muted hover:text-ink hover:bg-bg2",
              )}
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <XPBadge xp={user.xpTotal} level={user.level} size="sm" />
          {user.streakDays > 0 && (
            <StreakCounter
              days={user.streakDays}
              lastActiveDate={user.lastActiveDate}
              size="sm"
            />
          )}
          <Link
            href="/dashboard"
            className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-accent/50 hover:ring-accent transition"
            style={{ background: user.avatarGradient }}
            aria-label="仪表盘"
          >
            <span className="sr-only">{user.username}</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md text-muted hover:text-ink hover:bg-bg2 transition"
              aria-label="菜单"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2 4h12v2H2zM2 7h12v2H2zM2 10h12v2H2z" />
              </svg>
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-44 z-20 bg-bg2 border border-rule rounded-lg shadow-card overflow-hidden">
                  <Link href="/dashboard" className="block px-4 py-2.5 text-sm text-ink hover:bg-bg3">
                    仪表盘
                  </Link>
                  <Link href="/worlds" className="block px-4 py-2.5 text-sm text-ink hover:bg-bg3">
                    世界
                  </Link>
                  <Link href={`/u/${encodeURIComponent(user.username)}`} className="block px-4 py-2.5 text-sm text-ink hover:bg-bg3">
                    我的资料
                  </Link>
                  <Link href="/settings" className="block px-4 py-2.5 text-sm text-ink hover:bg-bg3">
                    设置
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 text-ink"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="切换菜单"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            {mobileOpen ? (
              <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="2" />
            ) : (
              <path d="M3 6h16v2H3zM3 10h16v2H3zM3 14h16v2H3z" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-bg2/95 backdrop-blur-md border-t border-rule">
          <div className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "block px-3 py-2.5 rounded-md text-base font-medium",
                  isActive(l.href) ? "text-accent bg-bg3" : "text-ink hover:bg-bg3",
                )}
              >
                {l.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-rule mt-2">
              <Link href="/dashboard" className="block px-3 py-2.5 text-ink">
                仪表盘
              </Link>
              <Link href="/worlds" className="block px-3 py-2.5 text-ink">
                世界
              </Link>
              <Link href={`/u/${encodeURIComponent(user.username)}`} className="block px-3 py-2.5 text-ink">
                我的资料
              </Link>
              <Link href="/settings" className="block px-3 py-2.5 text-ink">
                设置
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
