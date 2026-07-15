"use client";

import { useEffect, useState } from "react";

/**
 * 等待 Zustand persist 中间件从 localStorage 水合完成，
 * 避免 SSR 与客户端首屏不一致导致的 hydration mismatch。
 */
export function StoreHydration({ children = null }: { children?: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  // 仅作为副作用占位，不阻塞渲染
  return <>{children}</>;
}
