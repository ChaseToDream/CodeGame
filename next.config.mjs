/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // 内容安全策略：限制资源加载来源
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net blob:",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob:",
              "font-src 'self' data:",
              "connect-src 'self' https://cdn.jsdelivr.net",
              "worker-src 'self' blob:",
              "frame-src 'self' blob:",
              "object-src 'none'",
              "base-uri 'self'",
            ].join("; "),
          },
          // 防止 MIME 类型嗅探
          { key: "X-Content-Type-Options", value: "nosniff" },
          // 防止点击劫持
          { key: "X-Frame-Options", value: "DENY" },
          // HSTS：强制 HTTPS（生产环境）
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
          // Referrer 策略
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          // 权限策略
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
