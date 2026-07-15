import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Shell } from "@/components/layout/Shell";
import { StoreHydration } from "@/components/layout/StoreHydration";

const outfit = localFont({
  src: "../../public/fonts/Outfit-Regular.ttf",
  variable: "--font-outfit",
  display: "swap",
});
const outfitBold = localFont({
  src: "../../public/fonts/Outfit-Bold.ttf",
  variable: "--font-outfit-bold",
  weight: "700",
  display: "swap",
});
const work = localFont({
  src: "../../public/fonts/WorkSans-Regular.ttf",
  variable: "--font-work",
  display: "swap",
});
const mono = localFont({
  src: "../../public/fonts/JetBrainsMono-Regular.ttf",
  variable: "--font-mono",
  display: "swap",
});
const pixel = localFont({
  src: "../../public/fonts/PixelifySans-Medium.ttf",
  variable: "--font-pixel",
  weight: "500",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CodeGame — 最有趣的学编程方式",
  description:
    "CodeGame 是一个游戏化的入门友好平台，学习 Python、HTML、CSS、JavaScript 等。提升等级、获得 XP，构建真实项目。",
  keywords: ["学编程", "python", "javascript", "html", "css", "编程入门", "游戏化学习"],
  openGraph: {
    title: "CodeGame — 最有趣的学编程方式",
    description: "通过游戏化课程、浏览器代码编辑器和友好的社区，提升你的编程技能。",
    type: "website",
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
      className={`${outfit.variable} ${outfitBold.variable} ${work.variable} ${mono.variable} ${pixel.variable}`}
    >
      <body className="relative">
        <StoreHydration />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
