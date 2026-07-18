"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalSearch } from "@/components/search/GlobalSearch";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { useAppShortcuts } from "@/hooks/useGlobalShortcuts";

export function Shell({ children }: { children: React.ReactNode }) {
  // 搜索面板状态提升到 Shell，便于 Navbar 触发 + GlobalSearch 监听
  const [searchOpen, setSearchOpen] = useState(false);
  // 快捷键帮助面板状态提升到 Shell，便于 Navbar 触发 + ShortcutsHelp 监听
  const [shortcutsOpen, setShortcutsOpen] = useState(false);

  // 注册应用级全局快捷键（Ctrl+H 回首页、Ctrl+K 搜索、Ctrl+D 切换主题等）
  useAppShortcuts();

  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar
        onOpenSearch={() => setSearchOpen(true)}
        onOpenShortcuts={() => setShortcutsOpen(true)}
      />
      <main id="main-content" className="flex-1" tabIndex={-1}>{children}</main>
      <Footer />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
      <ShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  );
}
