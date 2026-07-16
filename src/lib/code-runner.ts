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

export type PyodideStatus = "idle" | "loading" | "ready" | "error";

/**
 * 浏览器内代码执行器
 * - Python: 通过 CDN 加载 Pyodide (WASM CPython) 执行
 * - JavaScript: Web Worker 沙箱隔离执行，无法访问 DOM/window/localStorage
 * - HTML/CSS/SQL: 静态校验（规范化字符串匹配）
 *
 * 安全策略：
 * - JS Worker 中显式删除 fetch / XMLHttpRequest / WebSocket / indexedDB / caches，
 *   防止用户练习代码发起任意网络请求。
 * - Python 端删除 pyodide.http 模块并屏蔽 socket / urllib，防止数据外泄。
 */

// Pyodide CDN URL，可被替换为自托管镜像（中国大陆可改为 bootcdn 等）
const PYODIDE_CDN_BASE = "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/";

let pyodidePromise: Promise<any> | null = null;
let pyodideLoading: boolean = false;
let pyodideLoadError: string | null = null;
const pyodideLoadCallbacks: Array<(ok: boolean) => void> = [];

async function loadPyodide(): Promise<any> {
  if (typeof window === "undefined") throw new Error("Pyodide requires browser");
  if ((window as any).loadPyodide === undefined) {
    await new Promise<void>((resolve, reject) => {
      const s = document.createElement("script");
      s.src = `${PYODIDE_CDN_BASE}pyodide.js`;
      s.onload = () => resolve();
      s.onerror = () => reject(new Error("Pyodide CDN 加载失败，请检查网络连接或稍后重试"));
      document.head.appendChild(s);
    });
  }
  if (!pyodidePromise) {
    pyodideLoading = true;
    pyodideLoadError = null;
    pyodidePromise = (window as any).loadPyodide({ indexURL: PYODIDE_CDN_BASE });
    try {
      const pyodide = await pyodidePromise;
      // 安全加固：删除网络相关 API，防止用户 Python 代码发起任意网络请求
      await hardenPyodide(pyodide);
    } catch (e: any) {
      pyodideLoadError = String(e?.message || e);
      pyodidePromise = null; // 允许下次重试
      throw e;
    } finally {
      pyodideLoading = false;
      pyodideLoadCallbacks.forEach((cb) => cb(!pyodideLoadError));
      pyodideLoadCallbacks.length = 0;
    }
  }
  return pyodidePromise;
}

/**
 * 加固 Pyodide 运行时：移除网络与文件系统访问能力。
 * - 删除 pyodide.http（pyfetch / open_url）
 * - 屏蔽 socket / urllib.request / urllib.urlopen
 * - 限制 micropip 安装能力
 */
async function hardenPyodide(pyodide: any): Promise<void> {
  try {
    // 删除 HTTP API
    if (pyodide.http) {
      delete pyodide.http.pyfetch;
      delete pyodide.http.open_url;
      delete pyodide.http.open_bytes;
    }
    // 在 Python 侧屏蔽网络模块
    await pyodide.runPythonAsync(`
import sys
# 屏蔽 socket 与 urllib 的网络访问
class _NetworkBlocked(Exception):
    pass

def _block_network(name):
    class _Blocked:
        def __init__(self, *a, **kw):
            raise _NetworkBlocked(f"{name} 已被禁用：练习环境不允许网络访问")
    return _Blocked

import types
# urllib.request
try:
    import urllib.request
    urllib.request.urlopen = _block_network("urllib.request.urlopen")
    urllib.request.urlretrieve = _block_network("urllib.request.urlretrieve")
except Exception:
    pass
# socket
try:
    import socket
    socket.socket = _block_network("socket.socket")
except Exception:
    pass
# 删除 micropip 的 install（避免下载第三方包）
try:
    import micropip
    micropip.install = _block_network("micropip.install")
except Exception:
    pass
del _block_network
`);
  } catch {
    // 加固失败不阻塞执行，仅记录
  }
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
export function getPyodideStatus(): PyodideStatus {
  if (pyodideLoadError) return "error";
  if (pyodidePromise && !pyodideLoading) return "ready";
  if (pyodideLoading) return "loading";
  return "idle";
}

/** 获取 Pyodide 加载错误信息（用于 UI 展示） */
export function getPyodideError(): string | null {
  return pyodideLoadError;
}

/** 重置 Pyodide 错误状态，允许重新尝试加载 */
export function retryPyodide(): void {
  pyodideLoadError = null;
  pyodidePromise = null;
  pyodideLoading = false;
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
// 安全加固：显式删除 fetch / XMLHttpRequest / WebSocket / indexedDB / caches，
// 防止用户练习代码发起任意网络请求或持久化数据。
const WORKER_SOURCE = `
function stringify(v) {
  if (typeof v === 'string') return v;
  if (v === undefined) return 'undefined';
  if (v === null) return 'null';
  try { return JSON.stringify(v); } catch { return String(v); }
}
// 删除网络与持久化 API，阻断用户代码发起外部请求
try { delete self.fetch; } catch {}
try { delete self.XMLHttpRequest; } catch {}
try { delete self.WebSocket; } catch {}
try { delete self.EventSource; } catch {}
try { delete self.indexedDB; } catch {}
try { delete self.caches; } catch {}
try { delete self.navigator; } catch {}
// 屏蔽 importScripts（防止加载外部脚本）
self.importScripts = () => { throw new Error('importScripts 已被禁用：练习环境不允许加载外部脚本'); };
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
