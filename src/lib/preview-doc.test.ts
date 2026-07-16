import { describe, it, expect } from "vitest";
import type { BuildFile } from "@/types";
import { buildPreviewDoc } from "./preview-doc";

// 预期 CSP meta 内容
const CSP_PATTERN = /<meta\s+http-equiv=["']?Content-Security-Policy["']?[^>]*content=["'][^"']*["']/i;

function files(overrides: Partial<BuildFile>[] = []): BuildFile[] {
  const base: BuildFile[] = [
    { name: "index.html", language: "html", content: "" },
    { name: "style.css", language: "css", content: "" },
    { name: "script.js", language: "js", content: "" },
  ];
  return base.map((b, i) => ({ ...b, ...overrides[i] }));
}

describe("buildPreviewDoc", () => {
  it("缺失 html 文件时返回仅含 CSP 的字符串", () => {
    const doc = buildPreviewDoc([
      { name: "style.css", language: "css", content: "body{}" },
    ]);
    expect(CSP_PATTERN.test(doc)).toBe(true);
  });

  it("空文件列表时仅返回 CSP", () => {
    const doc = buildPreviewDoc([]);
    expect(CSP_PATTERN.test(doc)).toBe(true);
  });

  it("把 <link href=style.css> 替换为内联 <style>", () => {
    const doc = buildPreviewDoc(
      files([
        {
          content: `<html><head><link rel="stylesheet" href="style.css"></head><body></body></html>`,
        },
        { content: "body { color: red; }" },
        {},
      ]),
    );
    expect(doc).toContain("<style>body { color: red; }</style>");
    expect(doc).not.toMatch(/<link[^>]*style\.css[^>]*>/i);
  });

  it("把 <script src=script.js> 替换为内联 <script>", () => {
    const doc = buildPreviewDoc(
      files([
        {
          content: `<html><head></head><body><script src="script.js"></script></body></html>`,
        },
        {},
        { content: "console.log(1);" },
      ]),
    );
    expect(doc).toContain("<script>console.log(1);</script>");
    expect(doc).not.toMatch(/<script[^>]*src=["']script\.js["'][^>]*>/i);
  });

  it("html 中无 link/script 引用时，css/js 注入到 head/body 末尾", () => {
    const doc = buildPreviewDoc(
      files([
        { content: `<html><head></head><body><p>hi</p></body></html>` },
        { content: "p{color:blue}" },
        { content: "alert(1)" },
      ]),
    );
    expect(doc).toContain("<style>p{color:blue}</style></head>");
    expect(doc).toContain("<script>alert(1)</script></body>");
  });

  it("css 为空时不注入额外 <style>", () => {
    const doc = buildPreviewDoc(
      files([
        { content: `<html><head></head><body></body></html>` },
        { content: "" },
        { content: "alert(1)" },
      ]),
    );
    // 只有 js 注入的 <script>，css 空字符串不触发注入分支（css falsy）
    expect(doc).not.toContain("<style></style>");
  });

  it("已有 CSP meta 时替换为项目 CSP", () => {
    const existingCsp = `<meta http-equiv="Content-Security-Policy" content="default-src *">`;
    const doc = buildPreviewDoc(
      files([{ content: `<html><head>${existingCsp}</head><body></body></html>` }]),
    );
    expect(doc).not.toContain('default-src *');
    expect(doc).toContain("default-src 'none'");
    // 替换后应只剩一个 CSP meta
    const matches = doc.match(/<meta\s+http-equiv=["']?Content-Security-Policy["']?[^>]*>/gi);
    expect(matches?.length).toBe(1);
  });

  it("有 <head> 标签时，CSP 注入到 <head> 紧后", () => {
    const doc = buildPreviewDoc(
      files([{ content: `<html><head><title>t</title></head><body></body></html>` }]),
    );
    expect(doc).toMatch(/<head[^>]*><meta http-equiv/i);
  });

  it("无 <head> 但有 <html> 时，插入新 <head>", () => {
    const doc = buildPreviewDoc(
      files([{ content: `<html><body>hi</body></html>` }]),
    );
    expect(doc).toMatch(/<html[^>]*><head><meta http-equiv/i);
  });

  it("连 <html> 都没有时，CSP 前置拼接", () => {
    const doc = buildPreviewDoc(
      files([{ content: `just text <div>x</div>` }]),
    );
    expect(doc.startsWith("<meta http-equiv")).toBe(true);
    expect(doc).toContain("just text");
  });

  it("注入的 CSP 包含关键安全策略", () => {
    const doc = buildPreviewDoc(
      files([{ content: `<html><head></head><body></body></html>` }]),
    );
    expect(doc).toContain("default-src 'none'");
    expect(doc).toContain("connect-src 'none'");
    expect(doc).toContain("frame-ancestors 'none'");
    expect(doc).toContain("script-src 'unsafe-inline'");
    expect(doc).toContain("img-src data: blob:");
  });

  it("单引号与双引号混用都能识别 link 与 script 引用", () => {
    const doc = buildPreviewDoc(
      files([
        {
          content: `<html><head><link href='style.css' rel='stylesheet'></head><body><script src='script.js'></script></body></html>`,
        },
        { content: "body{}" },
        { content: "console.log(2)" },
      ]),
    );
    expect(doc).toContain("<style>body{}</style>");
    expect(doc).toContain("<script>console.log(2)</script>");
  });
});
