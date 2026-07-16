import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// 每个测试用例后清理 DOM，避免组件状态泄漏到下一个用例
afterEach(() => {
  cleanup();
});

// jsdom 不实现 matchMedia，组件中若用到需手动 mock
if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// jsdom 不实现 ResizeObserver（Monaco 等组件依赖）
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
if (!globalThis.ResizeObserver) {
  globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;
}
