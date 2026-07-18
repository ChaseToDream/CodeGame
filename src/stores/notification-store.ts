"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Notification {
  id: string;
  type: "badge" | "reply" | "streak" | "news" | "system";
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  /** 可选：点击通知的跳转链接 */
  link?: string;
}

interface NotificationStoreState {
  notifications: Notification[];
  /** 未读通知数量 */
  unreadCount: () => number;
  /** 添加通知 */
  addNotification: (notif: Omit<Notification, "id" | "read" | "createdAt">) => void;
  /** 标记单条为已读 */
  markRead: (id: string) => void;
  /** 全部标记已读 */
  markAllRead: () => void;
  /** 删除单条通知 */
  removeNotification: (id: string) => void;
  /** 清空所有通知 */
  clearAll: () => void;
}

let notifIdCounter = 0;
function genNotifId(): string {
  return `n_${Date.now()}_${++notifIdCounter}`;
}

export const useNotificationStore = create<NotificationStoreState>()(
  persist(
    (set, get) => ({
      notifications: [],

      unreadCount: () => get().notifications.filter((n) => !n.read).length,

      addNotification: (notif) => {
        const newNotif: Notification = {
          ...notif,
          id: genNotifId(),
          read: false,
          createdAt: new Date().toISOString(),
        };
        set({ notifications: [newNotif, ...get().notifications].slice(0, 50) });
      },

      markRead: (id) => {
        set({
          notifications: get().notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n,
          ),
        });
      },

      markAllRead: () => {
        set({
          notifications: get().notifications.map((n) => ({ ...n, read: true })),
        });
      },

      removeNotification: (id) => {
        set({
          notifications: get().notifications.filter((n) => n.id !== id),
        });
      },

      clearAll: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "codegame-notifications",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ notifications: s.notifications }),
    },
  ),
);