"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";

export default function LoginPage() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    if (!email || !password) {
      setErr("Please fill in both fields.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      login(email);
      router.push("/dashboard");
    }, 400);
  };

  const oauth = (provider: string) => {
    setLoading(true);
    setTimeout(() => {
      login(`${provider.toLowerCase()}.user@example.com`);
      router.push("/dashboard");
    }, 400);
  };

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <div className="text-center mb-8">
        <div className="font-pixel text-3xl gradient-text mb-2">Codédex</div>
        <h1 className="font-outfit text-2xl font-bold">Welcome back, hero!</h1>
        <p className="text-muted text-sm mt-1">Log in to continue your adventure.</p>
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
          <span className="text-xs text-muted">or</span>
          <div className="flex-1 h-px bg-rule" />
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">
              Email
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
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-lg bg-bg3 border border-rule text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/30 transition"
            />
          </div>
          {err && <p className="text-sm text-accent2">{err}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Log in"}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-muted mt-5">
        New to Codédex?{" "}
        <Link href="/signup" className="text-accent hover:text-accent2 font-medium">
          Create an account →
        </Link>
      </p>
      <p className="text-center text-[11px] text-muted/70 mt-3">
        Demo: enter any email & password to log in.
      </p>
    </div>
  );
}
