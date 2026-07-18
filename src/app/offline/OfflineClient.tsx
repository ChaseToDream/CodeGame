"use client";

import Link from "next/link";

/**
 * 离线页面客户端组件：包含交互逻辑（重新连接按钮）。
 * 从 page.tsx 拆分出来，因为 Server Component 不能包含 onClick 等事件处理器。
 */
export function OfflineClient() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-20 text-center">
      <div className="text-7xl mb-4 animate-floaty">📡</div>
      <h1 className="font-outfit text-3xl font-bold mb-3 gradient-text">
        你已离线
      </h1>
      <p className="text-muted mb-4">
        当前没有网络连接，但你仍然可以访问之前浏览过的内容。
      </p>
      <div className="rounded-xl border border-rule bg-bg2 p-5 mb-6 text-left">
        <h2 className="font-outfit text-sm font-bold text-ink mb-3">
          离线可用功能
        </h2>
        <ul className="space-y-2 text-sm text-muted">
          <li className="flex items-center gap-2">
            <span className="text-success">✓</span> 浏览已缓存的课程和文章
          </li>
          <li className="flex items-center gap-2">
            <span className="text-success">✓</span> 查看已保存的作品和项目
          </li>
          <li className="flex items-center gap-2">
            <span className="text-success">✓</span> 阅读社区帖子和回复
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted/60">✗</span> Python 代码执行（需要在线加载 Pyodide）
          </li>
          <li className="flex items-center gap-2">
            <span className="text-muted/60">✗</span> 提交新作品和帖子
          </li>
        </ul>
      </div>
      <div className="flex items-center justify-center gap-3 flex-wrap">
        <Link
          href="/"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
        >
          返回首页
        </Link>
        <Link
          href="/courses"
          className="px-6 py-3 rounded-lg border border-rule bg-bg2 text-ink font-semibold hover:border-accent transition"
        >
          浏览课程
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-lg border border-rule bg-bg2 text-ink font-semibold hover:border-accent transition"
        >
          重新连接
        </button>
      </div>
    </div>
  );
}