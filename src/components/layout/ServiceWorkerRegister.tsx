"use client";

import { useEffect, useState, useCallback } from "react";

/**
 * Service Worker 注册组件。
 *
 * 仅在客户端执行，注册 PWA service worker 以支持离线访问。
 * 仅在 production 环境注册，开发环境跳过。
 * 支持 SW 更新检测与用户提示。
 */
export function ServiceWorkerRegister() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [swRegistration, setSwRegistration] = useState<ServiceWorkerRegistration | null>(null);

  /**
   * 监听 SW 发送的消息（如 SW_UPDATED）
   */
  const handleMessage = useCallback((event: MessageEvent) => {
    if (event.data?.type === "SW_UPDATED") {
      console.log("[CodeGame] SW 已更新到版本:", event.data.version);
    }
  }, []);

  /**
   * 检测是否有等待中的 SW 更新
   */
  const checkForUpdate = useCallback((registration: ServiceWorkerRegistration) => {
    // 注册时已有等待中的 SW
    if (registration.waiting) {
      setUpdateAvailable(true);
      setSwRegistration(registration);
      return;
    }

    // 监听新的 SW 安装完成
    registration.addEventListener("updatefound", () => {
      const newWorker = registration.installing;
      if (!newWorker) return;

      newWorker.addEventListener("statechange", () => {
        if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
          setUpdateAvailable(true);
          setSwRegistration(registration);
        }
      });
    });
  }, []);

  /**
   * 应用更新：通知等待中的 SW 跳过等待，然后刷新页面
   */
  const applyUpdate = useCallback(() => {
    if (!swRegistration?.waiting) {
      window.location.reload();
      return;
    }
    swRegistration.waiting.postMessage({ type: "SKIP_WAITING" });

    // 监听 SW 变为激活状态后刷新
    const refreshOnActivate = () => {
      if (navigator.serviceWorker.controller) {
        window.location.reload();
      }
    };
    swRegistration.waiting.addEventListener("statechange", (e) => {
      if ((e.target as ServiceWorker)?.state === "activated") {
        refreshOnActivate();
      }
    });

    // 安全回退：1 秒后强制刷新
    setTimeout(refreshOnActivate, 1000);
  }, [swRegistration]);

  /**
   * 关闭更新提示
   */
  const dismissUpdate = useCallback(() => {
    setUpdateAvailable(false);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    window.addEventListener("message", handleMessage);

    navigator.serviceWorker
      .register("/sw.js")
      .then((registration) => {
        console.log("[CodeGame] SW 注册成功，scope:", registration.scope);
        checkForUpdate(registration);

        // 定期检查更新（每 60 分钟）
        const interval = setInterval(() => {
          registration.update().catch(() => {
            // 更新检查失败静默处理
          });
        }, 60 * 60 * 1000);

        return () => clearInterval(interval);
      })
      .catch((error) => {
        console.warn("[CodeGame] SW 注册失败:", error);
      });

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [handleMessage, checkForUpdate]);

  return (
    <>
      {/* SW 更新提示横幅 */}
      {updateAvailable && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-5 py-3 rounded-xl bg-bg2 border border-accent/40 shadow-card animate-slideUp">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔄</span>
            <div>
              <p className="text-sm font-semibold text-ink">有新版本可用</p>
              <p className="text-[11px] text-muted">刷新页面以获取最新功能和修复</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={applyUpdate}
              className="px-3 py-1.5 rounded-lg bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition"
            >
              立即更新
            </button>
            <button
              onClick={dismissUpdate}
              className="px-3 py-1.5 rounded-lg border border-rule text-muted text-xs hover:text-ink transition"
            >
              稍后
            </button>
          </div>
        </div>
      )}
    </>
  );
}