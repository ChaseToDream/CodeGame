import { describe, it, expect, beforeEach } from "vitest";
import { useNotificationPreferencesStore } from "./notification-prefs-store";

/**
 * notification-prefs-store 单元测试
 */
beforeEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
  useNotificationPreferencesStore.getState().reset();
});

describe("notification-prefs-store", () => {
  it("默认值正确", () => {
    const prefs = useNotificationPreferencesStore.getState().preferences;
    expect(prefs.badge).toBe(true);
    expect(prefs.reply).toBe(true);
    expect(prefs.streak).toBe(false);
    expect(prefs.news).toBe(true);
    expect(prefs.system).toBe(true);
  });

  it("setPreference 可以修改单个偏好", () => {
    const store = useNotificationPreferencesStore.getState();
    store.setPreference("badge", false);
    expect(useNotificationPreferencesStore.getState().preferences.badge).toBe(false);
    expect(useNotificationPreferencesStore.getState().preferences.reply).toBe(true);
  });

  it("setPreferences 可以批量修改偏好", () => {
    const store = useNotificationPreferencesStore.getState();
    store.setPreferences({ badge: false, reply: false, streak: true });
    const prefs = useNotificationPreferencesStore.getState().preferences;
    expect(prefs.badge).toBe(false);
    expect(prefs.reply).toBe(false);
    expect(prefs.streak).toBe(true);
  });

  it("isEnabled 正确过滤通知类型", () => {
    const store = useNotificationPreferencesStore.getState();
    store.setPreference("badge", false);
    store.setPreference("news", true);

    expect(useNotificationPreferencesStore.getState().isEnabled("badge")).toBe(false);
    expect(useNotificationPreferencesStore.getState().isEnabled("news")).toBe(true);
    // system 类型始终允许
    expect(useNotificationPreferencesStore.getState().isEnabled("system")).toBe(true);
  });

  it("修改后仍然保持未修改的偏好", () => {
    const store = useNotificationPreferencesStore.getState();
    store.setPreference("badge", false);
    const prefs = useNotificationPreferencesStore.getState().preferences;
    expect(prefs.reply).toBe(true);
    expect(prefs.streak).toBe(false);
    expect(prefs.news).toBe(true);
    expect(prefs.system).toBe(true);
  });

  it("reset 恢复默认值", () => {
    const store = useNotificationPreferencesStore.getState();
    store.setPreferences({ badge: false, reply: false, streak: true, news: false });
    store.reset();
    const prefs = useNotificationPreferencesStore.getState().preferences;
    expect(prefs.badge).toBe(true);
    expect(prefs.reply).toBe(true);
    expect(prefs.streak).toBe(false);
    expect(prefs.news).toBe(true);
  });
});