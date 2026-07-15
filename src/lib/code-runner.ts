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
 * - JavaScript: Web Worker 沙箱隔离执行，无法访问 DOM/window/localStorage
 * - HTML/CSS/SQL: 静态校验（规范化字符串匹配）
 */

let pyodidePromise: Promise<any> | null = null;
let pyodideLoading: boolean = false;
const pyodideLoadCallbacks: Array<(ok: boolean) => void> = [];

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
    pyodideLoading = true;
    pyodidePromise = (window as any).loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/",
    });
    try {
      await pyodidePromise;
    } finally {
      pyodideLoading = false;
      pyodideLoadCallbacks.forEach((cb) => cb(true));
      pyodideLoadCallbacks.length = 0;
    }
  }
  return pyodidePromise;
}

/** 预加载 Pyodide（不阻塞，用于进入 Python 课程时提前加载） */
export function preloadPyodide(): void {
  if (pyodidePromise || pyodideLoading) return;
  if (typeof window === "undefined") return;
  loadPyodide().catch(() => {
    // 预加载失败静默处理，实际运行时会再次尝试
  });
}

/** 查询 Pyodide 加载状态 */
export function getPyodideStatus(): "idle" | "loading" | "ready" {
  if (pyodidePromise && !pyodideLoading) return "ready";
  if (pyodideLoading) return "loading";
  return "idle";
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

/* ============ JavaScript 沙箱执行（Web Worker） ============ */

// Worker 源码：在独立线程执行用户代码，隔离 DOM/window/localStorage
const WORKER_SOURCE = `
function stringify(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  try { return JSON.stringify(v); } catch { return String(v); }
}
self.onmessage = async (e) => {
  const { code, id } = e.data;
  const logs = [];
  const fakeConsole = {
    log: (...args) => logs.push(args.map(stringify).join(' ')),
    error: (...args) => logs.push(args.map(stringify).join(' ')),
    warn: (...args) => logs.push(args.map(stringify).join(' ')),
    info: (...args) => logs.push(args.map(stringify).join(' ')),
  };
  try {
    const AsyncFunction = Object.getPrototypeOf(async function(){}).constructor;
    const fn = new AsyncFunction('console', code);
    await fn(fakeConsole);
    self.postMessage({ id, type: 'success', stdout: logs.join('\\n') + (logs.length ? '\\n' : '') });
  } catch (err) {
    self.postMessage({
      id,
      type: 'error',
      stdout: logs.join('\\n') + (logs.length ? '\\n' : ''),
      stderr: String(err && err.message ? err.message : err),
    });
  }
};
`;

let worker: Worker | null = null;
let messageId = 0;

function getWorker(): Worker {
  if (worker) return worker;
  const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
  worker = new Worker(URL.createObjectURL(blob));
  return worker;
}

function terminateWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
  }
}

/**
 * 在 Web Worker 中执行 JavaScript，隔离 DOM/window/localStorage。
 * 超时后终止 Worker 并重建，防止死循环卡死。
 */
export async function runJavaScript(code: string, timeoutMs = 5000): Promise<RunResult> {
  const start = performance.now();
  const id = ++messageId;
  const w = getWorker();

  return new Promise<RunResult>((resolve) => {
    let settled = false;

    const timeout = setTimeout(() => {
      if (settled) return;
      settled = true;
      w.removeEventListener("message", handler);
      terminateWorker(); // 终止死循环，下次调用自动重建
      resolve({
        stdout: "",
        stderr: "执行超时（可能存在死循环）",
        exitCode: 1,
        executionTimeMs: Math.round(performance.now() - start),
      });
    }, timeoutMs);

    const handler = (e: MessageEvent) => {
      if (e.data.id !== id || settled) return;
      settled = true;
      w.removeEventListener("message", handler);
      clearTimeout(timeout);
      resolve({
        stdout: e.data.stdout || "",
        stderr: e.data.type === "success" ? "" : e.data.stderr || "",
        exitCode: e.data.type === "success" ? 0 : 1,
        executionTimeMs: Math.round(performance.now() - start),
      });
    };

    w.addEventListener("message", handler);
    w.postMessage({ code, id });
  });
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

/** 规范化：去除首尾空白与多余空白差异 */
function normalize(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * 验证测试用例
 * - 动态语言（python/javascript）：检查 stdout 是否包含每个测试用例的 expected
 *   （规范化后），支持多测试用例各自独立判断
 * - 静态语言：检查代码本身是否包含 expected 模式
 */
export function checkTests(
  code: string,
  language: Language,
  testCases: TestCase[],
  runOutput: string,
): CheckResult {
  const isDynamic = language === "python" || language === "javascript";
  const source = isDynamic ? runOutput : code;
  const normalizedSource = normalize(source);

  const results = testCases.map((tc) => {
    const expected = normalize(tc.expected);
    // 空 expected 视为永远不通过（避免 includes("") 恒真）
    if (!expected) {
      return { name: tc.name, passed: false, expected: tc.expected, actual: source };
    }
    // 单测试用例场景：严格相等；多测试用例场景：包含匹配
    const passed =
      testCases.length === 1
        ? normalizedSource === expected
        : normalizedSource.includes(expected);
    return { name: tc.name, passed, expected: tc.expected, actual: source };
  });
  return { passed: results.every((r) => r.passed), results };
}
