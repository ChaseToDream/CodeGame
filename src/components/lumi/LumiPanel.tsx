"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Exercise } from "@/types";
import { generateLumiReply, streamLumiReply, type LumiMessage } from "@/lib/lumi";
import { cn } from "@/lib/utils";

interface LumiPanelProps {
  open: boolean;
  onClose: () => void;
  exercise: Exercise;
  userCode: string;
}

export function LumiPanel({ open, onClose, exercise, userCode }: LumiPanelProps) {
  const [messages, setMessages] = useState<LumiMessage[]>([
    {
      role: "assistant",
      content: `你好！我是 **Lumi** 🤖，你的编程伙伴。在这个练习上卡住了吗？向我要个提示吧——我不会直接告诉你答案，但会引导你找到它！💪`,
    },
  ]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  // 用于在 onToken 闭包中判断是否已开始追加 assistant 消息
  const streamStartedRef = useRef(false);

  // 切换练习时重置对话历史，避免上一个练习的上下文残留造成误导
  useEffect(() => {
    setMessages([
      {
        role: "assistant",
        content: `你好！我是 **Lumi** 🤖，你的编程伙伴。在这个练习上卡住了吗？向我要个提示吧——我不会直接告诉你答案，但会引导你找到它！💪`,
      },
    ]);
    setStreaming(false);
    streamStartedRef.current = false;
    setInput("");
  }, [exercise.id]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || streaming) return;
    const userMsg = input.trim();
    setInput("");
    setMessages((m) => [...m, { role: "user", content: userMsg }]);
    setStreaming(true);
    streamStartedRef.current = false;
    const reply = generateLumiReply(exercise, userCode, userMsg);
    // 流式推送：第一个 token 到达时才添加 assistant 气泡，避免空气泡与 typing 指示器并存
    // 使用 try/finally 确保异常情况下 streaming 也能复位，避免 UI 卡在"发送中"状态
    try {
      await streamLumiReply(
        reply,
        (token) => {
          if (!streamStartedRef.current) {
            streamStartedRef.current = true;
            setMessages((m) => [...m, { role: "assistant", content: token }]);
          } else {
            setMessages((m) => {
              const next = [...m];
              next[next.length - 1] = {
                ...next[next.length - 1],
                content: next[next.length - 1].content + token,
              };
              return next;
            });
          }
        },
        () => setStreaming(false),
      );
    } finally {
      setStreaming(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-16 right-0 bottom-0 w-full sm:w-[440px] bg-bg2 border-l border-rule z-40 flex flex-col shadow-card"
        >
          {/* Header */}
          <div className="px-4 py-3 bg-bg3 border-b border-rule flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-accent to-accent2 flex items-center justify-center text-sm">
                🤖
              </div>
              <div>
                <div className="font-bold text-sm text-ink">Lumi</div>
                <div className="text-[10px] text-muted flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-success" /> 在线
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded text-muted hover:text-ink hover:bg-bg2 transition"
              aria-label="关闭 Lumi"
            >
              ✕
            </button>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={cn("flex", m.role === "user" ? "justify-end" : "justify-start")}
              >
                <div
                  className={cn(
                    "max-w-[85%] px-3 py-2 rounded-lg text-sm leading-relaxed",
                    m.role === "user"
                      ? "bg-accent text-white rounded-br-sm"
                      : "bg-bg3 text-ink rounded-bl-sm",
                  )}
                >
                  <MarkdownLite content={m.content} />
                </div>
              </div>
            ))}
            {streaming && messages[messages.length - 1]?.role !== "assistant" && (
              <div className="flex justify-start">
                <div className="bg-bg3 px-3 py-2 rounded-lg">
                  <span className="inline-block w-1.5 h-3.5 bg-accent animate-pulse" />
                </div>
              </div>
            )}
          </div>

          {/* Suggested prompts */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {["给我个提示", "解释这个概念", "帮我调试代码"].map((p) => (
                <button
                  key={p}
                  onClick={() => setInput(p)}
                  className="px-2.5 py-1 rounded-full text-[11px] border border-rule bg-bg3 text-muted hover:text-ink hover:border-accent transition"
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 border-t border-rule bg-bg3">
            <div className="flex gap-2 items-end">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send();
                  }
                }}
                rows={1}
                placeholder="向 Lumi 提问..."
                className="flex-1 resize-none px-3 py-2 rounded-lg bg-bg2 border border-rule text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none transition max-h-24"
              />
              <button
                onClick={send}
                disabled={!input.trim() || streaming}
                className="px-3 py-2 rounded-lg bg-accent text-white text-sm font-semibold hover:bg-accent/90 disabled:opacity-50 transition"
              >
                发送
              </button>
            </div>
            <p className="text-[10px] text-muted mt-1.5 text-center">
              Lumi 提供提示，而非答案。💡
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** 轻量 Markdown 渲染（粗体、代码、换行） */
function MarkdownLite({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return (
    <div className="whitespace-pre-wrap">
      {parts.map((p, i) => {
        if (p.startsWith("**") && p.endsWith("**")) {
          return <strong key={i} className="font-bold">{p.slice(2, -2)}</strong>;
        }
        if (p.startsWith("`") && p.endsWith("`")) {
          return (
            <code key={i} className="px-1 py-0.5 rounded bg-bg2 text-accent3 font-mono text-xs">
              {p.slice(1, -1)}
            </code>
          );
        }
        return <span key={i}>{p}</span>;
      })}
    </div>
  );
}
