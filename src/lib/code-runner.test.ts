import { describe, it, expect } from "vitest";
import { checkTests, runStatic, runCode, runHTML, runCSS, validateSQL } from "./code-runner";
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
  it("html 使用 runHTML 生成预览", async () => {
    const r = await runCode("<p>hi</p>", "html");
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe("<p>hi</p>");
    // HTML 执行应返回 previewUrl
    expect((r as any).previewUrl).toBeDefined();
    expect((r as any).previewUrl).toMatch(/^blob:/);
  });

  it("css 使用 runCSS 生成预览", async () => {
    const r = await runCode("body { color: red; }", "css");
    expect(r.exitCode).toBe(0);
    // CSS 执行应返回 previewUrl
    expect((r as any).previewUrl).toBeDefined();
    expect((r as any).previewUrl).toMatch(/^blob:/);
  });

  it("sql 使用 validateSQL 进行语法校验", async () => {
    const r = await runCode("SELECT 1;", "sql");
    expect(r.exitCode).toBe(0);
  });

  it("sql 无效代码返回错误", async () => {
    const r = await runCode("", "sql");
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toContain("SQL 代码为空");
  });

  it("go 走 runStatic", async () => {
    const r = await runCode('package main\n', "go");
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe('package main\n');
  });

  it("rust 走 runStatic", async () => {
    const r = await runCode("fn main() {}", "rust");
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe("fn main() {}");
  });

  it("typescript 走 runStatic", async () => {
    const r = await runCode("const x: number = 1;", "typescript");
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe("const x: number = 1;");
  });

  it("未支持的语言返回错误", async () => {
    // java/cpp/go/rust/typescript 走 runStatic 分支（已支持），用真正不存在的语言测试错误分支
    const r = await runCode("// nothing", "kotlin" as any);
    expect(r.exitCode).toBe(1);
    expect(r.stderr).toContain("not supported");
  });
});

describe("runHTML", () => {
  it("片段代码自动包装为完整 HTML 文档", async () => {
    const r = await runHTML("<h1>Hello</h1>");
    expect(r.exitCode).toBe(0);
    expect(r.previewUrl).toBeDefined();
    expect(r.previewUrl).toMatch(/^blob:/);
  });

  it("完整 HTML 文档保持原样", async () => {
    const full = "<!DOCTYPE html><html><head></head><body><p>test</p></body></html>";
    const r = await runHTML(full);
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toBe(full);
  });

  it("返回 previewUrl 可用于 iframe 渲染", async () => {
    const r = await runHTML("<div>test</div>");
    expect(r.previewUrl).toBeTruthy();
    expect(typeof r.previewUrl).toBe("string");
  });
});

describe("runCSS", () => {
  it("生成包含测试元素的 HTML 预览", async () => {
    const r = await runCSS("body { background: red; }");
    expect(r.exitCode).toBe(0);
    expect(r.previewUrl).toBeDefined();
    expect(r.previewUrl).toMatch(/^blob:/);
  });

  it("CSS 代码嵌入到预览 HTML 中", async () => {
    const r = await runCSS("h1 { color: blue; }");
    expect(r.exitCode).toBe(0);
    expect(r.stdout).toContain("h1 { color: blue; }");
  });
});

describe("validateSQL", () => {
  it("有效 SQL 通过校验", () => {
    const r = validateSQL("SELECT * FROM users;");
    expect(r.valid).toBe(true);
    expect(r.errors).toHaveLength(0);
  });

  it("空 SQL 返回错误", () => {
    const r = validateSQL("");
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("SQL 代码为空");
  });

  it("无 SQL 关键字返回错误", () => {
    const r = validateSQL("hello world");
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("未检测到有效的 SQL 关键字");
  });

  it("括号不匹配检测", () => {
    const r = validateSQL("SELECT * FROM (SELECT id FROM users;");
    expect(r.valid).toBe(false);
    expect(r.errors.some((e) => e.includes("括号"))).toBe(true);
  });

  it("引号不匹配检测", () => {
    const r = validateSQL("SELECT * FROM users WHERE name = 'John;");
    expect(r.valid).toBe(false);
    expect(r.errors).toContain("单引号不匹配");
  });

  it("缺少分号给出建议", () => {
    const r = validateSQL("SELECT * FROM users");
    expect(r.errors.some((e) => e.includes("分号"))).toBe(true);
  });

  it("INSERT 语句通过校验", () => {
    const r = validateSQL("INSERT INTO users (name) VALUES ('John');");
    expect(r.valid).toBe(true);
  });

  it("UPDATE 语句通过校验", () => {
    const r = validateSQL("UPDATE users SET name = 'Jane' WHERE id = 1;");
    expect(r.valid).toBe(true);
  });
});
