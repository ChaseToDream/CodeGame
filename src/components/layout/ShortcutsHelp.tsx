"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * 快捷键帮助面板。
 *
 * 设计要点：
 * 1. 全局监听 `?` 键唤起，Escape 关闭。仅在非输入态时触发，避免影响打字。
 * 2. 通过 body 滚动锁定 + 背景点击关闭，与 GlobalSearch 体验一致。
 * 3. 快捷键清单在此处单点维护，便于全局一致性。
 */

interface ShortcutItem {
  keys: string[];
  description: string;
}

interface ShortcutGroup {
  title: string;
  icon: string;
  items: ShortcutItem[];
}

const SHORTCUT_GROUPS: ShortcutGroup[] = [
  {
    title: "全局",
    icon: "🌐",
    items: [
      { keys: ["Ctrl", "K"], description: "唤起全局搜索（课程/作品/帖子/博客）" },
      { keys: ["Ctrl", "H"], description: "回到首页" },
      { keys: ["Ctrl", "D"], description: "切换明暗主题" },
      { keys: ["?"], description: "打开本快捷键帮助面板" },
      { keys: ["Esc"], description: "关闭当前弹层/面板" },
    ],
  },
  {
    title: "搜索面板",
    icon: "🔍",
    items: [
      { keys: ["↑"], description: "上一个结果" },
      { keys: ["↓"], description: "下一个结果" },
      { keys: ["Enter"], description: "跳转到选中条目" },
    ],
  },
  {
    title: "代码编辑器",
    icon: "⌨️",
    items: [
      { keys: ["Ctrl", "Enter"], description: "运行代码（练习页）" },
      { keys: ["Ctrl", "S"], description: "保存代码快照（练习页，阻止浏览器默认保存）" },
      { keys: ["Tab"], description: "代码缩进" },
    ],
  },
  {
    title: "页面导航",
    icon: "🧭",
    items: [
      { keys: ["Ctrl", "1"], description: "跳转到课程页" },
      { keys: ["Ctrl", "2"], description: "跳转到每日挑战" },
      { keys: ["Ctrl", "3"], description: "跳转到作品集" },
      { keys: ["Ctrl", "4"], description: "跳转到社区" },
    ],
  },
];

interface ShortcutsHelpProps {
  /** 受控模式：父组件持有 open 状态。不传则使用内部 state + 全局快捷键。 */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * 判断当前焦点是否在可编辑元素上，决定 `?` 是否应被忽略。
 * 避免用户输入 `?` 字符时被劫持。
 */
function isEditingTarget(el: EventTarget | null): boolean {
  if (!(el instanceof HTMLElement)) return false;
  const tag = el.tagName.toLowerCase();
  if (tag === "input" || tag === "textarea" || tag === "select") return true;
  return el.isContentEditable;
}

export function ShortcutsHelp({ open: openProp, onOpenChange }: ShortcutsHelpProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = openProp ?? internalOpen;
  const setOpen = useCallback(
    (v: boolean) => {
      if (onOpenChange) onOpenChange(v);
      else setInternalOpen(v);
    },
    [onOpenChange],
  );

  // 用 ref 跟踪 open 避免每次 open 变化重新绑定 listener
  const openRef = useRef(open);
  openRef.current = open;

  // 全局 `?` 快捷键：非输入态时切换面板
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "?") return;
      if (isEditingTarget(e.target)) return;
      // Shift+/ 在大多数键盘布局上产出 `?`；这里只关心 key，不依赖 shiftKey
      e.preventDefault();
      setOpen(!openRef.current);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  // Esc 关闭（与 GlobalSearch 体验一致）
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, setOpen]);

  // 关闭时锁定/恢复 body 滚动
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

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
        aria-label="快捷键帮助"
        className="w-full max-w-lg bg-bg2 border border-rule rounded-xl shadow-card overflow-hidden animate-slideUp"
      >
        {/* 头部 */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-rule">
          <h2 className="font-outfit text-lg font-bold flex items-center gap-2">
            <span aria-hidden="true">⌨️</span> 键盘快捷键
          </h2>
          <button
            onClick={() => setOpen(false)}
            className="text-muted hover:text-ink text-xl leading-none px-2"
            aria-label="关闭"
          >
            ✕
          </button>
        </div>

        {/* 快捷键分组 */}
        <div className="max-h-[60vh] overflow-y-auto p-5 space-y-6">
          {SHORTCUT_GROUPS.map((group) => (
            <div key={group.title}>
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted mb-2 flex items-center gap-1.5">
                <span aria-hidden="true">{group.icon}</span>
                {group.title}
              </h3>
              <ul className="space-y-1.5">
                {group.items.map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center justify-between gap-3 py-1.5 px-2 rounded hover:bg-bg3/40 transition"
                  >
                    <span className="text-sm text-ink">{item.description}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      {item.keys.map((k, j) => (
                        <span key={j} className="flex items-center gap-1">
                          {j > 0 && <span className="text-[10px] text-muted">+</span>}
                          <kbd className="px-2 py-0.5 rounded border border-rule bg-bg3 text-[11px] text-ink font-mono min-w-[1.5rem] text-center">
                            {k}
                          </kbd>
                        </span>
                      ))}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* 底部提示 */}
        <div className="px-5 py-3 border-t border-rule bg-bg3/30 text-[11px] text-muted text-center">
          随时按 <kbd className="px-1.5 py-0.5 rounded border border-rule bg-bg2 font-mono">?</kbd> 重新打开此面板
        </div>
      </div>
    </div>
  );
}
