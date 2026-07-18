"use client";

import { useEffect } from "react";

/**
 * Service Worker 注册组件。
 *
 * 仅在客户端执行，注册 PWA service worker 以支持离线访问。
 * 仅在 production 环境注册，开发环境跳过。
 */
export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[CodeGame] SW 注册成功，scope:", registration.scope);
      })
      .catch((error) => {
        console.warn("[CodeGame] SW 注册失败:", error);
      });
  }, []);

  return null;
}