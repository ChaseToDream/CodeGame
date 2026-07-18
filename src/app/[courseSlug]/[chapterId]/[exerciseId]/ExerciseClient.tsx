"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { findExercise } from "@/data/courses";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { runCode, checkTests, preloadPyodide, getPyodideStatus, retryPyodide, type RunResult, type CheckResult, type PyodideStatus } from "@/lib/code-runner";
import { cn } from "@/lib/utils";
import { SafeMarkdown } from "@/components/content/SafeMarkdown";
import { badges as allBadges } from "@/data/badges";
import type { Badge } from "@/types";
import { BadgeUnlockToast } from "@/components/game/BadgeUnlockToast";

// 懒加载 CodeEditor（含 Monaco），避免首屏加载 ~2MB 编辑器资源
const CodeEditor = dynamic(() => import("@/components/editor/CodeEditor").then((m) => m.CodeEditor), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted text-sm">编辑器加载中...</div>,
});
// 懒加载 LumiPanel（含 framer-motion）和 XPCelebration（含 canvas-confetti），按需加载
const LumiPanel = dynamic(() => import("@/components/lumi/LumiPanel").then((m) => m.LumiPanel), { ssr: false });
const XPCelebration = dynamic(() => import("@/components/game/XPCelebration").then((m) => m.XPCelebration), { ssr: false });

export default function ExerciseClient() {
  const params = useParams<{ courseSlug: string; chapterId: string; exerciseId: string }>();
  const router = useRouter();
  const { courseSlug, chapterId, exerciseId } = params;

  const found = useMemo(
    () => findExercise(courseSlug, chapterId, exerciseId),
    [courseSlug, chapterId, exerciseId],
  );

  const {
    progress,
    ensureCourseInit,
    saveCodeSnapshot,
    completeExercise,
    setExerciseStatus,
  } = useUserStore(
    useShallow((s) => ({
      progress: s.progress,
      ensureCourseInit: s.ensureCourseInit,
      saveCodeSnapshot: s.saveCodeSnapshot,
      completeExercise: s.completeExercise,
      setExerciseStatus: s.setExerciseStatus,
    })),
  );

  const [code, setCode] = useState("");
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [running, setRunning] = useState(false);
  const [checking, setChecking] = useState(false);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [lumiOpen, setLumiOpen] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [pendingBadges, setPendingBadges] = useState<Badge[]>([]);
  const [mobileTab, setMobileTab] = useState<"lesson" | "code">("lesson");
  const [pyodideStatus, setPyodideStatus] = useState<PyodideStatus>("idle");
  // 参考答案折叠面板：仅当练习存在 solutionCode 且本次会话内已通过测试时才显示入口
  // 用 state 而非 ref，确保按钮显示/隐藏能触发重渲染
  const [showSolution, setShowSolution] = useState(false);
  // 课程完成庆祝 modal：仅当本次完成导致该课程所有练习均 completed 时触发
  const [showCourseComplete, setShowCourseComplete] = useState(false);

  // Python 练习：轮询 Pyodide 加载状态，用于显示加载/错误提示
  // 一旦进入 ready 或 error 终态即停止轮询，避免无谓的 re-render 与 CPU 消耗
  useEffect(() => {
    if (found?.exercise.language !== "python") return;
    setPyodideStatus(getPyodideStatus());
    const timer = setInterval(() => {
      const next = getPyodideStatus();
      setPyodideStatus(next);
      // ready / error 是终态，停止轮询
      if (next === "ready" || next === "error") clearInterval(timer);
    }, 500);
    return () => clearInterval(timer);
  }, [found?.exercise.language, exerciseId]);

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const alreadyCompleted = useRef(false);

  // 扁平化所有练习，找 prev/next。
  // 用 useMemo 包装避免每次渲染都重新创建数组与重算，
  // 依赖 found（其本身已 memo，随 exerciseId/courseSlug 变化才重算）
  const flatExercises = useMemo(() => {
    if (!found) return [];
    return found.course.chapters.flatMap((c) =>
      c.exercises.map((e) => ({ ex: e, ch: c })),
    );
  }, [found]);

  // 初始化课程进度并加载代码
  useEffect(() => {
    if (!found) return;
    ensureCourseInit(courseSlug);
    const saved = progress.codeSnapshots[exerciseId];
    setCode(saved ?? found.exercise.starterCode);
    alreadyCompleted.current = progress.statuses[exerciseId] === "completed";
    setRunResult(null);
    setCheckResult(null);
    // Python 练习：空闲时预加载 Pyodide，避免首次运行等待 ~10MB 下载
    if (found.exercise.language === "python") {
      const idle = (window as any).requestIdleCallback || ((cb: () => void) => setTimeout(cb, 200));
      idle(() => preloadPyodide());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [exerciseId, courseSlug]);

  // 自动保存（防抖 1.5s）
  const scheduleSave = useCallback(
    (newCode: string) => {
      setSaveStatus("saving");
      if (saveTimer.current) clearTimeout(saveTimer.current);
      saveTimer.current = setTimeout(() => {
        saveCodeSnapshot(exerciseId, newCode);
        setSaveStatus("saved");
      }, 1500);
    },
    [exerciseId, saveCodeSnapshot],
  );

  const handleChange = (newCode: string) => {
    setCode(newCode);
    setExerciseStatus(exerciseId, "in_progress");
    scheduleSave(newCode);
  };

  const handleRun = async () => {
    if (!found || running || checking) return;
    setRunning(true);
    setCheckResult(null);
    // try/finally 保证 runCode 抛异常时也能解除 running 状态，避免按钮永久卡死
    try {
      const result = await runCode(code, found.exercise.language);
      setRunResult(result);
    } finally {
      setRunning(false);
    }
  };

  const handleCheck = async () => {
    if (!found || running || checking) return;
    setChecking(true);
    // try/finally 保证 runCode/checkTests 抛异常时也能解除 checking 状态
    try {
      const result = await runCode(code, found.exercise.language);
      setRunResult(result);
      const check = checkTests(code, found.exercise.language, found.exercise.testCases, result.stdout);
      setCheckResult(check);
      if (check.passed) {
        // 首次完成才奖励 XP，并收集本次新解锁的徽章用于庆祝反馈
        if (!alreadyCompleted.current) {
          alreadyCompleted.current = true;
          const newBadgeIds = completeExercise(exerciseId, found.exercise.xpReward);
          setShowXp(true);
          if (newBadgeIds.length > 0) {
            const newBadges = newBadgeIds
              .map((id) => allBadges.find((b) => b.id === id))
              .filter((b): b is Badge => !!b);
            if (newBadges.length > 0) setPendingBadges(newBadges);
          }
          // 课程完成检测：本次完成后该课程所有练习均 completed 时，触发通关庆祝
          // 仅在"首次完成"路径中触发，避免重复完成时反复弹窗
          const allExercises = found.course.chapters.flatMap((c) => c.exercises);
          const allDone =
            allExercises.length > 0 &&
            allExercises.every(
              (e) => e.id === exerciseId || useUserStore.getState().progress.statuses[e.id] === "completed",
            );
          if (allDone) setShowCourseComplete(true);
        }
      }
    } finally {
      setChecking(false);
    }
  };

  const handleReset = () => {
    if (!found) return;
    setCode(found.exercise.starterCode);
    setRunResult(null);
    setCheckResult(null);
    scheduleSave(found.exercise.starterCode);
  };

  if (!found) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">未找到练习</h1>
        <Link href="/courses" className="text-accent hover:text-accent2">← 返回课程</Link>
      </div>
    );
  }

  const { course, chapter, exercise } = found;

  // flatExercises 已在上方 useMemo 化，这里仅做派生计算
  const currentIdx = flatExercises.findIndex((x) => x.ex.id === exercise.id);
  const prev = currentIdx > 0 ? flatExercises[currentIdx - 1] : null;
  const next = currentIdx < flatExercises.length - 1 ? flatExercises[currentIdx + 1] : null;

  const completedCount = flatExercises.filter(
    (x) => progress.statuses[x.ex.id] === "completed",
  ).length;
  const pct = flatExercises.length === 0
    ? 0
    : Math.round((completedCount / flatExercises.length) * 100);

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Top bar */}
      <div className="border-b border-rule bg-bg2/80 backdrop-blur px-3 sm:px-4 py-2.5 flex items-center gap-2 sm:gap-4">
        <Link href={`/${course.slug}`} className="flex items-center gap-2 hover:text-accent transition shrink-0">
          <span className="text-xl">{course.icon}</span>
          <span className="hidden sm:inline text-sm font-medium text-ink">{course.title}</span>
        </Link>
        <div className="hidden md:flex items-center gap-2 text-xs text-muted">
          <span>{chapter.title}</span>
          <span>›</span>
          <span className="text-ink">{exercise.title}</span>
        </div>

        {/* Progress */}
        <div className="hidden lg:flex items-center gap-2 flex-1 max-w-xs">
          <div className="flex-1 h-1.5 rounded-full bg-bg3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent2 transition-all"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-[11px] text-muted">{pct}%</span>
        </div>

        {/* Prev / Next */}
        <div className="ml-auto flex items-center gap-1.5">
          {prev ? (
            <button
              onClick={() => router.push(`/${course.slug}/${prev.ch.id}/${prev.ex.id}`)}
              className="px-2.5 py-1.5 rounded text-xs border border-rule text-muted hover:text-ink hover:border-accent transition"
              title={prev.ex.title}
            >
              ← <span className="hidden sm:inline">上一题</span>
            </button>
          ) : (
            <span className="px-2.5 py-1.5 text-xs text-muted/40">← <span className="hidden sm:inline">上一题</span></span>
          )}
          {next ? (
            <button
              onClick={() => router.push(`/${course.slug}/${next.ch.id}/${next.ex.id}`)}
              className={cn(
                "px-2.5 py-1.5 rounded text-xs font-semibold border transition",
                checkResult?.passed
                  ? "bg-accent text-white border-accent hover:shadow-glow"
                  : "border-rule text-muted hover:text-ink hover:border-accent",
              )}
              title={next.ex.title}
            >
              <span className="hidden sm:inline">下一题</span> →
            </button>
          ) : (
            <Link
              href={`/${course.slug}`}
              className="px-2.5 py-1.5 rounded text-xs font-semibold border border-success text-success hover:bg-success hover:text-bg transition"
            >
              完成 ✓
            </Link>
          )}
          <button
            onClick={() => setLumiOpen(true)}
            className="px-3 py-1.5 rounded text-xs font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:shadow-glow transition flex items-center gap-1.5"
          >
            🤖 <span className="hidden sm:inline">向 Lumi 提问</span>
          </button>
        </div>
      </div>

      {/* Mobile tab switcher */}
      <div className="md:hidden flex border-b border-rule bg-bg2">
        <button
          onClick={() => setMobileTab("lesson")}
          className={cn(
            "flex-1 py-2 text-xs font-medium border-b-2",
            mobileTab === "lesson" ? "border-accent text-accent" : "border-transparent text-muted",
          )}
        >
          📖 课程
        </button>
        <button
          onClick={() => setMobileTab("code")}
          className={cn(
            "flex-1 py-2 text-xs font-medium border-b-2",
            mobileTab === "code" ? "border-accent text-accent" : "border-transparent text-muted",
          )}
        >
          💻 代码
        </button>
      </div>

      {/* Main split */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Lesson */}
        <div
          className={cn(
            "md:w-1/2 overflow-auto p-5 sm:p-6 bg-bg",
            mobileTab === "lesson" ? "block" : "hidden md:block",
          )}
        >
          <div className="max-w-2xl mx-auto">
            <div className="mb-4 flex items-center gap-2 text-xs text-muted">
              <span className="px-2 py-0.5 rounded bg-bg3">{course.title}</span>
              <span>·</span>
              <span>{chapter.title}</span>
            </div>
            <div className="prose-cdx">
              <SafeMarkdown>{exercise.contentMd}</SafeMarkdown>
            </div>
            <div className="mt-8 p-4 rounded-lg border border-accent/30 bg-accent/5 text-sm">
              <div className="font-bold text-accent mb-1">🎯 你的任务</div>
              <p className="text-muted">
                在右侧编辑器中完成练习。点击<strong className="text-success">检查</strong>验证你的答案，并赚取 <strong className="text-accent2">+{exercise.xpReward} XP</strong>。
              </p>
            </div>

            {/* 参考答案折叠面板：仅当练习存在 solutionCode 且本次会话内已通过测试时才显示入口
                这样既不剧透答案，也避免学习者卡死无解 */}
            {exercise.solutionCode && checkResult?.passed && (
              <div className="mt-4 rounded-lg border border-accent2/30 bg-accent2/5 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowSolution((v) => !v)}
                  className="w-full px-4 py-3 flex items-center justify-between text-sm font-bold text-accent2 hover:bg-accent2/10 transition"
                  aria-expanded={showSolution}
                  aria-controls="solution-panel"
                >
                  <span>💡 查看参考答案</span>
                  <span
                    className={cn("text-xs transition-transform", showSolution && "rotate-180")}
                    aria-hidden="true"
                  >
                    ▼
                  </span>
                </button>
                {showSolution && (
                  <pre
                    id="solution-panel"
                    className="px-4 pb-4 pt-1 text-xs font-mono text-ink overflow-x-auto whitespace-pre-wrap leading-relaxed border-t border-accent2/20 bg-bg/40"
                  >
                    {exercise.solutionCode}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Divider (desktop) - 视觉分隔，宽度固定不可拖拽 */}
        <div className="hidden md:block w-px bg-rule" />

        {/* Editor */}
        <div
          className={cn(
            "md:w-1/2 flex flex-col bg-codebg",
            mobileTab === "code" ? "flex" : "hidden md:flex",
          )}
        >
          {/* Python 加载/错误状态提示 */}
          {exercise.language === "python" && pyodideStatus === "loading" && (
            <div className="px-4 py-2 bg-accent2/10 border-b border-accent2/30 text-xs text-accent2 flex items-center gap-2">
              <span className="inline-block w-3 h-3 border-2 border-accent2/40 border-t-accent2 rounded-full animate-spin" />
              Python 运行环境加载中（首次约 10MB，请稍候）...
            </div>
          )}
          {exercise.language === "python" && pyodideStatus === "error" && (
            <div className="px-4 py-2 bg-error/10 border-b border-error/30 text-xs text-error flex items-center justify-between gap-2">
              <span>Python 环境加载失败，请检查网络后重试</span>
              <button
                type="button"
                onClick={() => {
                  retryPyodide();
                  preloadPyodide();
                }}
                className="px-2 py-0.5 rounded bg-error/20 hover:bg-error/30 text-error font-bold"
              >
                重试
              </button>
            </div>
          )}
          <CodeEditor
            language={exercise.language}
            initialCode={exercise.starterCode}
            value={code}
            onChange={handleChange}
            onRun={handleRun}
            onCheck={handleCheck}
            onReset={handleReset}
            runResult={runResult}
            checkResult={checkResult}
            running={running}
            checking={checking}
            saveStatus={saveStatus}
          />
        </div>
      </div>

      {/* Bottom info */}
      <div className="border-t border-rule bg-bg2 px-4 py-2 text-[11px] text-muted flex items-center justify-between">
        <span>{chapter.title}</span>
        <span>第 {currentIdx + 1} 题，共 {flatExercises.length} 题</span>
      </div>

      {/* Lumi */}
      <LumiPanel
        open={lumiOpen}
        onClose={() => setLumiOpen(false)}
        exercise={exercise}
        userCode={code}
      />

      {/* XP celebration */}
      <XPCelebration
        xp={exercise.xpReward}
        trigger={showXp}
        onComplete={() => setShowXp(false)}
      />

      {/* Badge unlock toast */}
      <BadgeUnlockToast
        badges={pendingBadges}
        onDismiss={() => setPendingBadges((prev) => prev.slice(1))}
      />

      {/* 课程通关庆祝 modal：仅在本次完成导致该课程所有练习均 completed 时触发
          点击遮罩关闭、提供"返回课程目录"和"探索更多课程"两个出口 */}
      {showCourseComplete && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowCourseComplete(false);
          }}
          role="presentation"
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-complete-title"
            className="bg-bg2 border border-accent rounded-xl p-6 sm:p-8 max-w-md w-full text-center shadow-card"
          >
            <div className="text-6xl mb-4" aria-hidden="true">🏆</div>
            <h2
              id="course-complete-title"
              className="font-outfit text-2xl font-bold mb-2 gradient-text"
            >
              课程通关！
            </h2>
            <p className="text-muted mb-6 text-sm leading-relaxed">
              恭喜你完成了 <span className="text-ink font-semibold">{course.title}</span> 的全部练习！
              <br />
              继续探索其他课程，巩固你的编程能力。
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link
                href={`/${course.slug}`}
                className="px-4 py-2 rounded-lg border border-rule text-sm text-ink hover:border-accent hover:text-accent transition"
                onClick={() => setShowCourseComplete(false)}
              >
                返回课程目录
              </Link>
              <Link
                href="/courses"
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white text-sm font-semibold hover:shadow-glow transition"
                onClick={() => setShowCourseComplete(false)}
              >
                探索更多课程 →
              </Link>
            </div>
            <button
              type="button"
              onClick={() => setShowCourseComplete(false)}
              className="mt-4 text-xs text-muted hover:text-ink transition"
            >
              继续留在这里
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
