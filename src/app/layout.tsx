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
  title: "Codédex — The most fun way to learn to code",
  description:
    "Codédex is a gamified, beginner-friendly platform to learn Python, HTML, CSS, JavaScript and more. Level up, earn XP, and build real projects.",
  keywords: ["learn to code", "python", "javascript", "html", "css", "coding for beginners", "gamified learning"],
  openGraph: {
    title: "Codédex — The most fun way to learn to code",
    description: "Level up your coding skills with gamified lessons, a browser code editor, and a friendly community.",
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
      lang="en"
      className={`${outfit.variable} ${outfitBold.variable} ${work.variable} ${mono.variable} ${pixel.variable}`}
    >
      <body className="relative">
        <StoreHydration />
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
