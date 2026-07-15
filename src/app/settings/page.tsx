"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
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
  const router = useRouter();
  const { user, isAuthed, updateUser, logout } = useUserStore();

  // 本地草稿：在 Save 时才提交到 store
  const [username, setUsername] = useState(user?.username ?? "");
  const [bio, setBio] = useState(user?.bio ?? "");
  const [avatarGradient, setAvatarGradient] = useState(user?.avatarGradient ?? AVATAR_PRESETS[0].gradient);
  const [countryFlag, setCountryFlag] = useState(user?.countryFlag ?? "🏳️");
  const [activeTab, setActiveTab] = useState<"profile" | "account" | "notifications">("profile");
  const [savedToast, setSavedToast] = useState(false);

  useEffect(() => {
    if (!isAuthed || !user) {
      router.push("/login");
    }
  }, [isAuthed, user, router]);

  useEffect(() => {
    if (user) {
      setUsername(user.username);
      setBio(user.bio);
      setAvatarGradient(user.avatarGradient);
      setCountryFlag(user.countryFlag);
    }
  }, [user]);

  if (!user) {
    return <div className="mx-auto max-w-3xl px-4 py-20 text-center text-muted">加载中...</div>;
  }

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

  const onLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10">
      <header className="mb-8">
        <h1 className="font-outfit text-3xl font-bold">设置</h1>
        <p className="text-muted mt-1 text-sm">管理你的资料、账号和偏好设置。</p>
      </header>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-rule">
        {([
          { id: "profile", label: "资料" },
          { id: "account", label: "账号" },
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

      {activeTab === "account" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5 space-y-4">
            <h2 className="font-outfit text-lg font-bold">账号信息</h2>
            <Field label="Email">
              <input
                value={user.email}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-bg3/50 border border-rule text-muted cursor-not-allowed"
              />
              <p className="text-[11px] text-muted mt-1">此演示中邮箱不可更改。</p>
            </Field>
            <Field label="用户 ID">
              <input
                value={user.id}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-bg3/50 border border-rule text-muted cursor-not-allowed font-mono text-xs"
              />
            </Field>
            <Field label="注册时间">
              <input
                value={new Date(user.createdAt).toLocaleDateString()}
                disabled
                className="w-full px-3 py-2 rounded-lg bg-bg3/50 border border-rule text-muted cursor-not-allowed"
              />
            </Field>
            <Field label="角色">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-bg3 border border-rule">
                <span className="text-sm font-semibold text-accent3 uppercase tracking-wide">
                  {user.role}
                </span>
              </div>
            </Field>
          </section>

          <section className="rounded-xl border border-rule bg-bg2 p-5">
            <h2 className="font-outfit text-lg font-bold mb-2">危险操作区</h2>
            <p className="text-sm text-muted mb-4">在此设备上退出你的账号。</p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={onLogout}
                className="px-4 py-2 rounded-lg border border-accent2 text-accent2 text-sm font-semibold hover:bg-accent2/10 transition"
              >
                退出登录
              </button>
              <button
                onClick={() => {
                  if (confirm("重置所有本地进度、作品和帖子？此操作不可撤销。")) {
                    localStorage.removeItem("codedex-clone-store");
                    location.href = "/";
                  }
                }}
                className="px-4 py-2 rounded-lg border border-rule text-muted text-sm hover:border-accent2 hover:text-accent2 transition"
              >
                重置本地数据
              </button>
            </div>
          </section>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="space-y-6">
          <section className="rounded-xl border border-rule bg-bg2 p-5 space-y-4">
            <h2 className="font-outfit text-lg font-bold">偏好设置</h2>
            <Toggle label="获得新徽章时邮件通知" defaultOn />
            <Toggle label="有人回复我的帖子时邮件通知" defaultOn />
            <Toggle label="每周连续学习摘要" defaultOn={false} />
            <Toggle label="产品更新与新闻" defaultOn />
            <p className="text-[11px] text-muted pt-2 border-t border-rule">
              此演示中的通知仅为模拟，不会实际发送邮件。
            </p>
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

function Toggle({ label, defaultOn }: { label: string; defaultOn: boolean }) {
  const [on, setOn] = useState(defaultOn);
  return (
    <label className="flex items-center justify-between cursor-pointer">
      <span className="text-sm text-ink">{label}</span>
      <button
        type="button"
        onClick={() => setOn((v) => !v)}
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
