"use client";

import type { Language, TestCase } from "@/types";

export interface RunResult {
  stdout: string;
  stderr: string;
  exitCode: number;
  executionTimeMs: number;
}

export interface CheckResult {
  passed: boolean;
  results: { name: string; passed: boolean; expected: string; actual: string }[];
}

/**
 * 浏览器内代码执行器
 * - Python: 通过 CDN 加载 Pyodide (WASM CPython) 执行
 * - JavaScript: 沙箱 Function 捕获 console.log
 * - HTML/CSS/SQL: 静态校验（规范化字符串匹配）
 */

let pyodidePromise: Promise<any> | null = null;

async function loadPyodide(): Promise<any> {
  if (typeof window === "undefined") throw new Error("Pyodide requires browser");
  if ((window as any).loadPyodide === undefined) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/pyodide.js";
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Failed to load Pyodide CDN"));
      document.head.appendChild(s);
    });
  }
  if (!pyodidePromise) {
    pyodidePromise = (window as any).loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });
  }
  return pyodidePromise;
}

export async function runPython(code: string): Promise<RunResult> {
  const start = performance.now();
  try {
    const pyodide = await loadPyodide();
    let stdout = "";
    let stderr = "";
    pyodide.setStdout({ batched: (s: string) => (stdout += s + "\n") });
    pyodide.setStderr({ batched: (s: string) => (stderr += s + "\n") });
    await pyodide.runPythonAsync(code);
    return {
      stdout,
      stderr,
      exitCode: 0,
      executionTimeMs: Math.round(performance.now() - start),
    };
  } catch (e: any) {
    return {
      stdout: "",
      stderr: String(e?.message || e),
      exitCode: 1,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }
}

export async function runJavaScript(code: string): Promise<RunResult> {
  const start = performance.now();
  const logs: string[] = [];
  let stderr = "";
  const fakeConsole = {
    log: (...args: any[]) => {
      logs.push(args.map(stringify).join(" "));
    },
    error: (...args: any[]) => {
      logs.push(args.map(stringify).join(" "));
    },
    warn: (...args: any[]) => {
      logs.push(args.map(stringify).join(" "));
    },
    info: (...args: any[]) => {
      logs.push(args.map(stringify).join(" "));
    },
  };
  try {
    // 使用 AsyncFunction 以支持 await
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFunction("console", code);
    await fn(fakeConsole);
    return {
      stdout: logs.join("\n") + (logs.length ? "\n" : ""),
      stderr,
      exitCode: 0,
      executionTimeMs: Math.round(performance.now() - start),
    };
  } catch (e: any) {
    return {
      stdout: logs.join("\n") + (logs.length ? "\n" : ""),
      stderr: String(e?.message || e),
      exitCode: 1,
      executionTimeMs: Math.round(performance.now() - start),
    };
  }
}

/** 静态语言（html/css/sql）：仅做规范化匹配，不实际执行 */
export async function runStatic(code: string): Promise<RunResult> {
  return {
    stdout: code,
    stderr: "",
    exitCode: 0,
    executionTimeMs: 0,
  };
}

export async function runCode(code: string, language: Language): Promise<RunResult> {
  switch (language) {
    case "python":
      return runPython(code);
    case "javascript":
      return runJavaScript(code);
    case "html":
    case "css":
    case "sql":
    case "cpp":
    case "java":
      return runStatic(code);
    default:
      return { stdout: "", stderr: `Language ${language} not supported`, exitCode: 1, executionTimeMs: 0 };
  }
}

function stringify(v: any): string {
  if (typeof v === "string") return v;
  if (v === undefined) return "undefined";
  if (v === null) return "null";
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

/** 规范化：去除空白与换行差异 */
function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/** 验证测试用例 */
export function checkTests(
  code: string,
  language: Language,
  testCases: TestCase[],
  runOutput: string,
): CheckResult {
  const results = testCases.map((tc) => {
    let actual = "";
    if (language === "python" || language === "javascript") {
      actual = runOutput;
    } else {
      // 静态语言：对比代码本身
      actual = code;
    }
    const passed = normalize(actual) === normalize(tc.expected);
    return { name: tc.name, passed, expected: tc.expected, actual };
  });
  return { passed: results.every((r) => r.passed), results };
}
