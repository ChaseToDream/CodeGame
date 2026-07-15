import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "#1a1a2e",
        bg2: "#252544",
        bg3: "#2d2d52",
        ink: "#e8e8f0",
        muted: "#a0a0b8",
        rule: "#3a3a5c",
        accent: "#7c5cfc",
        accent2: "#ff6b9d",
        accent3: "#4ecdc4",
        success: "#6bcf7f",
        warning: "#f0a04b",
        codebg: "#16162a",
      },
      fontFamily: {
        outfit: ["var(--font-outfit)", "sans-serif"],
        work: ["var(--font-work)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        pixel: ["var(--font-pixel)", "monospace"],
      },
      boxShadow: {
        glow: "0 0 24px rgba(124, 92, 252, 0.45)",
        "glow-pink": "0 0 24px rgba(255, 107, 157, 0.45)",
        card: "0 8px 30px rgba(0, 0, 0, 0.35)",
      },
      backgroundImage: {
        "grid-purple": "linear-gradient(135deg, #7c5cfc 0%, #ff6b9d 100%)",
        "grid-cyan": "linear-gradient(135deg, #4ecdc4 0%, #7c5cfc 100%)",
      },
      keyframes: {
        floaty: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(124, 92, 252, 0.4)" },
          "50%": { boxShadow: "0 0 24px 4px rgba(124, 92, 252, 0.4)" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        xpPop: {
          "0%": { transform: "scale(0.5) translateY(40px)", opacity: "0" },
          "30%": { transform: "scale(1.1) translateY(0)", opacity: "1" },
          "70%": { transform: "scale(1) translateY(-10px)", opacity: "1" },
          "100%": { transform: "scale(0.9) translateY(-60px)", opacity: "0" },
        },
      },
      animation: {
        floaty: "floaty 4s ease-in-out infinite",
        shimmer: "shimmer 2.5s linear infinite",
        pulseGlow: "pulseGlow 2s ease-in-out infinite",
        slideUp: "slideUp 0.5s ease-out",
        xpPop: "xpPop 2s ease-out forwards",
      },
    },
  },
  plugins: [],
};

export default config;
