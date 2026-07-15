"use client";

import { useEffect, useState } from "react";
import { useUserStore } from "@/stores/user-store";

/**
 * 等待 Zustand persist 中间件从 localStorage 水合完成，
 * 避免 SSR 与客户端首屏不一致导致的 hydration mismatch。
 * 水合完成前显示骨架屏，避免数据闪烁。
 */
export function StoreHydration({ children }: { children?: React.ReactNode }) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // 如果已经水合（快速路径）
    if (useUserStore.persist.hasHydrated()) {
      setHydrated(true);
      return;
    }
    // 监听水合完成事件
    const unsub = useUserStore.persist.onFinishHydration(() => setHydrated(true));
    return unsub;
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-muted">加载中...</span>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
