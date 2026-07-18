import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { StoreHydration } from "@/components/layout/StoreHydration";
import { ServiceWorkerRegister } from "@/components/layout/ServiceWorkerRegister";

// 合并 Outfit Regular + Bold 为单个声明，减少字体请求数。
// preload: true（默认）会让 Next.js 注入 <link rel="preload">，加快 LCP。
const outfit = localFont({
  src: [
    { path: "../../public/fonts/Outfit-Regular.ttf", weight: "400" },
    { path: "../../public/fonts/Outfit-Bold.ttf", weight: "700" },
  ],
  variable: "--font-outfit",
  display: "swap",
  preload: true,
});
// 正文字体同样预加载
const work = localFont({
  src: "../../public/fonts/WorkSans-Regular.ttf",
  variable: "--font-work",
  display: "swap",
  preload: true,
});
// 代码字体仅在编辑器/代码块使用，预加载收益小，关闭以节省带宽
const mono = localFont({
  src: "../../public/fonts/JetBrainsMono-Regular.ttf",
  variable: "--font-mono",
  display: "swap",
  preload: false,
});
// 装饰字体，不预加载以减少首屏资源
const pixel = localFont({
  src: "../../public/fonts/PixelifySans-Medium.ttf",
  variable: "--font-pixel",
  weight: "500",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "CodeGame — 最有趣的学编程方式",
  description:
    "CodeGame 是一个游戏化的入门友好平台，学习 Python、HTML、CSS、JavaScript 等。提升等级、获得 XP，构建真实项目。",
  keywords: ["学编程", "python", "javascript", "html", "css", "编程入门", "游戏化学习"],
  metadataBase: new URL("https://codegame.app"),
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.svg",
    apple: "/icon-192.png",
  },
  openGraph: {
    title: "CodeGame — 最有趣的学编程方式",
    description: "通过游戏化课程、浏览器代码编辑器和友好的社区，提升你的编程技能。",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CodeGame — 最有趣的学编程方式",
    description: "通过游戏化课程、浏览器代码编辑器和友好的社区，提升你的编程技能。",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="zh-CN"
      className={`${outfit.variable} ${work.variable} ${mono.variable} ${pixel.variable}`}
    >
      <head>
        {/* RSS Feed 自动发现：让 RSS 阅读器可以发现博客订阅 */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="CodeGame 博客 RSS"
          href="/feed.xml"
        />
      </head>
      <body className="relative">
        {/* 跳过导航链接：键盘用户可跳过导航直接进入主内容 */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-[100] focus:px-4 focus:py-2 focus:rounded-lg focus:bg-accent focus:text-white focus:font-semibold focus:outline-none"
        >
          跳转到主内容
        </a>
        <StoreHydration>
          <Shell>{children}</Shell>
        </StoreHydration>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
