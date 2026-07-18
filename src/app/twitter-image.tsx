import { ImageResponse } from "next/og";

/**
 * Twitter 卡片分享图片。
 * 当页面没有自定义 twitter:image 时，Twitter/X 将使用此图片。
 * 与 opengraph-image 共用相同的视觉设计。
 */
export const runtime = "edge";

export const alt = "CodeGame — 最有趣的学编程方式";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,92,252,0.3) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -150,
            left: -150,
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,107,157,0.2) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
            padding: "60px 80px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 120,
              height: 120,
              borderRadius: 28,
              background: "linear-gradient(135deg, #7C5CFC, #FF6B9D)",
              marginBottom: 32,
              fontSize: 48,
              fontWeight: 700,
              color: "white",
              fontFamily: "monospace",
            }}
          >
            &lt;/&gt;
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 800,
              color: "white",
              textAlign: "center",
              marginBottom: 16,
              lineHeight: 1.2,
            }}
          >
            CodeGame
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#a0a0b8",
              textAlign: "center",
              maxWidth: 700,
              lineHeight: 1.4,
            }}
          >
            通过游戏化课程、浏览器代码编辑器和友好的社区，提升你的编程技能。
          </div>
          <div
            style={{
              position: "absolute",
              bottom: 40,
              display: "flex",
              gap: 24,
              fontSize: 20,
              color: "#7C5CFC",
              fontWeight: 600,
            }}
          >
            <span>🐍 Python</span>
            <span>⚡ JavaScript</span>
            <span>🎨 CSS</span>
            <span>📄 HTML</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}