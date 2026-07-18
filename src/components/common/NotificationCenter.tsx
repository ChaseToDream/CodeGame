"use client";

import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useNotificationStore } from "@/stores/notification-store";
import { useNotificationPreferencesStore } from "@/stores/notification-prefs-store";
import { cn, timeAgo } from "@/lib/utils";

const TYPE_ICON: Record<string, string> = {
  badge: "🏅",
  reply: "💬",
  streak: "🔥",
  news: "📢",
  system: "ℹ️",
};

export function NotificationCenter() {
  const { notifications, markRead, markAllRead, removeNotification, clearAll, unreadCount } =
    useNotificationStore();
  const isEnabled = useNotificationPreferencesStore((s) => s.isEnabled);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // 根据偏好过滤通知
  const filteredNotifications = useMemo(
    () => notifications.filter((n) => isEnabled(n.type)),
    [notifications, isEnabled],
  );

  // 过滤后的未读数
  const count = useMemo(
    () => filteredNotifications.filter((n) => !n.read).length,
    [filteredNotifications],
  );

  // 点击外部关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Esc 关闭
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open]);

  const handleToggle = useCallback(() => {
    setOpen((v) => !v);
  }, []);

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={handleToggle}
        className="relative p-2 rounded-lg hover:bg-bg3 transition"
        aria-label={`通知中心${count > 0 ? `，${count} 条未读` : ""}`}
        aria-expanded={open}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-muted"
        >
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 min-w-[1.25rem] px-1 rounded-full bg-accent2 text-white text-[10px] font-bold flex items-center justify-center">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            ref={panelRef}
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-bg2 border border-rule rounded-xl shadow-card z-50 overflow-hidden"
          >
            {/* 头部 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-rule">
              <h3 className="font-outfit text-sm font-bold text-ink">通知中心</h3>
              <div className="flex items-center gap-2">
                {notifications.length > 0 && (
                  <>
                    <button
                      onClick={markAllRead}
                      className="text-[11px] text-accent hover:text-accent2 transition"
                    >
                      全部已读
                    </button>
                    <button
                      onClick={clearAll}
                      className="text-[11px] text-muted hover:text-accent2 transition"
                    >
                      清空
                    </button>
                  </>
                )}
                {/* 当前过滤类型提示 */}
                {notifications.length > 0 && filteredNotifications.length < notifications.length && (
                  <span className="text-[10px] text-muted/60 ml-1">
                    已过滤 {notifications.length - filteredNotifications.length} 条
                  </span>
                )}
              </div>
            </div>

            {/* 列表 */}
            <div className="max-h-[60vh] overflow-y-auto">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="text-3xl mb-2">🔔</div>
                  <p className="text-sm text-muted">暂无通知</p>
                  <p className="text-[11px] text-muted/60 mt-1">
                    完成练习、获得徽章时会收到通知
                  </p>
                </div>
              ) : (
                <ul className="divide-y divide-rule">
                  {filteredNotifications.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "px-4 py-3 hover:bg-bg3/50 transition cursor-pointer",
                        !n.read && "bg-accent/5",
                      )}
                      onClick={() => {
                        markRead(n.id);
                        if (n.link) {
                          setOpen(false);
                        }
                      }}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-lg shrink-0 mt-0.5">
                          {TYPE_ICON[n.type] ?? "ℹ️"}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-ink truncate">
                              {n.title}
                            </span>
                            {!n.read && (
                              <span className="h-2 w-2 rounded-full bg-accent shrink-0" />
                            )}
                          </div>
                          <p className="text-xs text-muted mt-0.5 line-clamp-2">
                            {n.message}
                          </p>
                          <div className="flex items-center justify-between mt-1.5">
                            <span className="text-[10px] text-muted/60">
                              {timeAgo(n.createdAt)}
                            </span>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                removeNotification(n.id);
                              }}
                              className="text-[10px] text-muted hover:text-accent2 transition"
                              aria-label="删除通知"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                      {n.link && (
                        <Link
                          href={n.link}
                          className="block mt-1 text-[11px] text-accent hover:text-accent2"
                          onClick={() => setOpen(false)}
                        >
                          查看详情 →
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}