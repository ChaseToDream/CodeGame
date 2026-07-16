"use client";

import { useMemo, type ComponentPropsWithoutRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * 安全的 Markdown 渲染组件：
 * - 仅允许 http(s) 与 mailto 协议的超链接，过滤 javascript: / data: 等危险协议
 * - 所有外部链接强制 target=_blank + rel=noopener noreferrer
 * - 禁用 raw HTML（react-markdown 默认不渲染 raw HTML，无需额外插件）
 *
 * 使用：把所有 <ReactMarkdown> 直接调用替换为 <SafeMarkdown>
 */
const SAFE_PROTOCOLS = /^(https?:|mailto:|tel:)$/i;

function isSafeUrl(url: string | undefined): boolean {
  if (!url) return false;
  // 相对路径允许
  if (url.startsWith("/") || url.startsWith("#")) return true;
  return SAFE_PROTOCOLS.test(url);
}

type SafeMarkdownProps = {
  children: string;
  className?: string;
} & Omit<ComponentPropsWithoutRef<typeof ReactMarkdown>, "children">;

export function SafeMarkdown({ children, className, ...rest }: SafeMarkdownProps) {
  const components = useMemo(
    () => ({
      a({ href, children, ...props }: ComponentPropsWithoutRef<"a">) {
        const safe = isSafeUrl(href);
        if (!safe) {
          // 危险链接降级为纯文本，避免钓鱼
          return <span>{children}</span>;
        }
        const isExternal = href?.startsWith("http");
        return (
          <a
            href={href}
            {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            {...props}
          >
            {children}
          </a>
        );
      },
      img({ src, alt, ...props }: ComponentPropsWithoutRef<"img">) {
        if (!isSafeUrl(src)) return null;
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={src} alt={alt ?? ""} loading="lazy" {...props} />
        );
      },
    }),
    [],
  );

  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components} {...rest}>
        {children}
      </ReactMarkdown>
    </div>
  );
}
