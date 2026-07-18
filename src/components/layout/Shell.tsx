"use client";

import { useState } from "react";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { GlobalSearch } from "@/components/search/GlobalSearch";

export function Shell({ children }: { children: React.ReactNode }) {
  // 搜索面板状态提升到 Shell，便于 Navbar 触发 + GlobalSearch 监听
  const [searchOpen, setSearchOpen] = useState(false);
  return (
    <div className="relative z-10 flex min-h-screen flex-col">
      <Navbar onOpenSearch={() => setSearchOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  );
}
