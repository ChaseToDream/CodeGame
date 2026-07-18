"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 全局错误边界：捕获子树抛出的运行时错误，提供重试与回退入口。
 * 包含错误信息折叠展示、恢复建议和快捷导航。
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("[CodeGame] 渲染错误：", error);
  }, [error]);

  const errorMessage = error?.message || "发生了一个未知错误";
  const isNetworkError =
    errorMessage.includes("fetch") ||
    errorMessage.includes("network") ||
    errorMessage.includes("NetworkError");

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-6xl mb-4 animate-floaty">💥</div>
      <h1 className="font-outfit text-3xl font-bold mb-3">
        哎呀，出了点小问题
      </h1>
      <p className="text-muted mb-4">
        页面在渲染时遇到了一个错误。你可以尝试以下方法恢复。
      </p>

      {/* 恢复建议 */}
      <div className="rounded-xl border border-rule bg-bg2 p-4 mb-6 text-left max-w-sm mx-auto">
        <h2 className="font-outfit text-xs font-bold text-ink uppercase tracking-wide mb-2">
          恢复建议
        </h2>
        <ul className="space-y-1.5 text-sm text-muted">
          <li className="flex items-start gap-2">
            <span className="text-accent shrink-0 mt-0.5">1.</span>
            <span>点击「重试」按钮重新加载页面内容</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent shrink-0 mt-0.5">2.</span>
            <span>返回首页或浏览其他页面</span>
          </li>
          {isNetworkError && (
            <li className="flex items-start gap-2">
              <span className="text-accent shrink-0 mt-0.5">3.</span>
              <span>检查网络连接后刷新页面</span>
            </li>
          )}
          <li className="flex items-start gap-2">
            <span className="text-accent shrink-0 mt-0.5">
              {isNetworkError ? "4." : "3."}
            </span>
            <span>如果问题持续，尝试清除浏览器缓存</span>
          </li>
        </ul>
      </div>

      {/* 错误详情（可折叠） */}
      <div className="mb-6">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-[11px] text-muted/60 hover:text-muted transition font-mono"
        >
          {showDetails ? "隐藏" : "查看"}错误详情
        </button>
        {showDetails && (
          <div className="mt-2 mx-auto max-w-md">
            <div className="rounded-lg bg-bg3 border border-rule p-3 text-left">
              {error.digest && (
                <p className="text-[10px] text-muted/60 font-mono mb-1">
                  错误编号：{error.digest}
                </p>
              )}
              <p className="text-[11px] text-muted font-mono break-all leading-relaxed">
                {errorMessage}
              </p>
              {error.stack && (
                <details className="mt-2">
                  <summary className="text-[10px] text-muted/60 cursor-pointer hover:text-muted">
                    堆栈跟踪
                  </summary>
                  <pre className="mt-1 text-[9px] text-muted/60 font-mono overflow-auto max-h-32 whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </details>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 flex items-center justify-center gap-3 flex-wrap">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
        >
          重试
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-rule bg-bg2 text-ink font-semibold hover:border-accent transition"
        >
          返回首页
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg border border-rule bg-bg2 text-ink font-semibold hover:border-accent transition"
        >
          刷新页面
        </button>
      </div>
    </div>
  );
}