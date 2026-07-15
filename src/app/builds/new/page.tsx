"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import type { BuildFile } from "@/types";
import { cn } from "@/lib/utils";

const Monaco = dynamic(() => import("@monaco-editor/react").then((m) => m.default), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-full text-muted text-sm">编辑器加载中...</div>,
});

const TEMPLATES: { name: string; emoji: string; files: BuildFile[] }[] = [
  {
    name: "空白项目",
    emoji: "📄",
    files: [
      { name: "index.html", language: "html", content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>My Build</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1>Hello, CodeGame!</h1>\n  <script src=\"script.js\"></script>\n</body>\n</html>" },
      { name: "style.css", language: "css", content: "body {\n  font-family: sans-serif;\n  background: #1a1a2e;\n  color: #e8e8f0;\n  text-align: center;\n  padding: 2rem;\n}\nh1 {\n  color: #7c5cfc;\n}" },
      { name: "script.js", language: "js", content: "console.log('Build loaded!');" },
    ],
  },
  {
    name: "个人网站",
    emoji: "👤",
    files: [
      { name: "index.html", language: "html", content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>About Me</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <header>\n    <h1>Hi, I'm a CodeGame Learner</h1>\n    <p>Future developer in training ⚔️</p>\n  </header>\n  <main>\n    <section>\n      <h2>My Skills</h2>\n      <ul>\n        <li>HTML</li>\n        <li>CSS</li>\n        <li>JavaScript (learning!)</li>\n      </ul>\n    </section>\n  </main>\n  <script src=\"script.js\"></script>\n</body>\n</html>" },
      { name: "style.css", language: "css", content: "* { margin: 0; box-sizing: border-box; }\nbody { font-family: sans-serif; background: linear-gradient(135deg, #1a1a2e, #252544); color: #e8e8f0; min-height: 100vh; padding: 2rem; }\nheader { text-align: center; margin-bottom: 2rem; }\nh1 { color: #7c5cfc; font-size: 2rem; }\np { color: #a0a0b8; }\nsection { max-width: 600px; margin: 0 auto; background: rgba(45,45,82,0.5); padding: 1.5rem; border-radius: 12px; }\nh2 { color: #ff6b9d; margin-bottom: 1rem; }\nli { color: #4ecdc4; margin: 0.5rem 0; }" },
      { name: "script.js", language: "js", content: "// Add a little interactivity\ndocument.querySelector('h1').addEventListener('click', () => {\n  alert('Thanks for visiting! 🌟');\n});" },
    ],
  },
  {
    name: "像素游戏",
    emoji: "🎮",
    files: [
      { name: "index.html", language: "html", content: "<!DOCTYPE html>\n<html>\n<head>\n  <title>Click Game</title>\n  <link rel=\"stylesheet\" href=\"style.css\">\n</head>\n<body>\n  <h1>Click the Target!</h1>\n  <p>Score: <span id=\"score\">0</span></p>\n  <button id=\"target\">🎯</button>\n  <script src=\"script.js\"></script>\n</body>\n</html>" },
      { name: "style.css", language: "css", content: "body { font-family: monospace; background: #0d0d1a; color: #4ecdc4; text-align: center; padding: 2rem; }\nh1 { color: #ff6b9d; }\n#target { font-size: 3rem; padding: 1rem 2rem; background: #252544; border: 2px solid #4ecdc4; border-radius: 12px; cursor: pointer; transition: transform 0.1s; }\n#target:hover { transform: scale(1.1); }\n#target:active { transform: scale(0.9); }" },
      { name: "script.js", language: "js", content: "let score = 0;\nconst target = document.getElementById('target');\nconst scoreEl = document.getElementById('score');\ntarget.addEventListener('click', () => {\n  score++;\n  scoreEl.textContent = score;\n  // Move target randomly\n  target.style.position = 'relative';\n  target.style.left = (Math.random() * 200 - 100) + 'px';\n  target.style.top = (Math.random() * 100 - 50) + 'px';\n});" },
    ],
  },
];

const LANG_ICON: Record<string, string> = { html: "📄", css: "🎨", js: "⚡" };
const MONACO_LANG: Record<string, string> = { html: "html", css: "css", js: "javascript" };

export default function BuildsEditorPage() {
  const { createBuild, updateBuild, publishBuild, builds } = useUserStore(
    useShallow((s) => ({ createBuild: s.createBuild, updateBuild: s.updateBuild, publishBuild: s.publishBuild, builds: s.builds })),
  );
  const [files, setFiles] = useState<BuildFile[]>(TEMPLATES[0].files);
  const [activeIdx, setActiveIdx] = useState(0);
  const [title, setTitle] = useState("我的精彩作品");
  const [currentBuildId, setCurrentBuildId] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const [showPublish, setShowPublish] = useState(false);
  const [publishDesc, setPublishDesc] = useState("");
  const [device, setDevice] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [view, setView] = useState<"editor" | "preview">("editor");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeFile = files[activeIdx];

  // 同步最新 files/title 到 ref，供防抖回调读取，避免闭包旧值
  const filesRef = useRef(files);
  const titleRef = useRef(title);
  useEffect(() => { filesRef.current = files; }, [files]);
  useEffect(() => { titleRef.current = title; }, [title]);

  // combine files into preview doc
  const previewDoc = useMemo(() => {
    const html = files.find((f) => f.language === "html")?.content ?? "";
    const css = files.find((f) => f.language === "css")?.content ?? "";
    const js = files.find((f) => f.language === "js")?.content ?? "";
    // Replace link/script tags with inline content
    let doc = html
      .replace(/<link[^>]*href=["']style\.css["'][^>]*>/gi, `<style>${css}</style>`)
      .replace(/<script[^>]*src=["']script\.js["'][^>]*><\/script>/gi, `<script>${js}<\/script>`);
    if (!/<style>/i.test(doc) && css) {
      doc = doc.replace(/<\/head>/i, `<style>${css}</style></head>`);
    }
    if (!/<script>/i.test(doc) && js) {
      doc = doc.replace(/<\/body>/i, `<script>${js}<\/script></body>`);
    }
    return doc;
  }, [files]);

  const updateFile = (idx: number, content: string) => {
    setFiles((prev) => prev.map((f, i) => (i === idx ? { ...f, content } : f)));
    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      if (currentBuildId) {
        updateBuild(currentBuildId, { files: filesRef.current, title: titleRef.current });
      }
      setSaveStatus("saved");
    }, 1500);
  };

  const addFile = () => {
    const name = prompt("文件名（例如 about.html、theme.css、app.js）：");
    if (!name) return;
    const lang = name.endsWith(".css") ? "css" : name.endsWith(".js") ? "js" : "html";
    setFiles((prev) => [...prev, { name, language: lang as BuildFile["language"], content: "" }]);
    setActiveIdx(files.length);
  };

  const deleteFile = (idx: number) => {
    if (files.length <= 1) return;
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setActiveIdx(0);
  };

  const startTemplate = (t: (typeof TEMPLATES)[number]) => {
    setFiles(t.files.map((f) => ({ ...f })));
    setTitle(t.name);
    setActiveIdx(0);
    setShowTemplates(false);
    setSaveStatus("idle");
    // 创建新 build
    const id = createBuild(t.name, t.files.map((f) => ({ ...f })));
    setCurrentBuildId(id);
  };

  const handlePublish = () => {
    if (!currentBuildId) {
      const id = createBuild(title, files);
      setCurrentBuildId(id);
      publishBuild(id, publishDesc);
    } else {
      updateBuild(currentBuildId, { title, files });
      publishBuild(currentBuildId, publishDesc);
    }
    setShowPublish(false);
    setPublishDesc("");
    setSaveStatus("saved");
    alert("🎉 作品已发布！现在在社区中可见。");
  };

  const deviceWidth = device === "mobile" ? "375px" : device === "tablet" ? "768px" : "100%";

  if (showTemplates) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-12">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🏗️</div>
          <h1 className="font-outfit text-3xl font-bold">开始新作品</h1>
          <p className="text-muted mt-2">选择一个模板或从零开始。</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              onClick={() => startTemplate(t)}
              className="rounded-xl border border-rule bg-bg2 p-6 text-center hover:border-accent hover:shadow-card transition group"
            >
              <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">{t.emoji}</div>
              <div className="font-bold text-ink">{t.name}</div>
              <div className="text-xs text-muted mt-1">{t.files.length} 个文件</div>
            </button>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link href="/builds" className="text-sm text-muted hover:text-ink">← 浏览社区作品</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      {/* Toolbar */}
      <div className="border-b border-rule bg-bg2 px-3 py-2 flex items-center gap-2 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="bg-transparent font-bold text-ink text-sm px-2 py-1 rounded border border-transparent hover:border-rule focus:border-accent focus:outline-none transition flex-1 min-w-[150px]"
        />
        <div className="text-[11px] text-muted flex items-center gap-1">
          {saveStatus === "saving" && "保存中..."}
          {saveStatus === "saved" && <span className="text-success">✓ 已保存</span>}
          {saveStatus === "idle" && "未保存"}
        </div>
        <button
          onClick={() => setShowPublish(true)}
          className="px-3 py-1.5 rounded text-xs font-semibold bg-gradient-to-r from-accent to-accent2 text-white hover:shadow-glow transition"
        >
          🚀 发布
        </button>
        <Link
          href="/builds"
          className="px-3 py-1.5 rounded text-xs border border-rule text-muted hover:text-ink transition"
        >
          退出
        </Link>
      </div>

      {/* Mobile view switch */}
      <div className="md:hidden flex border-b border-rule bg-bg2">
        <button
          onClick={() => setView("editor")}
          className={cn("flex-1 py-2 text-xs font-medium border-b-2", view === "editor" ? "border-accent text-accent" : "border-transparent text-muted")}
        >
          💻 代码
        </button>
        <button
          onClick={() => setView("preview")}
          className={cn("flex-1 py-2 text-xs font-medium border-b-2", view === "preview" ? "border-accent text-accent" : "border-transparent text-muted")}
        >
          👁 预览
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* File tree + editor */}
        <div className={cn("flex flex-1 min-w-0", view === "editor" ? "flex" : "hidden md:flex")}>
          {/* File tree */}
          <div className="w-40 lg:w-48 shrink-0 border-r border-rule bg-bg2 p-2 overflow-auto">
            <button
              onClick={addFile}
              className="w-full mb-2 px-2 py-1.5 rounded text-xs border border-dashed border-rule text-muted hover:border-accent hover:text-accent transition"
            >
              + 新建文件
            </button>
            {files.map((f, i) => (
              <div
                key={f.name + i}
                className={cn(
                  "group flex items-center gap-1.5 px-2 py-1.5 rounded text-xs cursor-pointer transition",
                  i === activeIdx ? "bg-bg3 text-accent" : "text-muted hover:bg-bg3 hover:text-ink",
                )}
                onClick={() => setActiveIdx(i)}
              >
                <span>{LANG_ICON[f.language]}</span>
                <span className="flex-1 truncate">{f.name}</span>
                {files.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteFile(i);
                    }}
                    className="opacity-0 group-hover:opacity-100 text-accent2 hover:text-ink transition"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Monaco */}
          <div className="flex-1 min-w-0 bg-codebg">
            <Monaco
              height="100%"
              language={MONACO_LANG[activeFile.language]}
              value={activeFile.content}
              onChange={(v) => updateFile(activeIdx, v ?? "")}
              theme="vs-dark"
              options={{
                fontSize: 13,
                fontFamily: "var(--font-mono), monospace",
                minimap: { enabled: false },
                wordWrap: "on",
                tabSize: 2,
                automaticLayout: true,
              }}
            />
          </div>
        </div>

        {/* Preview */}
        <div className={cn("flex-1 flex flex-col border-l border-rule", view === "preview" ? "flex" : "hidden md:flex")}>
          <div className="px-3 py-2 bg-bg2 border-b border-rule flex items-center gap-2">
            <span className="text-[11px] text-muted uppercase tracking-wide">实时预览</span>
            <div className="ml-auto flex items-center gap-1">
              {(["desktop", "tablet", "mobile"] as const).map((d) => (
                <button
                  key={d}
                  onClick={() => setDevice(d)}
                  className={cn(
                    "px-2 py-1 rounded text-[10px] transition",
                    device === d ? "bg-accent text-white" : "text-muted hover:text-ink",
                  )}
                >
                  {d === "desktop" ? "🖥" : d === "tablet" ? "📱" : "📲"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex-1 bg-white overflow-auto flex justify-center p-2">
            <iframe
              srcDoc={previewDoc}
              title="preview"
              sandbox="allow-scripts"
              style={{ width: deviceWidth, height: "100%", border: "none" }}
            />
          </div>
        </div>
      </div>

      {/* Publish modal */}
      {showPublish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
          <div className="bg-bg2 border border-rule rounded-xl p-6 max-w-md w-full">
            <h3 className="font-outfit text-lg font-bold mb-3">发布作品</h3>
            <p className="text-sm text-muted mb-4">
              发布后你的作品将显示在社区展示中。你可以随时编辑。
            </p>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">
              描述
            </label>
            <textarea
              value={publishDesc}
              onChange={(e) => setPublishDesc(e.target.value)}
              rows={3}
              placeholder="你的作品是做什么的？"
              className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition mb-4"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setShowPublish(false)}
                className="px-4 py-2 rounded-lg text-sm text-muted hover:text-ink transition"
              >
                取消
              </button>
              <button
                onClick={handlePublish}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white text-sm font-semibold hover:shadow-glow transition"
              >
                发布 🚀
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
