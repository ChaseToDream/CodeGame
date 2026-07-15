"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { builds as seedBuilds } from "@/data/builds";
import type { PostCategory } from "@/types";
import { cn } from "@/lib/utils";

const CATEGORIES: { key: PostCategory; label: string }[] = [
  { key: "general", label: "综合" },
  { key: "career", label: "职业" },
  { key: "project_showcase", label: "作品展示" },
  { key: "introductions", label: "自我介绍" },
];

interface NewPostModalProps {
  onClose: () => void;
}

export function NewPostModal({ onClose }: NewPostModalProps) {
  const router = useRouter();
  const { createPost, builds } = useUserStore();
  const [category, setCategory] = useState<PostCategory>("general");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachedBuildId, setAttachedBuildId] = useState<string>("");
  const [err, setErr] = useState("");

  const myBuilds = [...builds, ...seedBuilds].filter((b) => b.isPublished);

  const submit = () => {
    setErr("");
    if (!title.trim() || !content.trim()) {
      setErr("标题和内容为必填项。");
      return;
    }
    const id = createPost({
      category,
      title: title.trim(),
      content: content.trim(),
      attachedBuildId: attachedBuildId || undefined,
      isStaffPick: false,
    });
    onClose();
    router.push(`/community/${category}/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60">
      <div className="bg-bg2 border border-rule rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-outfit text-lg font-bold">发新帖</h3>
          <button onClick={onClose} className="text-muted hover:text-ink transition">✕</button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">分类</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.key}
                  onClick={() => setCategory(c.key)}
                  className={cn(
                    "px-3 py-1.5 rounded-full text-xs font-medium border transition",
                    category === c.key
                      ? "border-accent bg-accent text-white"
                      : "border-rule text-muted hover:text-ink",
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">标题</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="给你的帖子起个吸引人的标题..."
              className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">内容</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
              placeholder="分享你的想法、问题或成就..."
              className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition resize-y"
            />
            <p className="text-[10px] text-muted mt-1">支持 Markdown：**粗体**、`代码` 等</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-muted uppercase tracking-wide mb-1.5">
              附加作品（可选）
            </label>
            <select
              value={attachedBuildId}
              onChange={(e) => setAttachedBuildId(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-bg3 border border-rule text-ink focus:border-accent focus:outline-none transition"
            >
              <option value="">— 无 —</option>
              {myBuilds.map((b) => (
                <option key={b.id} value={b.id}>{b.title}</option>
              ))}
            </select>
          </div>

          {err && <p className="text-sm text-accent2">{err}</p>}

          <div className="flex gap-2 justify-end pt-2">
            <button onClick={onClose} className="px-4 py-2 rounded-lg text-sm text-muted hover:text-ink transition">
              取消
            </button>
            <button
              onClick={submit}
              className="px-5 py-2 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white text-sm font-semibold hover:shadow-glow transition"
            >
              发布
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
