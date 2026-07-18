"use client";

import { useEffect, useRef, useState } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import { cn } from "@/lib/utils";
import type { Language } from "@/types";
import type { RunResult, CheckResult } from "@/lib/code-runner";

interface CodeEditorProps {
  language: Language;
  initialCode: string;
  value: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onCheck: () => void;
  onReset: () => void;
  runResult: RunResult | null;
  checkResult: CheckResult | null;
  running: boolean;
  checking: boolean;
  saveStatus: "idle" | "saving" | "saved";
}

const MONACO_LANG_MAP: Record<Language, string> = {
  python: "python",
  javascript: "javascript",
  html: "html",
  css: "css",
  sql: "sql",
  cpp: "cpp",
  java: "java",
  go: "go",
  rust: "rust",
  typescript: "typescript",
};

export function CodeEditor({
  language,
  initialCode,
  value,
  onChange,
  onRun,
  onCheck,
  onReset,
  runResult,
  checkResult,
  running,
  checking,
  saveStatus,
}: CodeEditorProps) {
  const editorRef = useRef<any>(null);
  // 用 useState 让"再次点击确认重置"提示能响应式显示——useRef 不会触发重渲染
  const [confirmReset, setConfirmReset] = useState(false);

  // 持有最新的 onRun 回调。addCommand 在挂载时注册一次，捕获的是初始 onRun 闭包，
  // 它会绑定父组件初次渲染时的 code 状态——后续编辑的代码永远无法通过快捷键运行。
  // 这里通过 ref 间接调用，确保快捷键始终触发最新的 onRun。
  const onRunRef = useRef(onRun);
  useEffect(() => {
    onRunRef.current = onRun;
  });

  // 2.5s 后自动取消确认态，避免用户点了一次后永远需要双击
  useEffect(() => {
    if (!confirmReset) return;
    const t = setTimeout(() => setConfirmReset(false), 2500);
    return () => clearTimeout(t);
  }, [confirmReset]);

  // 在编辑器挂载前定义暗色主题，避免初始化瞬间闪现默认亮色背景
  const handleBeforeMount = (monaco: any) => {
    monaco.editor.defineTheme("codegame-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#16162a",
        "editor.foreground": "#e8e8f0",
        "editorLineNumber.foreground": "#3a3a5c",
        "editorLineNumber.activeForeground": "#7c5cfc",
        "editor.selectionBackground": "#2d2d52",
        "editor.lineHighlightBackground": "#1f1f38",
        "editorCursor.foreground": "#7c5cfc",
        "editorIndentGuide.background": "#2a2a44",
      },
    });
  };

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monaco.editor.setTheme("codegame-dark");
    // Ctrl+Enter 运行：通过 ref 调用最新 onRun，避免闭包过期运行旧代码
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => onRunRef.current());
  };

  const handleReset = () => {
    if (!confirmReset) {
      setConfirmReset(true);
      return;
    }
    // 调用父组件传入的 onReset，让父组件统一处理：清空运行结果、触发自动保存等
    onReset();
    setConfirmReset(false);
  };

  return (
    <div className="flex flex-col h-full bg-codebg">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-bg2 border-b border-rule flex-wrap">
        <button
          onClick={onRun}
          disabled={running}
          className={cn(
            "px-3 py-1.5 rounded text-xs font-bold border transition flex items-center gap-1.5",
            "border-accent/60 text-accent hover:bg-accent hover:text-white",
            running && "opacity-60 cursor-wait",
          )}
        >
          {running ? <Spinner /> : "▶"} 运行
        </button>
        <button
          onClick={onCheck}
          disabled={checking}
          className={cn(
            "px-3 py-1.5 rounded text-xs font-bold border transition flex items-center gap-1.5",
            "border-success/60 text-success hover:bg-success hover:text-bg",
            checking && "opacity-60 cursor-wait",
          )}
        >
          {checking ? <Spinner /> : "✓"} 检查
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded text-xs font-bold border border-rule text-muted hover:text-ink hover:border-muted transition"
        >
          ↺ 重置
        </button>
        {confirmReset && (
          <span className="text-[11px] text-warning animate-pulse">再次点击确认重置</span>
        )}
        <div className="ml-auto text-[11px] text-muted flex items-center gap-2">
          {saveStatus === "saving" && <><Spinner /> 保存中...</>}
          {saveStatus === "saved" && <span className="text-success">✓ 已保存</span>}
          {saveStatus === "idle" && <span>未保存</span>}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[260px] bg-codebg">
        <Editor
          height="100%"
          language={MONACO_LANG_MAP[language]}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          beforeMount={handleBeforeMount}
          onMount={handleMount}
          theme="codegame-dark"
          loading={
            <div className="h-full w-full flex items-center justify-center bg-codebg text-muted text-xs">
              <span className="inline-block w-4 h-4 border-2 border-muted/30 border-t-accent rounded-full animate-spin mr-2" />
              编辑器加载中...
            </div>
          }
          options={{
            fontSize: 14,
            fontFamily: "var(--font-mono), monospace",
            minimap: { enabled: false },
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            tabSize: 4,
            automaticLayout: true,
            padding: { top: 12, bottom: 12 },
            wordWrap: "on",
          }}
        />
      </div>

      {/* Console */}
      <div className="h-[180px] bg-codebg border-t border-rule flex flex-col">
        <div className="px-3 py-1.5 bg-bg2 text-[11px] text-muted uppercase tracking-wide flex items-center justify-between border-b border-rule">
          <span>控制台</span>
          <span className="text-[10px] hidden sm:inline">Ctrl+Enter 运行</span>
        </div>
        <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
          {!runResult && !checkResult && (
            <span className="text-muted">控制台输出将显示在这里。</span>
          )}
          {runResult?.stdout && (
            <pre className="whitespace-pre-wrap text-ink">{runResult.stdout}</pre>
          )}
          {runResult?.stderr && (
            <pre className="whitespace-pre-wrap text-accent2">{runResult.stderr}</pre>
          )}
          {checkResult && (
            <div className="mt-2 space-y-1">
              {checkResult.results.map((r, i) => (
                <div
                  key={i}
                  className={cn(
                    "px-2 py-1.5 rounded border text-xs",
                    r.passed
                      ? "border-success/40 bg-success/10 text-success"
                      : "border-accent2/40 bg-accent2/10 text-accent2",
                  )}
                >
                  <div className="flex items-center gap-2 font-bold">
                    <span>{r.passed ? "✓" : "✗"}</span>
                    <span>{r.name}</span>
                  </div>
                  {!r.passed && (
                    <div className="mt-1 font-mono text-[11px] text-muted">
                      <div>期望输出：<span className="text-success">{JSON.stringify(r.expected)}</span></div>
                      <div>实际输出：<span className="text-accent2">{JSON.stringify(r.actual)}</span></div>
                    </div>
                  )}
                </div>
              ))}
              {checkResult.passed && (
                <div className="px-2 py-2 rounded bg-success/10 text-success font-bold text-sm">
                  🎉 所有测试通过！
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" opacity="0.25" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
