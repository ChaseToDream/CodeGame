// CodeGame Service Worker
// 基础离线缓存策略：优先网络，回退到缓存。
// 适用于 PWA 安装与离线访问。

const CACHE_NAME = "codegame-v1";

const PRECACHE_URLS = [
  "/",
  "/courses",
  "/daily",
  "/leaderboard",
  "/builds",
  "/community",
  "/blog",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_URLS);
    }),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)),
      );
    }),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // 仅处理 GET 请求
  if (event.request.method !== "GET") return;

  // 跳过 chrome-extension 等非 http(s) 请求
  const url = new URL(event.request.url);
  if (!url.protocol.startsWith("http")) return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // 缓存成功的响应
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // 网络不可用时回退到缓存
        return caches.match(event.request) as Promise<Response>;
      }),
  );
});