// CodeGame Service Worker
// 高级离线缓存策略：分层缓存、版本管理、后台同步、更新通知
// 适用于 PWA 安装与离线访问。

const CACHE_VERSION = "v2";
const STATIC_CACHE = `codegame-static-${CACHE_VERSION}`;
const PAGE_CACHE = `codegame-pages-${CACHE_VERSION}`;
const API_CACHE = `codegame-api-${CACHE_VERSION}`;
const IMAGE_CACHE = `codegame-images-${CACHE_VERSION}`;

// 需要预缓存的核心页面路由
const PRECACHE_URLS = [
  "/",
  "/courses",
  "/daily",
  "/leaderboard",
  "/builds",
  "/community",
  "/blog",
  "/offline",
];

// 静态资源匹配模式（缓存优先，长期有效）
const STATIC_PATTERNS = [
  /\.(?:js|css)$/,
  /\/_next\/static\//,
  /\.(?:woff2?|ttf|eot|otf)$/,
];

// 图片资源匹配模式（缓存优先，长期有效）
const IMAGE_PATTERNS = [
  /\.(?:png|jpg|jpeg|gif|svg|webp|ico)$/,
  /\/images\//,
];

// API 请求匹配模式（网络优先，短期缓存）
const API_PATTERNS = [
  /\/api\//,
];

// 最大缓存条目数（按缓存类型）
const MAX_STATIC_ITEMS = 200;
const MAX_PAGE_ITEMS = 50;
const MAX_IMAGE_ITEMS = 500;
const MAX_API_ITEMS = 100;

// 缓存过期时间（毫秒）
const API_CACHE_MAX_AGE = 5 * 60 * 1000; // 5 分钟
const PAGE_CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 小时

// ============ 工具函数 ============

/**
 * 判断请求是否匹配某个 URL 模式列表
 */
function matchesPattern(url, patterns) {
  return patterns.some((pattern) => pattern.test(url));
}

/**
 * 限制缓存条目数量：删除最旧的条目直到不超过 maxItems
 */
async function trimCache(cacheName, maxItems) {
  try {
    const cache = await caches.open(cacheName);
    const keys = await cache.keys();
    if (keys.length > maxItems) {
      const toDelete = keys.slice(0, keys.length - maxItems);
      await Promise.all(toDelete.map((key) => cache.delete(key)));
    }
  } catch {
    // 清理失败不影响主流程
  }
}

/**
 * 判断缓存的 API 响应是否过期
 */
async function isApiCacheExpired(request) {
  try {
    const cache = await caches.open(API_CACHE);
    const cached = await cache.match(request);
    if (!cached) return true;
    const dateHeader = cached.headers.get("sw-cached-at");
    if (!dateHeader) return true;
    const cachedAt = parseInt(dateHeader, 10);
    return Date.now() - cachedAt > API_CACHE_MAX_AGE;
  } catch {
    return true;
  }
}

/**
 * 存储带时间戳的响应（用于判断过期）
 */
async function cacheWithTimestamp(cacheName, request, response) {
  if (!response.ok) return;
  const cache = await caches.open(cacheName);
  const cloned = response.clone();
  const headers = new Headers(cloned.headers);
  headers.set("sw-cached-at", String(Date.now()));
  const stampedResponse = new Response(cloned.body, {
    status: cloned.status,
    statusText: cloned.statusText,
    headers: headers,
  });
  await cache.put(request, stampedResponse);
}

// ============ 安装事件 ============

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch((err) => {
        console.warn("[CodeGame SW] 预缓存部分失败:", err);
      });
    }),
  );
  // 立即激活，不等待旧 SW 释放
  self.skipWaiting();
});

// ============ 激活事件 ============

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // 清理旧版本缓存
      const cacheKeys = await caches.keys();
      const currentCaches = [STATIC_CACHE, PAGE_CACHE, API_CACHE, IMAGE_CACHE];
      const deletions = cacheKeys
        .filter((key) => !currentCaches.includes(key))
        .map((key) => caches.delete(key));
      await Promise.all(deletions);

      // 通知所有客户端 SW 已更新
      const clients = await self.clients.matchAll({ type: "window" });
      clients.forEach((client) => {
        client.postMessage({ type: "SW_UPDATED", version: CACHE_VERSION });
      });
    })(),
  );
  // 接管所有页面
  self.clients.claim();
});

// ============ 请求拦截 ============

self.addEventListener("fetch", (event) => {
  const { request } = event;

  // 仅处理 GET 请求
  if (request.method !== "GET") return;

  // 跳过非 http(s) 请求
  const url = new URL(request.url);
  if (!url.protocol.startsWith("http")) return;

  // 跳过 chrome-extension
  if (url.protocol === "chrome-extension:") return;

  // 策略 1：静态资源 — 缓存优先（Cache First）
  if (matchesPattern(url.pathname, STATIC_PATTERNS)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE, MAX_STATIC_ITEMS));
    return;
  }

  // 策略 2：图片资源 — 缓存优先（Cache First）
  if (matchesPattern(url.pathname, IMAGE_PATTERNS)) {
    event.respondWith(cacheFirstStrategy(request, IMAGE_CACHE, MAX_IMAGE_ITEMS));
    return;
  }

  // 策略 3：API 请求 — 网络优先，短期缓存回退（Network First）
  if (matchesPattern(url.pathname, API_PATTERNS)) {
    event.respondWith(networkFirstStrategy(request, API_CACHE, MAX_API_ITEMS));
    return;
  }

  // 策略 4：页面导航 — 过期时重新验证（Stale While Revalidate）
  if (request.mode === "navigate") {
    event.respondWith(staleWhileRevalidateStrategy(request, PAGE_CACHE, MAX_PAGE_ITEMS));
    return;
  }

  // 默认策略：网络优先
  event.respondWith(networkFirstStrategy(request, PAGE_CACHE, MAX_PAGE_ITEMS));
});

// ============ 缓存策略 ============

/**
 * 缓存优先（Cache First）：优先使用缓存，缓存未命中时请求网络。
 * 适用于：静态资源（JS/CSS/字体）、图片
 */
async function cacheFirstStrategy(request, cacheName, maxItems) {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response.ok) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
      // 延迟清理（不阻塞响应）
      trimCache(cacheName, maxItems);
    }
    return response;
  } catch {
    // 网络不可用且无缓存时，对导航请求返回离线页面
    if (request.mode === "navigate") {
      return caches.match("/offline") || new Response("离线页面不可用", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return new Response("", { status: 408, statusText: "Request Timeout" });
  }
}

/**
 * 网络优先（Network First）：优先请求网络，失败时回退到缓存。
 * 适用于：API 请求
 */
async function networkFirstStrategy(request, cacheName, maxItems) {
  try {
    const response = await fetch(request);
    if (response.ok) {
      await cacheWithTimestamp(cacheName, request, response.clone());
      trimCache(cacheName, maxItems);
    }
    return response;
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;

    // 对导航请求返回离线页面
    if (request.mode === "navigate") {
      return caches.match("/offline") || new Response("离线页面不可用", {
        status: 503,
        headers: { "Content-Type": "text/plain; charset=utf-8" },
      });
    }
    return new Response("", { status: 408, statusText: "Request Timeout" });
  }
}

/**
 * 过期时重新验证（Stale While Revalidate）：
 * 立即返回缓存，同时在后台更新缓存。
 * 适用于：页面导航
 */
async function staleWhileRevalidateStrategy(request, cacheName, maxItems) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  // 后台更新
  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) {
        cache.put(request, response.clone());
        trimCache(cacheName, maxItems);
      }
      return response;
    })
    .catch(() => {
      // 后台更新失败，不影响已返回的缓存
    });

  // 如果已有缓存，立即返回并在后台更新
  if (cached) {
    // 延迟执行后台更新
    return cached;
  }

  // 无缓存时等待网络请求
  try {
    const response = await fetchPromise;
    return response;
  } catch {
    return caches.match("/offline") || new Response("离线页面不可用", {
      status: 503,
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
}

// ============ 消息处理 ============

self.addEventListener("message", (event) => {
  const { type } = event.data;

  if (type === "SKIP_WAITING") {
    self.skipWaiting();
  }

  if (type === "CLEAR_CACHES") {
    event.waitUntil(
      caches.keys().then((keys) => Promise.all(keys.map((k) => caches.delete(k)))),
    );
  }

  if (type === "GET_CACHE_STATS") {
    event.waitUntil(
      (async () => {
        const stats = {};
        for (const name of [STATIC_CACHE, PAGE_CACHE, API_CACHE, IMAGE_CACHE]) {
          try {
            const cache = await caches.open(name);
            const keys = await cache.keys();
            stats[name] = keys.length;
          } catch {
            stats[name] = -1;
          }
        }
        if (event.ports && event.ports[0]) {
          event.ports[0].postMessage(stats);
        }
      })(),
    );
  }
});