"use client";

import { useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ShareButtonProps {
  /** 分享标题（用于社交媒体，可选） */
  title?: string;
  /** 分享文本（用于社交媒体，可选） */
  text?: string;
  /** 自定义分享 URL，默认为当前页面 URL */
  url?: string;
  /** 按钮尺寸 */
  size?: "sm" | "md";
  /** 是否显示文字标签 */
  withLabel?: boolean;
  /** 自定义类名 */
  className?: string;
  /** 是否阻止事件冒泡（用于卡片内点击场景） */
  stopPropagation?: boolean;
}

/**
 * 分享按钮：使用 Web Share API（移动端原生分享），
 * 退化到剪贴板复制（桌面端）。
 *
 * 设计要点：
 * - 优先调用 navigator.share（移动端/iOS Safari 原生分享窗口）
 * - 不支持时降级为 navigator.clipboard.writeText
 * - 旧浏览器（无 clipboard API）退化到 textarea + execCommand
 * - 复制成功后显示 2 秒"已复制"反馈
 * - 不抛出错误（用户取消分享是正常行为）
 */
export function ShareButton({
  title,
  text,
  url,
  size = "md",
  withLabel = true,
  className,
  stopPropagation = true,
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleShare = useCallback(
    async (e: React.MouseEvent) => {
      if (stopPropagation) e.stopPropagation();
      if (e.preventDefault) e.preventDefault();

      const shareUrl = url ?? (typeof window !== "undefined" ? window.location.href : "");
      const shareData = {
        title: title ?? "CodeGame",
        text: text ?? "在 CodeGame 上学习编程，一起来挑战吧！",
        url: shareUrl,
      };

      // 优先使用 Web Share API（移动端原生体验最佳）
      if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          // 用户取消分享（AbortError）是正常行为，静默处理
          if (err instanceof DOMException && err.name === "AbortError") return;
          // 其他错误降级到剪贴板
        }
      }

      // 降级方案 1：Clipboard API
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
          return;
        } catch {
          // 继续降级
        }
      }

      // 降级方案 2：textarea + execCommand（兼容旧浏览器）
      if (typeof document !== "undefined") {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = shareUrl;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } catch {
          // 最终降级：无操作（极少数环境）
        }
      }
    },
    [url, title, text, stopPropagation],
  );

  const sizeClasses = size === "sm" ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm";

  return (
    <button
      type="button"
      onClick={handleShare}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-rule text-muted hover:text-ink hover:bg-bg2 transition font-medium",
        sizeClasses,
        className,
      )}
      aria-label={copied ? "已复制链接" : "分享"}
      title={copied ? "已复制链接" : "分享"}
    >
      {copied ? (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M13.7 5.3a1 1 0 0 1 0 1.4l-5 5a1 1 0 0 1-1.4 0l-3-3a1 1 0 1 1 1.4-1.4l2.3 2.29 4.3-4.3a1 1 0 0 1 1.4 0z" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path d="M11 2a2 2 0 0 0-2 2v1.5a.5.5 0 0 0 1 0V4a1 1 0 0 1 2 0v1.5a.5.5 0 0 0 1 0V4a2 2 0 0 0-2-2z" />
          <path d="M3 6a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2H3zm0 1h6a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1z" />
          <path d="M11 8.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5z" />
          <path d="M13 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
          <path d="M13 10.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
        </svg>
      )}
      {withLabel && (
        <span>{copied ? "已复制" : "分享"}</span>
      )}
    </button>
  );
}
