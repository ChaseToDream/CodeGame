"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 自定义回退 UI，不传则使用默认 */
  fallback?: ReactNode;
  /** 错误回调，可用于上报 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 客户端 ErrorBoundary 组件。
 *
 * 与 Next.js app/error.tsx 不同，此组件用于包裹特定子树，
 * 捕获渲染错误并展示回退 UI，避免整个页面崩溃。
 *
 * 用法：
 * <ErrorBoundary>
 *   <SomeComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("[ErrorBoundary] 捕获到错误：", error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-outfit text-xl font-bold mb-2">组件加载异常</h2>
          <p className="text-sm text-muted mb-4">
            此部分内容暂时无法显示，请稍后重试。
          </p>
          {this.state.error && (
            <p className="text-[10px] text-muted/60 mb-4 font-mono break-all">
              {this.state.error.message}
            </p>
          )}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition"
            >
              重试
            </button>
            <Link
              href="/"
              className="px-4 py-2 rounded-lg border border-rule bg-bg2 text-ink text-sm font-semibold hover:border-accent transition"
            >
              返回首页
            </Link>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}