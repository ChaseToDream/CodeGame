"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

export interface ShortcutHandler {
  key: string;
  /** 是否需要 Ctrl/Cmd 修饰键 */
  ctrl?: boolean;
  /** 是否需要 Shift 修饰键 */
  shift?: boolean;
  /** 是否需要 Alt 修饰键 */
  alt?: boolean;
  /** 描述 */
  description: string;
  /** 处理函数 */
  handler: () => void;
  /** 是否在输入框内也触发（默认 false，输入框中不触发） */
  enableInInput?: boolean;
}

/**
 * 全局快捷键管理 Hook。
 *
 * 注册全局键盘快捷键，自动过滤输入框中的按键事件。
 * 支持 Ctrl/Cmd、Shift、Alt 修饰键组合。
 *
 * 用法：
 * useGlobalShortcuts([
 *   { key: "g", ctrl: true, description: "全局搜索", handler: () => openSearch() },
 *   { key: "h", ctrl: true, description: "回到首页", handler: () => router.push("/") },
 * ]);
 */
export function useGlobalShortcuts(shortcuts: ShortcutHandler[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      const tagName = target.tagName?.toLowerCase();
      const isInput =
        tagName === "input" ||
        tagName === "textarea" ||
        tagName === "select" ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        // 输入框中默认不触发快捷键（除非明确指定 enableInInput）
        if (isInput && !shortcut.enableInInput) continue;

        // 检查修饰键
        const ctrlMatch = shortcut.ctrl
          ? event.ctrlKey || event.metaKey
          : !event.ctrlKey && !event.metaKey;
        const shiftMatch = shortcut.shift ? event.shiftKey : !event.shiftKey;
        const altMatch = shortcut.alt ? event.altKey : !event.altKey;

        if (
          event.key.toLowerCase() === shortcut.key.toLowerCase() &&
          ctrlMatch &&
          shiftMatch &&
          altMatch
        ) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.handler();
          return;
        }
      }
    },
    [shortcuts],
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * 应用级全局快捷键预设。
 * 包含常用的导航快捷键。
 */
export function useAppShortcuts() {
  const router = useRouter();

  useGlobalShortcuts([
    {
      key: "h",
      ctrl: true,
      description: "回到首页",
      handler: () => router.push("/"),
    },
    {
      key: "k",
      ctrl: true,
      description: "全局搜索",
      handler: () => {
        // 触发全局搜索（通过自定义事件）
        window.dispatchEvent(new CustomEvent("codegame:open-search"));
      },
    },
    {
      key: "d",
      ctrl: true,
      description: "切换主题",
      handler: () => {
        window.dispatchEvent(new CustomEvent("codegame:toggle-theme"));
      },
    },
    {
      key: "Escape",
      description: "关闭弹窗/面板",
      handler: () => {
        window.dispatchEvent(new CustomEvent("codegame:close-panels"));
      },
    },
    {
      key: "?",
      shift: true,
      description: "显示快捷键帮助",
      enableInInput: true,
      handler: () => {
        window.dispatchEvent(new CustomEvent("codegame:show-shortcuts"));
      },
    },
  ]);
}