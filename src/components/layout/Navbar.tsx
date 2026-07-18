"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";
import { XPBadge } from "@/components/game/XPBadge";
import { StreakCounter } from "@/components/game/StreakCounter";
import { NotificationCenter } from "@/components/common/NotificationCenter";
import { ThemeToggle } from "@/components/common/ThemeToggle";

const NAV_LINKS = [
  { href: "/courses", label: "课程" },
  { href: "/daily", label: "每日挑战" },
  { href: "/leaderboard", label: "排行榜" },
  { href: "/builds", label: "作品" },
  { href: "/community", label: "社区" },
  { href: "/blog", label: "博客" },
];

interface NavbarProps {
  /** 顶部搜索按钮点击回调，由 Shell 提供以打开 GlobalSearch */
  onOpenSearch?: () => void;
  /** 快捷键帮助按钮点击回调，由 Shell 提供以打开 ShortcutsHelp */
  onOpenShortcuts?: () => void;
}

export function Navbar({ onOpenSearch, onOpenShortcuts }: NavbarProps) {
  const pathname = usePathname();
  // 字段级订阅：当 user 的其他字段（如 bio）变化时不触发 Navbar 重渲染
  const { xpTotal, level, streakDays, lastActiveDate, avatarGradient, username } = useUserStore(
    useShallow((s) => ({
      xpTotal: s.user.xpTotal,
      level: s.user.level,
      streakDays: s.user.streakDays,
      lastActiveDate: s.user.lastActiveDate,
      avatarGradient: s.user.avatarGradient,
      username: s.user.username,
    })),
  );
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

  // Escape 键关闭桌面/移动菜单，符合 WAI-ARIA Authoring Practices
  useEffect(() => {
    if (!menuOpen && !mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen, mobileOpen]);

  // 移动菜单打开时锁定 body 滚动，避免背景滚动穿透
  useEffect(() => {
    if (!mobileOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileOpen]);

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
          {/* 全局搜索触发按钮：与 ⌘K 快捷键等价 */}
          <button
            type="button"
            onClick={() => onOpenSearch?.()}
            className="ml-2 flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs text-muted hover:text-ink hover:bg-bg2 border border-rule transition"
            aria-label="全局搜索"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
              <path d="M7 2a5 5 0 104 8.06l3.27 3.27a.6.6 0 00.85-.85L11.85 9.5A5 5 0 007 2zm0 1.2a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6z" />
            </svg>
            <span className="hidden lg:inline">搜索</span>
            <kbd className="hidden lg:inline px-1 py-0.5 rounded border border-rule bg-bg3 text-[10px] text-muted/80">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          {/* 快捷键帮助按钮：与 `?` 键等价。仅在桌面端显示，避免移动端按钮拥挤 */}
          <button
            type="button"
            onClick={() => onOpenShortcuts?.()}
            className="hidden lg:flex items-center justify-center h-8 w-8 rounded-md text-xs text-muted hover:text-ink hover:bg-bg2 border border-rule transition"
            aria-label="键盘快捷键"
            title="键盘快捷键 (?)"
          >
            ?
          </button>
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          <NotificationCenter />
          <XPBadge xp={xpTotal} level={level} size="sm" />
          {streakDays > 0 && (
            <StreakCounter
              days={streakDays}
              lastActiveDate={lastActiveDate}
              size="sm"
            />
          )}
          <Link
            href="/dashboard"
            className="relative h-9 w-9 rounded-full overflow-hidden ring-2 ring-accent/50 hover:ring-accent transition"
            style={{ background: avatarGradient }}
            aria-label={`仪表盘 - ${username}`}
          >
            <span className="sr-only">进入仪表盘</span>
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-md text-muted hover:text-ink hover:bg-bg2 transition"
              aria-label="菜单"
              aria-expanded={menuOpen}
              aria-haspopup="menu"
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
                  <Link href={`/u/${encodeURIComponent(username)}`} className="block px-4 py-2.5 text-sm text-ink hover:bg-bg3">
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
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
        >
          <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
            {mobileOpen ? (
              <path d="M5 5l12 12M17 5L5 17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            ) : (
              <path d="M3 6h16v2H3zM3 10h16v2H3zM3 14h16v2H3z" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden bg-bg2/95 backdrop-blur-md border-t border-rule">
          <div className="px-4 py-3 space-y-1">
            {/* 移动端展示游戏化数据，与桌面端右上角保持一致 */}
            <div className="flex items-center gap-3 py-2 mb-1 border-b border-rule">
              <XPBadge xp={xpTotal} level={level} size="sm" />
              {streakDays > 0 && (
                <StreakCounter
                  days={streakDays}
                  lastActiveDate={lastActiveDate}
                  size="sm"
                />
              )}
            </div>
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
            {/* 移动端搜索按钮：移动端无 ⌘K，提供显式入口 */}
            <button
              type="button"
              onClick={() => onOpenSearch?.()}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-ink hover:bg-bg3 transition"
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
                <path d="M7 2a5 5 0 104 8.06l3.27 3.27a.6.6 0 00.85-.85L11.85 9.5A5 5 0 007 2zm0 1.2a3.8 3.8 0 110 7.6 3.8 3.8 0 010-7.6z" />
              </svg>
              搜索课程、作品、帖子…
            </button>
            {/* 移动端快捷键入口：移动端无 `?` 物理键，提供显式入口 */}
            <button
              type="button"
              onClick={() => {
                onOpenShortcuts?.();
                setMobileOpen(false);
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-md text-base font-medium text-ink hover:bg-bg3 transition"
            >
              <span className="text-base" aria-hidden="true">⌨️</span>
              键盘快捷键
            </button>
            <div className="pt-2 border-t border-rule mt-2">
              <Link href="/dashboard" className="block px-3 py-2.5 text-ink">
                仪表盘
              </Link>
              <Link href="/worlds" className="block px-3 py-2.5 text-ink">
                世界
              </Link>
              <Link href={`/u/${encodeURIComponent(username)}`} className="block px-3 py-2.5 text-ink">
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
