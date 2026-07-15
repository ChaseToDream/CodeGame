"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useUserStore } from "@/stores/user-store";
import { builds as seedBuilds } from "@/data/builds";
import { formatNumber, timeAgo } from "@/lib/utils";

export default function BuildsGalleryPage() {
  const { builds } = useUserStore();
  const [sort, setSort] = useState<"top" | "newest">("top");
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const allBuilds = useMemo(() => {
    let list = [...builds, ...seedBuilds.filter((b) => !builds.find((x) => x.id === b.id))];
    list = list.filter((b) => b.isPublished || showOnlyMine);
    if (showOnlyMine) {
      // 当前用户的所有 build（含未发布）
      // simplified: just show all from store
    }
    if (sort === "top") list.sort((a, b) => b.likeCount - a.likeCount);
    else list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
    return list;
  }, [builds, sort, showOnlyMine]);

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="text-5xl mb-3">🏗️</div>
        <h1 className="font-outfit text-4xl font-bold">
          Community <span className="gradient-text">Builds</span>
        </h1>
        <p className="text-muted mt-2 max-w-2xl mx-auto">
          Projects built by learners like you. Fork them, remix them, or get inspired to build your own.
        </p>
        <Link
          href="/builds/new"
          className="inline-block mt-5 px-6 py-3 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold hover:shadow-glow transition"
        >
          + Create a new Build
        </Link>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="flex gap-2">
          {(["top", "newest"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${
                sort === s ? "border-accent bg-accent text-white" : "border-rule bg-bg2 text-muted hover:text-ink"
              }`}
            >
              {s === "top" ? "🔥 Top" : "🆕 Newest"}
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-xs text-muted cursor-pointer">
          <input
            type="checkbox"
            checked={showOnlyMine}
            onChange={(e) => setShowOnlyMine(e.target.checked)}
            className="accent-accent"
          />
          Show all (incl. drafts)
        </label>
      </div>

      {/* Grid */}
      {allBuilds.length === 0 ? (
        <div className="text-center py-20 text-muted">
          <div className="text-5xl mb-3">📭</div>
          No builds yet. Be the first!
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {allBuilds.map((b) => (
            <Link
              key={b.id}
              href={`/builds/${b.id}`}
              className="group rounded-xl overflow-hidden border border-rule bg-bg2 hover:border-accent hover:-translate-y-1 transition-all"
            >
              <div
                className="h-36 flex items-center justify-center text-5xl relative"
                style={{ background: b.thumbnailGradient }}
              >
                <span className="group-hover:scale-110 transition-transform">
                  {b.title.includes("Snake") ? "🐍" : b.title.includes("Timer") ? "⏰" : b.title.includes("Pixel Art") ? "🎨" : "🌱"}
                </span>
                {b.forkedFrom && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-bg/70 text-[10px] text-ink font-bold">
                    🍴 Forked
                  </span>
                )}
              </div>
              <div className="p-4">
                <div className="font-bold text-ink group-hover:text-accent transition line-clamp-1">{b.title}</div>
                <p className="text-xs text-muted line-clamp-2 mt-1 h-8">{b.description || "No description"}</p>
                <div className="mt-3 flex items-center gap-2">
                  <div className="h-6 w-6 rounded-full shrink-0" style={{ background: b.authorAvatar }} />
                  <span className="text-[11px] text-muted truncate">@{b.authorName}</span>
                  <span className="text-[11px] text-muted ml-auto">{timeAgo(b.createdAt)}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-rule flex justify-between text-[11px] text-muted">
                  <span>❤️ {b.likeCount}</span>
                  <span>👁 {formatNumber(b.viewCount)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
