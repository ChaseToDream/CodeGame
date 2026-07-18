"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/stores/user-store";
import { useShallow } from "zustand/react/shallow";
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
  const { createPost, builds, user } = useUserStore(
    useShallow((s) => ({ createPost: s.createPost, builds: s.builds, user: s.user })),
  );
  const [category, setCategory] = useState<PostCategory>("general");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [attachedBuildId, setAttachedBuildId] = useState<string>("");
  const [err, setErr] = useState("");

  // 用 ref 持有最新的 onClose，避免父组件传入内联函数导致 Escape 监听器
  // 在每次父组件重渲染时被反复移除/添加
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  // Escape 键关闭模态框，符合标准对话框交互
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 仅显示当前用户自己的已发布作品（合并去重，避免种子数据被重复展示）
  // useMemo 避免每次按键都重算去重结果
  const myBuilds = useMemo(() => {
    const seen = new Set<string>();
    return [...builds, ...seedBuilds]
      .filter((b) => {
        if (seen.has(b.id)) return false;
        seen.add(b.id);
        return b.isPublished && b.userId === user.id;
      });
  }, [builds, user.id]);

  const submit = () => {
    setErr("");
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle || !trimmedContent) {
      setErr("标题和内容为必填项。");
      return;
    }
    if (trimmedTitle.length < 2) {
      setErr("标题至少需要 2 个字符。");
      return;
    }
    if (trimmedTitle.length > 200) {
      setErr("标题不能超过 200 个字符。");
      return;
    }
    if (trimmedContent.length > 10000) {
      setErr("内容不能超过 10000 个字符。");
      return;
    }
    const id = createPost({
      category,
      title: trimmedTitle,
      content: trimmedContent,
      attachedBuildId: attachedBuildId || undefined,
      isStaffPick: false,
    });
    // 先触发路由跳转，再延迟关闭模态框，避免模态框卸载导致跳转中断或闪烁
    router.push(`/community/${category}/${id}`);
    setTimeout(onClose, 0);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60"
      onClick={(e) => {
        // 仅当点击的是背景本身（而非内部内容）时才关闭，避免误触
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-post-modal-title"
        className="bg-bg2 border border-rule rounded-xl p-6 max-w-lg w-full max-h-[90vh] overflow-auto"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 id="new-post-modal-title" className="font-outfit text-lg font-bold">发新帖</h3>
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
