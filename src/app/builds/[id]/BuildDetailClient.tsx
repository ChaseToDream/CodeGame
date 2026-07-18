"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { builds as seedBuilds } from "@/data/builds";
import { timeAgo, formatNumber, cn, getBuildIcon } from "@/lib/utils";
import { buildPreviewDoc } from "@/lib/preview-doc";
import { BookmarkButton } from "@/components/game/BookmarkButton";
import { ShareButton } from "@/components/common/ShareButton";

const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full bg-codebg text-muted text-sm">加载中...</div>,
});

const MONACO_LANG: Record<string, string> = { html: "html", css: "css", js: "javascript" };
const LANG_ICON: Record<string, string> = { html: "📄", css: "🎨", js: "⚡" };

type DeviceSize = "desktop" | "tablet" | "mobile";

const DEVICE_CONFIG: Record<DeviceSize, { width: string; label: string; icon: string }> = {
  desktop: { width: "100%", label: "桌面", icon: "🖥" },
  tablet: { width: "768px", label: "平板", icon: "📱" },
  mobile: { width: "375px", label: "手机", icon: "📲" },
};

export default function BuildDetailClient() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { builds, forkBuild, incrementBuildView, toggleBuildLike } = useUserStore(useShallow((s) => ({ builds: s.builds, forkBuild: s.forkBuild, incrementBuildView: s.incrementBuildView, toggleBuildLike: s.toggleBuildLike })));
  const [activeFile, setActiveFile] = useState(0);
  const [view, setView] = useState<"preview" | "code">("preview");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [deviceSize, setDeviceSize] = useState<DeviceSize>("desktop");

  // 所有 Hooks 必须在任何 early return 之前调用，避免 Hooks 顺序不一致
  // 合并去重：用户 builds 优先（包含最新草稿），再补 seedBuilds 中未出现的
  const build = useMemo(() => {
    const seen = new Set(builds.map((b) => b.id));
    const merged = [...builds, ...seedBuilds.filter((b) => !seen.has(b.id))];
    return merged.find((b) => b.id === params.id);
  }, [builds, params.id]);

  // 进入作品详情时浏览量 +1（仅对本地 store 中的作品生效，种子作品为静态数据不变）
  // 依赖 params.id：同组件不同 id 切换时重新计数。
  // 注意：React StrictMode 开发模式下 effect 会双调用，导致 viewCount +2；生产模式仅 +1。
  // 这里不强制去重，以保持"每次访问都计数"的语义；如需严格幂等可在 store 中按 (id,dayKey) 去重。
  useEffect(() => {
    if (params.id) incrementBuildView(params.id);
  }, [params.id, incrementBuildView]);

  // 切换到不同作品时重置文件索引，避免上一作品的 activeFile 越界（如从 3 文件作品切到 2 文件作品时 activeFile=2 越界）
  useEffect(() => {
    setActiveFile(0);
    setIsFullscreen(false);
    setDeviceSize("desktop");
  }, [params.id]);

  // 全屏模式 Esc 退出
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen((v) => !v);
  }, []);

  const previewDoc = useMemo(() => {
    if (!build) return "";
    return buildPreviewDoc(build.files);
  }, [build]);

  if (!build) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <div className="text-5xl mb-4">🧭</div>
        <h1 className="font-outfit text-2xl font-bold mb-2">未找到作品</h1>
        <Link href="/builds" className="text-accent hover:text-accent2">← 返回作品</Link>
      </div>
    );
  }

  // 防御性：files 为空或 activeFile 越界时 file 可能为 undefined
  const file = build.files[activeFile];

  const handleFork = () => {
    const id = forkBuild(build.id);
    if (id) router.push(`/builds/${id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <nav className="text-sm text-muted mb-4">
        <Link href="/builds" className="hover:text-ink">作品</Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{build.title}</span>
      </nav>

      <div className="flex flex-col sm:flex-row items-start gap-4 mb-6">
        <div
          className="h-16 w-16 rounded-xl flex items-center justify-center text-3xl shrink-0"
          style={{ background: build.thumbnailGradient }}
        >
          {getBuildIcon(build.title)}
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="font-outfit text-2xl sm:text-3xl font-bold">{build.title}</h1>
          <p className="text-muted text-sm mt-1">{build.description || "暂无描述"}</p>
          <div className="mt-2 flex items-center gap-3 flex-wrap text-xs text-muted">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-full" style={{ background: build.authorAvatar }} />
              <span>@{build.authorName}</span>
            </div>
            <span>·</span>
            <span>{timeAgo(build.createdAt)}</span>
            <span>·</span>
            <span>👁 {formatNumber(build.viewCount)} 次浏览</span>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            onClick={() => toggleBuildLike(build.id)}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition flex items-center gap-1.5",
              build.likedByMe
                ? "border-accent2 bg-accent2/10 text-accent2"
                : "border-rule text-muted hover:text-accent2 hover:border-accent2/50",
            )}
            aria-pressed={build.likedByMe ?? false}
            aria-label={build.likedByMe ? "取消点赞" : "点赞作品"}
          >
            <span>❤️</span>
            <span>{build.likeCount}</span>
          </button>
          {/* 收藏按钮：与点赞/复刻并列，详情页独立按钮场景 */}
          <BookmarkButton type="build" id={build.id} withLabel size="md" stopPropagation={false} />
          {/* 分享按钮：复制作品链接 */}
          <ShareButton
            title={`${build.title} · CodeGame`}
            text={`看看我在 CodeGame 上发现的作品：${build.title}`}
            size="md"
            withLabel
            stopPropagation={false}
          />
          <button
            onClick={handleFork}
            className="px-4 py-2 rounded-lg border border-rule text-sm text-ink hover:border-accent transition flex items-center gap-1.5"
          >
            🍴 复刻
          </button>
          <Link
            href="/builds/new"
            className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white text-sm font-semibold hover:shadow-glow transition"
          >
            + 新建作品
          </Link>
        </div>
      </div>

      {/* View switch */}
      <div className="flex gap-1 border-b border-rule mb-4">
        {(["preview", "code"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition capitalize",
              view === v ? "border-accent text-accent" : "border-transparent text-muted hover:text-ink",
            )}
          >
            {v === "preview" ? "👁 在线演示" : "💻 查看代码"}
          </button>
        ))}
      </div>

      {view === "preview" ? (
        <>
          {/* 预览工具栏 */}
          <div className="flex items-center justify-between mb-2 gap-2 flex-wrap">
            <div className="flex items-center gap-1 bg-bg2 rounded-lg border border-rule p-0.5">
              {(Object.entries(DEVICE_CONFIG) as [DeviceSize, typeof DEVICE_CONFIG[DeviceSize]][]).map(
                ([key, config]) => (
                  <button
                    key={key}
                    onClick={() => setDeviceSize(key)}
                    title={config.label}
                    className={cn(
                      "px-2.5 py-1.5 rounded-md text-xs font-medium transition flex items-center gap-1",
                      deviceSize === key
                        ? "bg-accent/15 text-accent"
                        : "text-muted hover:text-ink",
                    )}
                  >
                    <span>{config.icon}</span>
                    <span className="hidden sm:inline">{config.label}</span>
                  </button>
                ),
              )}
            </div>
            <button
              onClick={toggleFullscreen}
              className="px-3 py-1.5 rounded-lg border border-rule text-xs text-muted hover:text-ink hover:border-accent/50 transition flex items-center gap-1"
              title="全屏预览"
            >
              <span>⛶</span>
              <span className="hidden sm:inline">全屏</span>
            </button>
          </div>

          {/* 预览区域 */}
          <div className="rounded-xl overflow-hidden border border-rule bg-white flex justify-center">
            <div
              className="transition-all duration-200"
              style={{ width: DEVICE_CONFIG[deviceSize].width }}
            >
              <div
                className={cn(
                  "relative border-r border-l border-rule/30",
                  deviceSize !== "desktop" && "shadow-lg",
                )}
              >
                <iframe
                  srcDoc={previewDoc}
                  title={build.title}
                  sandbox="allow-scripts"
                  className="w-full border-none"
                  style={{ height: deviceSize === "mobile" ? "667px" : "500px" }}
                />
              </div>
            </div>
          </div>

        {/* 全屏预览覆盖层 */}
        {isFullscreen && (
          <div className="fixed inset-0 z-[100] bg-bg flex flex-col">
            {/* 全屏工具栏 */}
            <div className="flex items-center justify-between px-4 py-2 bg-bg2 border-b border-rule shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-outfit text-sm font-bold text-ink">{build.title}</span>
                <div className="flex items-center gap-1 bg-bg3 rounded-lg border border-rule p-0.5">
                  {(Object.entries(DEVICE_CONFIG) as [DeviceSize, typeof DEVICE_CONFIG[DeviceSize]][]).map(
                    ([key, config]) => (
                      <button
                        key={key}
                        onClick={() => setDeviceSize(key)}
                        title={config.label}
                        className={cn(
                          "px-2.5 py-1 rounded-md text-xs font-medium transition flex items-center gap-1",
                          deviceSize === key
                            ? "bg-accent/15 text-accent"
                            : "text-muted hover:text-ink",
                        )}
                      >
                        <span>{config.icon}</span>
                        <span className="hidden sm:inline">{config.label}</span>
                      </button>
                    ),
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-muted/60">按 Esc 退出</span>
                <button
                  onClick={toggleFullscreen}
                  className="px-3 py-1.5 rounded-lg bg-bg3 border border-rule text-xs text-ink hover:border-accent/50 transition"
                >
                  ✕ 退出全屏
                </button>
              </div>
            </div>
            {/* 全屏预览内容 */}
            <div className="flex-1 flex justify-center items-start overflow-auto bg-white p-4">
              <div
                className="transition-all duration-200"
                style={{ width: DEVICE_CONFIG[deviceSize].width }}
              >
                <div
                  className={cn(
                    "relative",
                    deviceSize !== "desktop" && "shadow-lg border border-rule/30 rounded-lg overflow-hidden",
                  )}
                >
                  <iframe
                    srcDoc={previewDoc}
                    title={build.title}
                    sandbox="allow-scripts"
                    className="w-full border-none"
                    style={{
                      height: deviceSize === "mobile"
                        ? "calc(100vh - 80px)"
                        : deviceSize === "tablet"
                          ? "calc(100vh - 80px)"
                          : "calc(100vh - 80px)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        </>
      ) : (
        <div className="rounded-xl overflow-hidden border border-rule bg-codebg">
          <div className="flex border-b border-rule bg-bg2">
            {build.files.map((f, i) => (
              <button
                key={f.name + i}
                onClick={() => setActiveFile(i)}
                className={cn(
                  "px-3 py-2 text-xs font-mono border-r border-rule transition flex items-center gap-1.5",
                  i === activeFile ? "bg-codebg text-accent" : "text-muted hover:text-ink",
                )}
              >
                <span>{LANG_ICON[f.language]}</span>
                {f.name}
              </button>
            ))}
          </div>
          <div className="h-[460px] bg-codebg">
            {file ? (
              <Monaco
                height="100%"
                language={MONACO_LANG[file.language]}
                value={file.content}
                theme="vs-dark"
                options={{
                  fontSize: 13,
                  fontFamily: "var(--font-mono), monospace",
                  minimap: { enabled: false },
                  readOnly: true,
                  wordWrap: "on",
                  automaticLayout: true,
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-muted text-sm">
                该作品暂无可查看的文件
              </div>
            )}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-muted">
          用 ❤️ 在 CodeGame 上构建。{" "}
          <Link href="/builds/new" className="text-accent hover:underline">创建你自己的 →</Link>
        </p>
      </div>
    </div>
  );
}
