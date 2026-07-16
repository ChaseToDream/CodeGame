import type { BuildFile } from "@/types";

/**
 * 预览文档内容安全策略：
 * - default-src 'none'：默认禁止所有资源加载
 * - script-src 'unsafe-inline'：允许内联脚本（用户作品需要）
 * - style-src 'unsafe-inline'：允许内联样式
 * - img-src data: blob:：允许 data URL 与 blob 图片
 * - connect-src 'none'：禁止 fetch/XHR/WebSocket，防止用户作品发起任意网络请求
 * - frame-ancestors 'none'：禁止被嵌套
 *
 * 这样即便有恶意用户发布"作品"，也无法：
 * - 向外部服务器发送数据（connect-src 'none'）
 * - 加载外部追踪像素（img-src 仅允许 data/blob）
 * - 嵌套其他页面
 */
const PREVIEW_CSP = [
  "default-src 'none'",
  "script-src 'unsafe-inline'",
  "style-src 'unsafe-inline'",
  "img-src data: blob:",
  "font-src data:",
  "connect-src 'none'",
  "frame-ancestors 'none'",
  "base-uri 'none'",
  "form-action 'none'",
].join("; ");

/**
 * 将 BuildFile 列表合并为安全的预览 HTML 文档：
 * - 把 <link href="style.css"> 替换为内联 <style>
 * - 把 <script src="script.js"> 替换为内联 <script>
 * - 在 <head> 顶部注入 CSP meta（若已存在 CSP meta 则替换）
 *
 * @param files 作品文件列表
 * @returns 可直接用于 iframe srcDoc 的 HTML 字符串
 */
export function buildPreviewDoc(files: BuildFile[]): string {
  const html = files.find((f) => f.language === "html")?.content ?? "";
  const css = files.find((f) => f.language === "css")?.content ?? "";
  const js = files.find((f) => f.language === "js")?.content ?? "";

  let doc = html
    .replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, `<style>${css}</style>`)
    .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, `<script>${js}<\/script>`);
  if (!/<style>/i.test(doc) && css) {
    doc = doc.replace(/<\/head>/i, `<style>${css}</style></head>`);
  }
  if (!/<script>/i.test(doc) && js) {
    doc = doc.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
  }

  // 注入 CSP meta；若已存在则替换
  const cspMeta = `<meta http-equiv="Content-Security-Policy" content="${PREVIEW_CSP}">`;
  if (/<meta\s+http-equiv=["']?Content-Security-Policy["']?[^>]*>/i.test(doc)) {
    doc = doc.replace(
      /<meta\s+http-equiv=["']?Content-Security-Policy["']?[^>]*>/i,
      cspMeta,
    );
  } else if (/<head[^>]*>/i.test(doc)) {
    doc = doc.replace(/<head[^>]*>/i, (m) => `${m}${cspMeta}`);
  } else if (/<html[^>]*>/i.test(doc)) {
    doc = doc.replace(/<html[^>]*>/i, (m) => `${m}<head>${cspMeta}</head>`);
  } else {
    doc = `${cspMeta}${doc}`;
  }

  return doc;
}
