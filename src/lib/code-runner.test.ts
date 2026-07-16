import { describe, it, expect } from "vitest";
import { checkTests, runStatic, runCode } from "./code-runner";
import type { TestCase } from "@/types";

describe("checkTests - 动态语言（python/javascript）", () => {
  it("单测试用例：规范化后严格相等通过", () => {
    const tcs: TestCase[] = [{ name: "输出 Hello", expected: "Hello\n" }];
    const r = checkTests('print("Hello")', "python", tcs, "Hello\n");
    expect(r.passed).toBe(true);
    expect(r.results[0].passed).toBe(true);
  });

  it("单测试用例：行尾空白不影响匹配", () => {
    const tcs: TestCase[] = [{ name: "输出", expected: "Hello\n" }];
    // 实际输出末尾有空格，但规范化后应通过
    const r = checkTests("", "python", tcs, "Hello   \n");
    expect(r.passed).toBe(true);
  });

  it("单测试用例：内容不同则不通过", () => {
    const tcs: TestCase[] = [{ name: "输出", expected: "Hello\n" }];
    const r = checkTests("", "python", tcs, "World\n");
    expect(r.passed).toBe(false);
  });

  it("单测试用例：CRLF 换行被规范化为 LF", () => {
    const tcs: TestCase[] = [{ name: "输出", expected: "Hello\nWorld\n" }];
    const r = checkTests("", "python", tcs, "Hello\r\nWorld\r\n");
    expect(r.passed).toBe(true);
  });

  it("多测试用例：expected 的每一行都出现在输出中即通过", () => {
    const tcs: TestCase[] = [
      { name: "包含 Apple", expected: "Apple" },
      { name: "包含 Banana", expected: "Banana" },
    ];
    const r = checkTests("", "python", tcs, "Apple\nBanana\nCherry");
    expect(r.passed).toBe(true);
  });

  it("多测试用例：缺少任一行则不通过", () => {
    const tcs: TestCase[] = [
      { name: "包含 Apple", expected: "Apple" },
      { name: "包含 Grape", expected: "Grape" },
    ];
    const r = checkTests("", "python", tcs, "Apple\nBanana");
    expect(r.passed).toBe(false);
    expect(r.results[0].passed).toBe(true);
    expect(r.results[1].passed).toBe(false);
  });

  it("空 expected 永远不通过（避免 includes('') 恒真）", () => {
    const tcs: TestCase[] = [{ name: "空", expected: "" }];
    const r = checkTests("", "python", tcs, "anything");
    expect(r.passed).toBe(false);
    expect(r.results[0].passed).toBe(false);
  });

  it("多行输出严格匹配", () => {
    const tcs: TestCase[] = [
      { name: "三行输出", expected: "1\n2\n3\n" },
    ];
    const r = checkTests("", "python", tcs, "1\n2\n3\n");
    expect(r.passed).toBe(true);
  });
});

describe("checkTests - 静态语言（html/css/sql）", () => {
  it("用户代码包含 expected 片段即通过（宽松规范化）", () => {
    const tcs: TestCase[] = [{ name: "包含 h1", expected: "<h1>Hello</h1>" }];
    const code = `<!DOCTYPE html>
<html>
  <body>
    <h1>Hello</h1>
  </body>
</html>`;
    const r = checkTests(code, "html", tcs, "");
    expect(r.passed).toBe(true);
  });

  it("CSS 包含规则即通过", () => {
    const tcs: TestCase[] = [{ name: "color", expected: "color: purple;" }];
    const code = `body { color: purple; background: #000; }`;
    const r = checkTests(code, "css", tcs, "");
    expect(r.passed).toBe(true);
  });

  it("代码不包含片段则不通过", () => {
    const tcs: TestCase[] = [{ name: "h1", expected: "<h1>Hello</h1>" }];
    const r = checkTests("<p>World</p>", "html", tcs, "");
    expect(r.passed).toBe(false);
  });

  it("静态语言忽略空白差异", () => {
    const tcs: TestCase[] = [{ name: "h1", expected: "<h1>Hello</h1>" }];
    // 用户代码中有多余空白与换行
    const code = `<h1>   Hello   </h1>`;
    // 注意：宽松规范化把所有空白折叠为单个空格，所以 "Hello" 仍能匹配 "<h1>Hello</h1>" 吗？
    // 实际上 normalizeLoose 把 "<h1>   Hello   </h1>" 折叠为 "<h1> Hello </h1>"
    // 而 expected "<h1>Hello</h1>" 折叠为 "<h1>Hello</h1>"
    // includes 判断 "<h1> Hello </h1>".includes("<h1>Hello</h1>") = false
    // 所以此用例验证宽松规范化不会误判
    const r = checkTests(code, "html", tcs, "");
    expect(r.passed).toBe(false);
  });
});

describe("checkTests - 多用例整体 passed 字段", () => {
  it("任一用例失败则整体 passed=false", () => {
    const tcs: TestCase[] = [
      { name: "a", expected: "A" },
      { name: "b", expected: "B" },
      { name: "c", expected: "C" },
    ];
    const r = checkTests("", "python", tcs, "A\nB\nX");
    expect(r.passed).toBe(false);
    expect(r.results.filter((x) => x.passed).length).toBe(2);
  });

  it("所有用例通过则整体 passed=true", () => {
    const tcs: TestCase[] = [
      { name: "a", expected: "A" },
      { name: "b", expected: "B" },
    ];
    const r = checkTests("", "python", tcs, "A\nB");
    expect(r.passed).toBe(true);
  });
});

describe("runStatic", () => {
  it("原样返回代码作为 stdout", async () => {
    const r = await runStatic("<p>hi</p>");
    expect(r.stdout).toBe("<p>hi</p>");
    expect(r.stderr).toBe("");
    expect(r.exitCode).toBe(0);
  });
});

describe("runCode 路由", () => {
  it("html 走 runStatic", async () => {
    const r = await runCode("<p>hi</p>", "html");
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe("<p>hi</p>");
  });

  it("css 走 runStatic", async () => {
    const r = await runCode("body { color: red; }", "css");
    expect(r.exitCode).toBe(0);
  });

  it("sql 走 runStatic", async () => {
    const r = await runCode("SELECT 1;", "sql");
    expect(r.exitCode).toBe(0);
  });

  it("未支持的语言返回错误", async () => {
    // java 走 runStatic 分支（已支持），用真正不存在的语言测试错误分支
    const r = await runCode("// nothing", "rust" as any);
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toContain("not supported");
  });
});
