"use client";

import { useEffect } from "react";
import Link from "next/link";

/**
 * 全局错误边界：捕获子树抛出的运行时错误，提供重试与回退入口。
 * Next.js App Router 约定：error.tsx 必须是客户端组件且接收 error/reset props。
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // 将错误上报到控制台（生产环境可替换为 Sentry/LogRocket 等）
    console.error("[CodeGame] 渲染错误：", error);
  }, [error]);

  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-6xl mb-4 animate-floaty">💥</div>
      <h1 className="font-outfit text-3xl font-bold mb-3">
        哎呀，出了点小问题
      </h1>
      <p className="text-muted mb-2">
        页面在渲染时遇到了一个错误。你可以尝试重新加载，或返回首页继续探索。
      </p>
      {error.digest && (
        <p className="text-[10px] text-muted/60 mb-6 font-mono">
          错误编号：{error.digest}
        </p>
      )}
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
      </div>
    </div>
  );
}
