import { NextResponse } from "next/server";

/**
 * favicon.ico 路由：为不支持 SVG favicon 的旧浏览器提供回退图标。
 * 返回与 /favicon.svg 相同视觉的 SVG 内容，但以 .ico 扩展名响应。
 * 现代浏览器优先使用 HTML 中声明的 /favicon.svg，
 * 此路由作为 /favicon.ico 请求的兜底。
 */
export function GET() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <defs>
    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#7C5CFC"/>
      <stop offset="100%" style="stop-color:#FF6B9D"/>
    </linearGradient>
  </defs>
  <rect width="64" height="64" rx="14" fill="url(#g)"/>
  <text x="32" y="44" font-family="monospace" font-size="32" font-weight="bold" fill="white" text-anchor="middle">&lt;/&gt;</text>
</svg>`;

  return new NextResponse(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}