"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type NotificationType = "badge" | "reply" | "streak" | "news" | "system";

export interface NotificationPreferences {
  /** 获得新徽章时通知 */
  badge: boolean;
  /** 有人回复我的帖子时通知 */
  reply: boolean;
  /** 连续学习摘要 */
  streak: boolean;
  /** 产品更新与新闻 */
  news: boolean;
  /** 系统通知（始终开启，不可关闭） */
  system: boolean;
}

interface NotificationPreferencesState {
  preferences: NotificationPreferences;
  /** 设置单个偏好 */
  setPreference: (key: keyof NotificationPreferences, value: boolean) => void;
  /** 设置所有偏好 */
  setPreferences: (prefs: Partial<NotificationPreferences>) => void;
  /** 检查某个通知类型是否被允许 */
  isEnabled: (type: NotificationType) => boolean;
  /** 重置为默认值 */
  reset: () => void;
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  badge: true,
  reply: true,
  streak: false,
  news: true,
  system: true,
};

export const useNotificationPreferencesStore = create<NotificationPreferencesState>()(
  persist(
    (set, get) => ({
      preferences: { ...DEFAULT_PREFERENCES },

      setPreference: (key, value) => {
        set((state) => ({
          preferences: { ...state.preferences, [key]: value },
        }));
      },

      setPreferences: (prefs) => {
        set((state) => ({
          preferences: { ...state.preferences, ...prefs },
        }));
      },

      isEnabled: (type) => {
        const prefs = get().preferences;
        // system 类型通知始终允许
        if (type === "system") return true;
        return prefs[type] ?? true;
      },

      reset: () => {
        set({ preferences: { ...DEFAULT_PREFERENCES } });
      },
    }),
    {
      name: "codegame-notif-prefs",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({ preferences: s.preferences }),
    },
  ),
);