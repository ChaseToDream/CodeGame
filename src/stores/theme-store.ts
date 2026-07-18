"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type Theme = "dark" | "light";

interface ThemeState {
  theme: Theme;
  toggle: () => void;
  setTheme: (t: Theme) => void;
}

/**
 * 主题状态管理。
 *
 * 暗色模式（默认）与亮色模式切换。
 * 通过 CSS 变量实现，切换时在 <html> 上设置 data-theme 属性。
 * 使用 localStorage 持久化用户偏好。
 */

const LIGHT_VARS: Record<string, string> = {
  "--bg": "#f8f9fc",
  "--bg2": "#ffffff",
  "--bg3": "#f0f1f5",
  "--ink": "#1a1a2e",
  "--muted": "#6b7280",
  "--rule": "#e5e7eb",
  "--accent": "#7c5cfc",
  "--accent2": "#e8517a",
  "--accent3": "#3aaf9f",
  "--codebg": "#f0f1f5",
};

const DARK_VARS: Record<string, string> = {
  "--bg": "#1a1a2e",
  "--bg2": "#252544",
  "--bg3": "#2d2d52",
  "--ink": "#e8e8f0",
  "--muted": "#a0a0b8",
  "--rule": "#3a3a5c",
  "--accent": "#7c5cfc",
  "--accent2": "#ff6b9d",
  "--accent3": "#4ecdc4",
  "--codebg": "#16162a",
};

function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const vars = theme === "light" ? LIGHT_VARS : DARK_VARS;
  root.setAttribute("data-theme", theme);
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      theme: "dark",

      toggle: () => {
        const next = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        applyTheme(next);
      },

      setTheme: (t) => {
        set({ theme: t });
        applyTheme(t);
      },
    }),
    {
      name: "codegame-theme",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => {
        // 在 hydration 完成后应用主题
        return (state) => {
          if (state) {
            applyTheme(state.theme);
          } else {
            // 默认暗色模式
            applyTheme("dark");
          }
        };
      },
    },
  ),
);