import type { LearningJourney } from "@/types";

export interface JourneyMeta {
  name: LearningJourney;
  description: string;
  emoji: string;
  gradient: string;
}

export const learningJourneys: JourneyMeta[] = [
  {
    name: "Web Development",
    description:
      "从零开始构建网站和 Web 应用。掌握 HTML、CSS、JavaScript 以及 React 和 Node.js 等现代框架。",
    emoji: "🌐",
    gradient: "linear-gradient(135deg, #FF6B9D, #7C5CFC)",
  },
  {
    name: "Data Science",
    description:
      "处理、分析和可视化数据。学习 Python、SQL、NumPy、Pandas 和 Matplotlib，将原始数据转化为洞察。",
    emoji: "📊",
    gradient: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
  },
  {
    name: "Artificial Intelligence",
    description:
      "深入机器学习和生成式 AI。从 Python 基础到训练你的第一个模型。",
    emoji: "🤖",
    gradient: "linear-gradient(135deg, #7C5CFC, #FF6B9D)",
  },
  {
    name: "Computer Science",
    description:
      "打下坚实的基础。数据结构、算法以及 C++、Java 等核心语言。",
    emoji: "🧠",
    gradient: "linear-gradient(135deg, #4ECDC4, #7C5CFC)",
  },
  {
    name: "Game Development",
    description:
      "制作游戏！从 C# 和 Lua 开始，然后进阶到 Phaser 等游戏引擎，创建浏览器游戏。",
    emoji: "🎮",
    gradient: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
  },
];
