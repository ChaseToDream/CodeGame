import type { Metadata } from "next";
import { OfflineClient } from "./OfflineClient";

export const metadata: Metadata = {
  title: "离线模式 - CodeGame",
};

/**
 * 离线页面：当用户处于离线状态时显示。
 * 由 Service Worker 在网络不可用时返回。
 * 交互逻辑拆分到 OfflineClient（Client Component），
 * 本文件仅负责 metadata 导出（Server Component）。
 */
export default function OfflinePage() {
  return <OfflineClient />;
}