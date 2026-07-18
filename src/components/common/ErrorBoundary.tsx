"use client";

import { Component, type ErrorInfo, type ReactNode } from "react";
import Link from "next/link";

interface ErrorBoundaryProps {
  children: ReactNode;
  /** 自定义回退 UI，不传则使用默认 */
  fallback?: ReactNode;
  /** 错误回调，可用于上报 */
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  /** 组件名称，用于错误日志标识 */
  name?: string;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
  retryCount: number;
}

/**
 * 客户端 ErrorBoundary 组件。
 *
 * 与 Next.js app/error.tsx 不同，此组件用于包裹特定子树，
 * 捕获渲染错误并展示回退 UI，避免整个页面崩溃。
 *
 * 增强功能：
 * - 错误详情展示与隐藏
 * - 重试计数限制（防止无限重试循环）
 * - 错误上报回调
 *
 * 用法：
 * <ErrorBoundary name="CourseList">
 *   <SomeComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private static MAX_RETRIES = 3;

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, retryCount: 0 };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const componentName = this.props.name || "Unknown";
    console.error(`[ErrorBoundary:${componentName}] 捕获到错误：`, error, errorInfo);
    this.setState({ errorInfo });
    this.props.onError?.(error, errorInfo);
  }

  handleReset = () => {
    const { retryCount } = this.state;
    if (retryCount >= ErrorBoundary.MAX_RETRIES) {
      return;
    }
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: retryCount + 1,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    const { hasError, error, errorInfo, retryCount } = this.state;
    const { fallback, name } = this.props;

    if (hasError) {
      if (fallback) return fallback;

      const maxRetriesReached = retryCount >= ErrorBoundary.MAX_RETRIES;

      return (
        <div className="mx-auto max-w-lg px-4 py-12 text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="font-outfit text-xl font-bold mb-2">
            {name ? `${name} 加载异常` : "组件加载异常"}
          </h2>
          <p className="text-sm text-muted mb-4">
            此部分内容暂时无法显示，请稍后重试。
          </p>

          {/* 错误信息 */}
          {error && (
            <div className="mb-4 mx-auto max-w-sm">
              <details className="text-left">
                <summary className="text-[11px] text-muted/60 cursor-pointer hover:text-muted font-mono">
                  查看错误详情
                </summary>
                <div className="mt-2 rounded-lg bg-bg3 border border-rule p-3">
                  <p className="text-[10px] text-muted font-mono break-all leading-relaxed">
                    {error.message}
                  </p>
                  {errorInfo?.componentStack && (
                    <pre className="mt-2 text-[9px] text-muted/60 font-mono overflow-auto max-h-24 whitespace-pre-wrap">
                      {errorInfo.componentStack}
                    </pre>
                  )}
                </div>
              </details>
            </div>
          )}

          {/* 重试次数提示 */}
          {maxRetriesReached && (
            <p className="text-xs text-accent2 mb-4">
              已重试 {ErrorBoundary.MAX_RETRIES} 次仍无法恢复，请尝试刷新页面。
            </p>
          )}

          <div className="flex items-center justify-center gap-3">
            {!maxRetriesReached && (
              <button
                onClick={this.handleReset}
                className="px-4 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 transition"
              >
                重试
              </button>
            )}
            <button
              onClick={this.handleReload}
              className="px-4 py-2 rounded-lg border border-rule bg-bg2 text-ink text-sm font-semibold hover:border-accent transition"
            >
              刷新页面
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