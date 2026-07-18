"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useUserStore, type ExportedData } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
import { cn } from "@/lib/utils";

const AVATAR_PRESETS: { name: string; gradient: string }[] = [
  { name: "Nebula", gradient: "linear-gradient(135deg, #7C5CFC, #FF6B9D)" },
  { name: "Aurora", gradient: "linear-gradient(135deg, #4ECDC4, #7C5CFC)" },
  { name: "Sunset", gradient: "linear-gradient(135deg, #FF6B9D, #F0A04B)" },
  { name: "Forest", gradient: "linear-gradient(135deg, #6bcf7f, #4ECDC4)" },
  { name: "Galaxy", gradient: "linear-gradient(135deg, #264DE4, #7C5CFC)" },
  { name: "Coral", gradient: "linear-gradient(135deg, #FF6B9D, #FFB199)" },
  { name: "Mint", gradient: "linear-gradient(135deg, #4ECDC4, #6bcf7f)" },
  { name: "Ember", gradient: "linear-gradient(135deg, #F0A04B, #FF6B9D)" },
];

const FLAGS = ["🏳️", "🇺🇸", "🇨🇳", "🇮🇳", "🇧🇷", "🇬🇧", "🇩🇪", "🇫🇷", "🇯🇵", "🇰🇷", "🇨🇦", "🇦🇺", "🇲🇽", "🇪🇸", "🇮🇹", "🇷🇺"];

export default function SettingsPage() {
  const {
    user,
    updateUser,
    resetLocalData,
    importData,
    progress,
    earnedBadgeIds,
    builds,
    posts,
    activityLog,
    bookmarks,
    courseRatings,
  } = useUserStore(
    useShallow((s) => ({
      user: s.user,
      updateUser: s.updateUser,
      resetLocalData: s.resetLocalData,
      importData: s.importData,
      progress: s.progress,
      earnedBadgeIds: s.earnedBadgeIds,
      builds: s.builds,
      posts: s.posts,
      activityLog: s.activityLog,
      bookmarks: s.bookmarks,
      courseRatings: s.courseRatings,
    })),
  );

  // 本地草稿：在 Save 时才提交到 store
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatarGradient, setAvatarGradient] = useState(user.avatarGradient);
  const [countryFlag, setCountryFlag] = useState(user.countryFlag);
  const [activeTab, setActiveTab] = useState<"profile" | "notifications">("profile");
  const [savedToast, setSavedToast] = useState(false);
  // 数据导入结果反馈：null 表示无反馈，"ok" / "fail" 表示上次操作结果
  const [importToast, setImportToast] = useState<null | "ok" | "fail">(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUsername(user.username);
    setBio(user.bio);
    setAvatarGradient(user.avatarGradient);
    setCountryFlag(user.countryFlag);
  }, [user]);

  const onSave = () => {
    updateUser({
      username: username.trim() || user.username,
      bio: bio.trim(),
      avatarGradient,
      countryFlag,
    });
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2200);
  };

  /**
   * 导出本地数据：序列化核心状态为 ExportedData JSON 文件并触发浏览器下载。
   * 文件名固定包含日期，方便用户区分多个备份。
   */
  const onExportData = () => {
    const payload: ExportedData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      user,
      progress,
      earnedBadgeIds,
      builds,
      posts,
      activityLog,
      bookmarks,
      courseRatings,
    };
    try {
      const blob = new Blob([JSON.stringify(payload, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const dateStr = new Date().toISOString().slice(0, 10);
      a.download = `codegame-backup-${dateStr}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setImportToast("ok");
      setTimeout(() => setImportToast(null), 2200);
    } catch {
      setImportToast("fail");
      setTimeout(() => setImportToast(null), 2600);
    }
  };

  /**
   * 触发隐藏的 file input，让用户选择 JSON 备份文件。
   * 不直接使用 Modal/prompt 以保持轻量与原生体验。
   */
  const onImportClick = () => {
    fileInputRef.current?.click();
  };

  /**
   * 读取用户选择的 JSON 文件并调用 store.importData。
   * 文件读取/解析/导入任一环节失败都给统一错误反馈，避免不必要的技术细节暴露。
   */
  const onImportFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    // 重置 input 的 value 以便同一文件可重复选择
    e.target.value = "";
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result)) as ExportedData;
        const ok = importData(parsed);
        setImportToast(ok ? "ok" : "fail");
        setTimeout(() => setImportToast(null), 2600);
      } catch {
        setImportToast("fail");
        setTimeout(() => setImportToast(null), 2600);
      }
    };
    reader.onerror = () => {
      setImportToast("fail");
      setTimeout(() => setImportToast(null), 2600);
    };
    reader.readAsText(file);
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="font-outfit text-3xl font-bold">设置</h1>
        <p className="text-muted mt-1 text-sm">管理你的资料和偏好设置。</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-rule">
        {([
          { id: "profile", label: "资料" },
          { id: "notifications", label: "通知" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={cn(
              "px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
              activeTab === t.id
                ? "border-accent text-accent"
                : "border-transparent text-muted hover:text-ink",
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === "profile" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-4">头像</h2>
            <div className="flex items-center gap-5">
              <div
                className="h-20 w-20 rounded-full ring-4 ring-accent/30 shrink-0"
                style={{ background: avatarGradient }}
              />
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 flex-1">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setAvatarGradient(preset.gradient)}
                    title={preset.name}
                    className={cn(
                      "h-10 w-10 rounded-full border-2 transition",
                      avatarGradient === preset.gradient
                        ? "border-ink scale-110"
                        : "border-transparent hover:scale-105",
                    )}
                    style={{ background: preset.gradient }}
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-rule bg-bg2 p-5 space-y-4">
            <Field label="用户名">
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                maxLength={20}
                className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-ink focus:border-accent focus:outline-none transition"
              />
              <p className="text-[11px] text-muted mt-1">
                你的公开用户名。显示在 <code className="text-accent3">/u/{username || "username"}</code>
              </p>
            </Field>

            <Field label="简介">
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={140}
                rows={3}
                className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-ink focus:border-accent focus:outline-none transition resize-none"
              />
              <p className="text-[11px] text-muted mt-1 text-right">{bio.length}/140</p>
            </Field>

            <Field label="国家旗帜">
              <div className="flex flex-wrap gap-2">
                {FLAGS.map((f) => (
                  <button
                    key={f}
                    onClick={() => setCountryFlag(f)}
                    className={cn(
                      "h-10 w-10 rounded-lg border flex items-center justify-center text-xl transition",
                      countryFlag === f
                        ? "border-accent bg-bg3 scale-110"
                        : "border-rule bg-bg2 hover:border-accent/50",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </Field>
          </section>

          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-2">数据管理</h2>
            <p className="text-sm text-muted mb-4">
              备份你的进度、作品与社区数据到本地文件，或从备份恢复。所有数据都存储在浏览器本地。
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={onExportData}
                className="px-4 py-2 rounded-lg bg-accent/15 border border-accent/40 text-accent text-sm font-semibold hover:bg-accent/25 transition"
              >
                ⬇ 导出数据
              </button>
              <button
                onClick={onImportClick}
                className="px-4 py-2 rounded-lg bg-accent3/15 border border-accent3/40 text-accent3 text-sm font-semibold hover:bg-accent3/25 transition"
              >
                ⬆ 导入数据
              </button>
              <button
                onClick={() => {
                  if (confirm("重置所有本地进度、作品和帖子？此操作不可撤销。")) {
                    resetLocalData();
                  }
                }}
                className="px-4 py-2 rounded-lg border border-rule text-muted text-sm hover:border-accent2 hover:text-accent2 transition"
              >
                重置本地数据
              </button>
              {/* 隐藏的文件输入：由导入按钮触发 click，避免使用受控 input 影响布局 */}
              <input
                ref={fileInputRef}
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={onImportFileChange}
              />
            </div>
            {importToast === "ok" && (
              <p className="mt-3 text-xs text-success">✓ 操作成功</p>
            )}
            {importToast === "fail" && (
              <p className="mt-3 text-xs text-accent2">
                ✗ 操作失败，请检查文件是否为有效的 CodeGame 备份
              </p>
            )}
          </section>

          <div className="flex items-center justify-end gap-3">
            <Link href="/dashboard" className="px-4 py-2 text-sm text-muted hover:text-ink">
              取消
            </Link>
            <button
              onClick={onSave}
              className="px-5 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 hover:shadow-glow transition"
            >
              保存修改
            </button>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5 space-y-4">
            <h2 className="font-outfit text-lg font-bold">偏好设置</h2>
            <Toggle label="获得新徽章时通知" defaultOn storageKey="notif-badge" />
            <Toggle label="有人回复我的帖子时通知" defaultOn storageKey="notif-reply" />
            <Toggle label="每周连续学习摘要" defaultOn={false} storageKey="notif-streak" />
            <Toggle label="产品更新与新闻" defaultOn storageKey="notif-news" />
          </section>
        </div>
      )}

      {/* Saved toast */}
      {savedToast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-success text-bg text-sm font-semibold shadow-card animate-slideUp">
          ✓ 资料已保存
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-2">{label}</label>
      {children}
    </div>
  );
}

function Toggle({ label, defaultOn, storageKey }: { label: string; defaultOn: boolean; storageKey?: string }) {
  // 初始值使用 defaultOn，保证 SSR 与客户端首次渲染一致，避免 hydration mismatch。
  // 客户端挂载后再从 localStorage 读取真实偏好并同步状态。
  const [on, setOn] = useState(defaultOn);

  useEffect(() => {
    if (storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) setOn(saved === "true");
    }
    // 仅在挂载时同步一次，defaultOn / storageKey 在组件生命周期内不变
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggle = () => {
    const next = !on;
    setOn(next);
    if (storageKey) {
      localStorage.setItem(storageKey, String(next));
    }
  };
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        onClick={toggle}
        className={cn(
          "relative h-6 w-11 rounded-full transition-colors",
          on ? "bg-accent" : "bg-bg3 border border-rule",
        )}
        aria-pressed={on}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
            on ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
    </label>
  );
}
