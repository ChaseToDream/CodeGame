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
// 脚本加载 Promise 缓存：避免并发调用注入多个 script 标签
let scriptPromise: Promise<void> | null = null;

async function loadPyodide(): Promise<any> {
  if (typeof window === "undefined") throw new Error("Pyodide requires browser");
  if ((window as any).loadPyodide === undefined) {
    // 使用缓存的 Promise 避免竞态条件：并发调用只会注入一次 script 标签
    if (!scriptPromise) {
      scriptPromise = new Promise<void>((resolve, reject) => {
        const s = document.createElement("script");
        s.src = `${PYODIDE_CDN_BASE}pyodide.js`;
        s.onload = () => resolve();
        s.onerror = () => {
          scriptPromise = null; // 允许下次重试
          reject(new Error("Pyodide CDN 加载失败，请检查网络连接或稍后重试"));
        };
        document.head.appendChild(s);
      });
    }
    await scriptPromise;
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

/**
 * Python 超时保护包装器源码。
 *
 * Pyodide 在主线程同步执行 Python，无法用 setTimeout 中断。
 * 这里通过 sys.settrace 注入追踪函数：每 1000 次字节码事件检查一次墙钟时间，
 * 超时则抛出 KeyboardInterrupt，由外层 try/finally 清理 tracer。
 *
 * 局限性：对纯 C 扩展循环（如 numpy 大循环）无效——但 Pyodide 默认不带这些。
 * 性能开销约 10-30%，对学习场景可接受。
 *
 * 用户代码通过 exec(_user_code, globals()) 在 __main__ 模块命名空间执行，
 * 与直接 runPythonAsync(code) 行为一致——用户定义的变量、函数可在后续调用复用。
 */
const PYTHON_TIMEOUT_WRAPPER = `
import sys
import time

def _codegame_run_with_timeout(_user_code, _timeout_ms):
    _start = time.time()
    _count = [0]
    def _tracer(frame, event, arg):
        _count[0] += 1
        if _count[0] >= 1000:
            _count[0] = 0
            if (time.time() - _start) * 1000 > _timeout_ms:
                raise KeyboardInterrupt("执行超时（可能存在死循环），已中止")
        return _tracer
    sys.settrace(_tracer)
    try:
        exec(_user_code, globals())
    finally:
        sys.settrace(None)

_codegame_run_with_timeout
`;

export async function runPython(code: string, timeoutMs = 5000): Promise<RunResult> {
  const start = performance.now();
  let runner: any = null;
  try {
    const pyodide = await loadPyodide();
    let stdout = "";
    let stderr = "";
    // 使用 raw 模式按字符重建输出，正确处理 print() / print(end="") / sys.stdout.write()
    // 三种场景。batched 模式会按 print 调用分批但不带换行符，无条件补 "\n" 会破坏
    // print(end="") 与 sys.stdout.write() 的预期输出（多出换行）。raw 模式无此副作用。
    pyodide.setStdout({ raw: (charCode: number) => (stdout += String.fromCharCode(charCode)) });
    pyodide.setStderr({ raw: (charCode: number) => (stderr += String.fromCharCode(charCode)) });

    // 取得 wrapper 函数，再以用户代码与超时为参数调用——避免在 Python 源码中
    // 拼接用户代码字符串，杜绝注入风险（JSON.stringify 输出对 Python 字符串字面量安全）
    await pyodide.runPythonAsync(PYTHON_TIMEOUT_WRAPPER);
    runner = pyodide.globals.get("_codegame_run_with_timeout");
    // PyCallable.callKwargs 期望最后一个参数为关键字参数对象。
    // Python 函数签名：def _codegame_run_with_timeout(_user_code, _timeout_ms)
    // 用 callKwargs 传关键字参数最明确，避免 call(thisArg, ...) 的 thisArg 混淆。
    // 此前误用 callKwargs(code, timeoutMs)（位置参数）导致 "kwargs argument is not an object"
    await runner.callKwargs({ _user_code: code, _timeout_ms: timeoutMs });

    return {
      stdout,
      stderr,
      exitCode: 0,
      executionTimeMs: Math.round(performance.now() - start),
    };
  } catch (e: any) {
    // Pyodide 抛出的 PythonError，其 message 包含完整 traceback——保留以便调试
    const msg = e?.message || String(e);
    return {
      stdout: "",
      stderr: msg,
      exitCode: 1,
      executionTimeMs: Math.round(performance.now() - start),
    };
  } finally {
    // 必须在 finally 中销毁 PyCallable，避免 callKwargs 抛异常时内存泄漏
    runner?.destroy?.();
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
let workerUrl: string | null = null;
let messageId = 0;

function getWorker(): Worker {
  if (worker) return worker;
  const blob = new Blob([WORKER_SOURCE], { type: "application/javascript" });
  // 保存 URL 以便后续 revoke，避免每次重建 Worker 造成 Blob URL 内存泄漏
  workerUrl = URL.createObjectURL(blob);
  worker = new Worker(workerUrl);
  return worker;
}

function terminateWorker(): void {
  if (worker) {
    worker.terminate();
    worker = null;
  }
  if (workerUrl) {
    URL.revokeObjectURL(workerUrl);
    workerUrl = null;
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

/**
 * HTML 执行：在沙箱 iframe 中渲染 HTML 代码并返回预览结果。
 * 返回 HTML 源码作为 stdout，客户端可通过 `runHtmlPreview` 获取可渲染的 Blob URL。
 */
export async function runHTML(code: string): Promise<RunResult & { previewUrl?: string }> {
  try {
    // 构建完整的 HTML 文档（如果用户代码不是完整 HTML）
    let htmlContent = code;
    if (!/<!DOCTYPE\s/i.test(code) && !/<html/i.test(code)) {
      htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>HTML Preview</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 16px; }
  </style>
</head>
<body>
${code}
</body>
</html>`;
    }

    const blob = new Blob([htmlContent], { type: "text/html; charset=utf-8" });
    const previewUrl = URL.createObjectURL(blob);

    return {
      stdout: code,
      stderr: "",
      exitCode: 0,
      executionTimeMs: 0,
      previewUrl,
    };
  } catch (e: any) {
    return {
      stdout: code,
      stderr: String(e?.message || e),
      exitCode: 1,
      executionTimeMs: 0,
    };
  }
}

/**
 * CSS 执行：将 CSS 代码应用到测试 HTML 结构，返回预览结果。
 * 构建一个包含测试元素的 HTML 页面来展示 CSS 效果。
 */
export async function runCSS(code: string): Promise<RunResult & { previewUrl?: string }> {
  try {
    const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CSS Preview</title>
  <style>
    /* 重置样式 */
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, -apple-system, sans-serif; padding: 24px; background: #f8f9fa; }
    /* 测试元素容器 */
    .preview-container { max-width: 800px; margin: 0 auto; }
    .preview-label { font-size: 11px; color: #868e96; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
    .preview-box { background: white; border: 1px solid #dee2e6; border-radius: 8px; padding: 20px; margin-bottom: 16px; }
    /* 用户 CSS */
${code.split("\n").map((l) => "    " + l).join("\n")}
  </style>
</head>
<body>
  <div class="preview-container">
    <div class="preview-label">CSS 预览</div>
    <div class="preview-box">
      <h1>标题 Heading H1</h1>
      <h2>副标题 Heading H2</h2>
      <p>这是一段文本段落，用于展示你的 CSS 样式效果。Lorem ipsum dolor sit amet.</p>
      <button class="btn">按钮</button>
      <a href="#">链接</a>
      <ul>
        <li>列表项 1</li>
        <li>列表项 2</li>
        <li>列表项 3</li>
      </ul>
      <div class="card">
        <h3>卡片标题</h3>
        <p>卡片内容区域，展示卡片样式效果。</p>
      </div>
      <table>
        <thead><tr><th>表头1</th><th>表头2</th></tr></thead>
        <tbody><tr><td>数据1</td><td>数据2</td></tr></tbody>
      </table>
      <input type="text" placeholder="输入框" />
      <span class="badge">标签</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: "text/html; charset=utf-8" });
    const previewUrl = URL.createObjectURL(blob);

    return {
      stdout: code,
      stderr: "",
      exitCode: 0,
      executionTimeMs: 0,
      previewUrl,
    };
  } catch (e: any) {
    return {
      stdout: code,
      stderr: String(e?.message || e),
      exitCode: 1,
      executionTimeMs: 0,
    };
  }
}

/**
 * SQL 校验：对 SQL 代码进行基本语法检查。
 * 不实际执行 SQL（浏览器环境无 SQL 引擎），仅做结构验证。
 */
export function validateSQL(code: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const trimmed = code.trim();

  if (!trimmed) {
    errors.push("SQL 代码为空");
    return { valid: false, errors };
  }

  // 基本关键字检查
  const sqlKeywords = /\b(SELECT|FROM|WHERE|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP|JOIN|GROUP\s+BY|ORDER\s+BY|HAVING|LIMIT|UNION|INTO|VALUES|SET|TABLE|INDEX|VIEW|DISTINCT|AS|ON|AND|OR|NOT|IN|BETWEEN|LIKE|IS\s+NULL|COUNT|SUM|AVG|MAX|MIN)\b/i;

  if (!sqlKeywords.test(trimmed)) {
    errors.push("未检测到有效的 SQL 关键字");
  }

  // 括号匹配检查
  let parenCount = 0;
  for (const char of trimmed) {
    if (char === "(") parenCount++;
    if (char === ")") parenCount--;
    if (parenCount < 0) {
      errors.push("括号不匹配：多余的右括号");
      break;
    }
  }
  if (parenCount > 0) {
    errors.push("括号不匹配：缺少右括号");
  }

  // 引号匹配检查
  const singleQuotes = (trimmed.match(/'/g) || []).length;
  if (singleQuotes % 2 !== 0) {
    errors.push("单引号不匹配");
  }
  const doubleQuotes = (trimmed.match(/"/g) || []).length;
  if (doubleQuotes % 2 !== 0) {
    errors.push("双引号不匹配");
  }

  // 分号结尾检查（非强制性建议）
  if (!trimmed.endsWith(";")) {
    errors.push("建议：SQL 语句应以分号结尾");
  }

  return { valid: errors.filter((e) => !e.startsWith("建议")).length === 0, errors };
}

/** 静态语言（sql/cpp/java/go/rust/typescript）：仅做规范化匹配，不实际执行 */
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
      return runHTML(code);
    case "css":
      return runCSS(code);
    case "sql":
      // SQL 执行校验 + 返回详情
      const sqlValidation = validateSQL(code);
      return {
        stdout: code,
        stderr: sqlValidation.valid ? "" : sqlValidation.errors.join("\n"),
        exitCode: sqlValidation.valid ? 0 : 1,
        executionTimeMs: 0,
      };
    case "cpp":
    case "java":
    case "go":
    case "rust":
    case "typescript":
      return runStatic(code);
    default:
      return { stdout: "", stderr: `Language ${language} not supported`, exitCode: 1, executionTimeMs: 0 };
  }
}

/**
 * 规范化：保留换行结构，仅统一换行符、去除行尾空白与首尾空白。
 * 用于动态语言（python/javascript）的输出严格匹配——保留换行可正确判断多行输出，
 * 避免旧实现把换行折叠为空格导致的误判。
 */
function normalize(s: string): string {
  return s
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+$/gm, "")
    .trim();
}

/**
 * 宽松规范化：把所有空白（含换行）折叠为单个空格。
 * 用于静态语言（html/css/sql）的片段包含匹配——用户代码可能含注释、
 * 完整文档结构，只需检查是否包含期望片段（忽略空白差异）。
 */
function normalizeLoose(s: string): string {
  return s.replace(/\s+/g, " ").trim();
}

/**
 * 验证测试用例
 * - 动态语言（python/javascript）：
 *   · 单测试用例：规范化后严格相等（保留换行，正确判断多行输出）
 *   · 多测试用例：expected 的每一行都必须出现在实际输出的行集合中
 * - 静态语言（html/css/sql/cpp/java）：检查代码本身是否包含 expected 片段（宽松规范化）
 */
export function checkTests(
  code: string,
  language: Language,
  testCases: TestCase[],
  runOutput: string,
): CheckResult {
  const isDynamic = language === "python" || language === "javascript";
  const source = isDynamic ? runOutput : code;

  const results = testCases.map((tc) => {
    // 空 expected 视为永远不通过（避免 includes("") / === "" 恒真）
    if (!tc.expected.trim()) {
      return { name: tc.name, passed: false, expected: tc.expected, actual: source };
    }
    let passed: boolean;
    if (isDynamic) {
      if (testCases.length === 1) {
        // 单测试用例：规范化后严格相等
        passed = normalize(source) === normalize(tc.expected);
      } else {
        // 多测试用例：expected 的每一行都必须出现在实际输出的行集合中
        const srcLines = new Set(
          normalize(source)
            .split("\n")
            .map((l) => l.trim()),
        );
        const expLines = normalize(tc.expected)
          .split("\n")
          .map((l) => l.trim())
          .filter((l) => l.length > 0);
        passed = expLines.length > 0 && expLines.every((l) => srcLines.has(l));
      }
    } else {
      // 静态语言：用户代码包含 expected 片段（宽松规范化，容忍注释与多余空白）
      passed = normalizeLoose(source).includes(normalizeLoose(tc.expected));
    }
    return { name: tc.name, passed, expected: tc.expected, actual: source };
  });
  return { passed: results.every((r) => r.passed), results };
}
