"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

export default function SignupPage() {
  const router = useRouter();
  const signup = useUserStore((s) => s.signup);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email || !username || !password) {
      setErr("请填写所有字段。");
      return;
    }
    if (password.length < 4) {
      setErr("密码至少需要 4 个字符。");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signup(email, username, password);
      router.push("/dashboard");
    }, 400);
  };

  const oauth = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      signup(`${provider.toLowerCase()}.user@example.com`, `${provider}Hero`, "oauth-placeholder");
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <div className="font-pixel text-3xl gradient-text mb-2">Codédex</div>
        <h1 className="font-outfit text-2xl font-bold">开启你的冒险之旅</h1>
        <p className="text-muted text-sm mt-1">创建免费账号，开始升级之旅。</p>
      </div>

      <div className="rounded-xl border border-rule bg-bg2 p-6 shadow-card">
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            onClick={() => oauth("GitHub")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rule bg-bg3 hover:border-accent transition text-sm font-medium"
          >
            <span>🐙</span> GitHub
          </button>
          <button
            onClick={() => oauth("Google")}
            className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rule bg-bg3 hover:border-accent transition text-sm font-medium"
          >
            <span>🔵</span> Google
          </button>
        </div>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-px bg-rule" />
          <span className="text-xs text-muted">或</span>
          <div className="flex-1 h-px bg-rule" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="pixel_warrior"
              className="w-full px-3 py-2.5 rounded-lg bg-bg3 border border-rule text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">
              邮箱
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-lg bg-bg3 border border-rule text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 4 个字符"
              className="w-full px-3 py-2.5 rounded-lg bg-bg3 border border-rule text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
            />
          </div>
          {err && <p className="text-sm text-accent2">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition disabled:opacity-60"
          >
            {loading ? "创建账号中..." : "创建免费账号"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-muted mt-5">
        已有账号？{" "}
        <Link href="/login" className="text-accent hover:text-accent2 font-medium">
          登录 →
        </Link>
      </p>
      <p className="text-center text-[11px] text-muted/70 mt-3">
        注册即表示你同意我们的服务条款和隐私政策。
      </p>
    </div>
  );
}
