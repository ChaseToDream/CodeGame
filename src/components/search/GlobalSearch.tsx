"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useShallow } from "zustand/react/shallow";
import { courses } from "@/data/courses";
import { builds as seedBuilds } from "@/data/builds";
import { communityPosts as seedPosts } from "@/data/posts";
import { blogPosts } from "@/data/blog";
import { useUserStore } from "@/stores/user-store";
import { cn } from "@/lib/utils";
import {
  searchEntries,
  normalizeSearch,
  type SearchEntry,
  type SearchEntryType,
} from "@/lib/search";

/**
 * 全局搜索面板（命令面板风格）。
 *
 * 设计要点：
 * 1. 快捷键 Cmd/Ctrl + K 唤起，Escape 关闭。与 GitHub / Linear / Notion 体验一致。
 * 2. 索引在打开时构建一次：合并种子数据 + store 内本地数据（用户自建的作品/帖子）
 *    避免每次按键都重算。关闭后下次打开重新构建，从而拾取用户新建的条目。
 * 3. 键盘导航：↑↓ 选择条目，Enter 跳转选中条目。
 * 4. 路由跳转后自动关闭面板。
 */

const TYPE_META: Record<SearchEntryType, { label: string; icon: string }> = {
  course: { label: "课程", icon: "🎓" },
  build: { label: "作品", icon: "🌱" },
  post: { label: "帖子", icon: "💬" },
  blog: { label: "博客", icon: "📝" },
};

/** 类型分组的展示顺序，便于命中混合类型时按"课程→作品→帖子→博客"稳定排序 */
const TYPE_ORDER: SearchEntryType[] = ["course", "build", "post", "blog"];

interface GlobalSearchProps {
  /** 受控模式：父组件持有 open 状态，便于通过按钮触发。
   *  不传则使用内部 state + 全局快捷键。 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function GlobalSearch({ open: openProp, onOpenChange }: GlobalSearchProps) {
  const router = useRouter();
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (onOpenChange) onOpenChange(v);
      else setInternalOpen(v);
    },
    [onOpenChange],
  );
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 订阅 store 中本地数据（用户自己创建的 builds / posts）。
  // useShallow 避免无意义 re-render。
  const { localBuilds, localPosts } = useUserStore(
    useShallow((s) => ({
      localBuilds: s.builds,
      localPosts: s.posts,
    })),
  );

  /** 构建搜索索引：种子数据 + store 中本地数据，按 id 去重（本地优先）。
   *  仅在面板打开时构建一次，避免每次按键重算。 */
  const index = useMemo<SearchEntry[]>(() => {
    if (!open) return [];
    const seen = new Set<string>();
    const out: SearchEntry[] = [];

    const push = (e: SearchEntry) => {
      const key = `${e.type}:${e.id}`;
      if (seen.has(key)) return;
      seen.add(key);
      out.push(e);
    };

    for (const c of courses) {
      push({
        type: "course",
        id: c.id,
        title: c.title,
        subtitle: c.description,
        href: `/${c.slug}`,
        icon: c.icon,
        keywords: [...c.tags, ...c.learningJourney, c.difficulty].join(" "),
      });
    }

    // 本地作品优先于种子，让用户自己创建的草稿/发布也能搜到
    for (const b of [...localBuilds, ...seedBuilds]) {
      push({
        type: "build",
        id: b.id,
        title: b.title,
        subtitle: b.description,
        href: `/builds/${b.id}`,
        icon: "🌱",
        keywords: [b.authorName, b.isPublished ? "已发布" : "草稿"].join(" "),
      });
    }

    for (const p of [...localPosts, ...seedPosts]) {
      push({
        type: "post",
        id: p.id,
        title: p.title,
        subtitle: p.content.slice(0, 80),
        href: `/community/${p.category}/${p.id}`,
        icon: "💬",
        keywords: [p.authorName, p.category].join(" "),
      });
    }

    for (const bp of blogPosts) {
      push({
        type: "blog",
        id: bp.id,
        title: bp.title,
        subtitle: bp.excerpt,
        href: `/blog/${bp.slug}`,
        icon: "📝",
        keywords: [bp.author, bp.category].join(" "),
      });
    }

    return out;
  }, [open, localBuilds, localPosts]);

  const results = useMemo(
    () => searchEntries(index, query, 20),
    [index, query],
  );

  // 打开时聚焦输入框、重置 query 与选中项
  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      // 微任务里聚焦，确保 input 已挂载
      const id = requestAnimationFrame(() => inputRef.current?.focus());
      return () => cancelAnimationFrame(id);
    }
  }, [open]);

  // 关闭时锁定/恢复 body 滚动，避免背景滚动穿透
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 全局快捷键 Cmd/Ctrl + K 唤起。
  // 用 ref 跟踪 open 避免每次 open 变化重新绑定 listener。
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(!openRef.current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // query 变化时重置选中项到第一个
  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  // 选中项滚动入视口
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-idx="${activeIdx}"]`,
    );
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx, open]);

  const navigateTo = useCallback(
    (entry: SearchEntry | undefined) => {
      if (!entry) return;
      setOpen(false);
      router.push(entry.href);
    },
    [router, setOpen],
  );

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      navigateTo(results[activeIdx]);
    }
  };

  if (!open) return null;

  // 按类型分组以保持稳定的展示顺序（课程→作品→帖子→博客）
  const grouped = TYPE_ORDER.map((t) => ({
    type: t,
    items: results.filter((r) => r.type === t),
  })).filter((g) => g.items.length > 0);

  // 计算每个分组的起始 idx，便于键盘导航高亮
  let runningIdx = 0;
  const groupsWithOffset = grouped.map((g) => {
    const offset = runningIdx;
    runningIdx += g.items.length;
    return { ...g, offset };
  });

  return (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center p-4 pt-[10vh] bg-black/60 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === e.currentTarget) setOpen(false);
      }}
      role="presentation"
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="全局搜索"
        className="w-full max-w-xl bg-bg2 border border-rule rounded-xl shadow-card overflow-hidden"
      >
        {/* 输入区 */}
        <div className="flex items-center gap-2 px-4 border-b border-rule">
          <span className="text-muted text-sm" aria-hidden="true">🔍</span>
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="搜索课程、作品、帖子、博客…"
            className="flex-1 bg-transparent py-3.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none"
            aria-label="搜索关键词"
            aria-autocomplete="list"
            aria-controls="search-results"
            aria-activedescendant={
              results[activeIdx] ? `search-item-${activeIdx}` : undefined
            }
          />
          <kbd className="px-1.5 py-0.5 rounded border border-rule bg-bg3 text-[10px] text-muted">
            ESC
          </kbd>
        </div>

        {/* 结果区 */}
        <div
          ref={listRef}
          id="search-results"
          className="max-h-[60vh] overflow-y-auto"
          role="listbox"
        >
          {normalizeSearch(query) === "" ? (
            <div className="p-8 text-center text-xs text-muted">
              <div className="text-3xl mb-2" aria-hidden="true">⚡</div>
              输入关键词开始搜索，覆盖课程、作品、帖子与博客。
              <div className="mt-3 text-[10px] text-muted/70">
                快捷键：<kbd className="px-1 py-0.5 rounded border border-rule bg-bg3">↑</kbd>{" "}
                <kbd className="px-1 py-0.5 rounded border border-rule bg-bg3">↓</kbd> 选择 ·{" "}
                <kbd className="px-1 py-0.5 rounded border border-rule bg-bg3">Enter</kbd> 跳转 ·{" "}
                <kbd className="px-1 py-0.5 rounded border border-rule bg-bg3">Esc</kbd> 关闭
              </div>
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-xs text-muted">
              <div className="text-3xl mb-2" aria-hidden="true">🤔</div>
              没有找到与 &ldquo;{query}&rdquo; 相关的结果。
            </div>
          ) : (
            groupsWithOffset.map((g) => (
              <div key={g.type}>
                <div className="px-3 py-1.5 bg-bg3/50 text-[10px] uppercase tracking-wider text-muted font-bold border-b border-rule">
                  {TYPE_META[g.type].icon} {TYPE_META[g.type].label}
                  <span className="ml-1.5 text-muted/60">· {g.items.length}</span>
                </div>
                {g.items.map((item, i) => {
                  const idx = g.offset + i;
                  const active = idx === activeIdx;
                  return (
                    <Link
                      key={`${item.type}-${item.id}`}
                      id={`search-item-${idx}`}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      data-idx={idx}
                      role="option"
                      aria-selected={active}
                      onMouseEnter={() => setActiveIdx(idx)}
                      className={cn(
                        "flex items-start gap-3 px-3 py-2.5 border-b border-rule/50 transition",
                        active ? "bg-accent/10" : "hover:bg-bg3/50",
                      )}
                    >
                      <span className="text-lg shrink-0 mt-0.5" aria-hidden="true">
                        {item.icon}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className={cn(
                          "text-sm font-medium truncate",
                          active ? "text-accent" : "text-ink",
                        )}>
                          {item.title}
                        </div>
                        {item.subtitle && (
                          <div className="text-[11px] text-muted line-clamp-1 mt-0.5">
                            {item.subtitle}
                          </div>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* 底部提示 */}
        <div className="px-3 py-2 border-t border-rule bg-bg3/30 flex items-center justify-between text-[10px] text-muted">
          <span>共 {index.length} 条索引</span>
          <span>按住 <kbd className="px-1 py-0.5 rounded border border-rule bg-bg2">⌘K</kbd> 随时唤起</span>
        </div>
      </div>
    </div>
  );
}
