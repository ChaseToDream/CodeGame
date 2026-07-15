"use client";

import { useEffect, useRef, useCallback } from "react";
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
  const confirmReset = useRef(false);

  const handleMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    // 自定义暗色主题
    monaco.editor.defineTheme("codedex-dark", {
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
    monaco.editor.setTheme("codedex-dark");
    // Ctrl+Enter 运行
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, onRun);
  };

  const handleReset = useCallback(() => {
    if (!confirmReset.current) {
      confirmReset.current = true;
      setTimeout(() => (confirmReset.current = false), 2500);
      return;
    }
    onChange(initialCode);
  }, [initialCode, onChange]);

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
          {running ? <Spinner /> : "▶"} Run
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
          {checking ? <Spinner /> : "✓"} Check
        </button>
        <button
          onClick={handleReset}
          className="px-3 py-1.5 rounded text-xs font-bold border border-rule text-muted hover:text-ink hover:border-muted transition"
        >
          ↺ Reset
        </button>
        {confirmReset.current && (
          <span className="text-[11px] text-warning animate-pulse">Click again to confirm reset</span>
        )}
        <div className="ml-auto text-[11px] text-muted flex items-center gap-2">
          {saveStatus === "saving" && <><Spinner /> Saving...</>}
          {saveStatus === "saved" && <span className="text-success">✓ Saved</span>}
          {saveStatus === "idle" && <span>Unsaved</span>}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-[260px]">
        <Editor
          height="100%"
          language={MONACO_LANG_MAP[language]}
          value={value}
          onChange={(v) => onChange(v ?? "")}
          onMount={handleMount}
          theme="codedex-dark"
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
          <span>Console</span>
          <span className="text-[10px]">Ctrl+Enter to run</span>
        </div>
        <div className="flex-1 overflow-auto p-3 font-mono text-xs leading-relaxed">
          {!runResult && !checkResult && (
            <span className="text-muted">Console output will appear here.</span>
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
                      <div>Expected: <span className="text-success">{JSON.stringify(r.expected)}</span></div>
                      <div>Actual: <span className="text-accent2">{JSON.stringify(r.actual)}</span></div>
                    </div>
                  )}
                </div>
              ))}
              {checkResult.passed && (
                <div className="px-2 py-2 rounded bg-success/10 text-success font-bold text-sm">
                  🎉 All tests passed!
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
