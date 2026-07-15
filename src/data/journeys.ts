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
      "Build websites and web apps from scratch. Master HTML, CSS, JavaScript, and modern frameworks like React and Node.js.",
    emoji: "🌐",
    gradient: "linear-gradient(135deg, #FF6B9D, #7C5CFC)",
  },
  {
    name: "Data Science",
    description:
      "Wrangle, analyze, and visualize data. Learn Python, SQL, NumPy, Pandas, and Matplotlib to turn raw data into insight.",
    emoji: "📊",
    gradient: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
  },
  {
    name: "Artificial Intelligence",
    description:
      "Dive into machine learning and generative AI. From the fundamentals of Python to training your first models.",
    emoji: "🤖",
    gradient: "linear-gradient(135deg, #7C5CFC, #FF6B9D)",
  },
  {
    name: "Computer Science",
    description:
      "Build rock-solid foundations. Data structures, algorithms, and core languages like C++, Java, and more.",
    emoji: "🧠",
    gradient: "linear-gradient(135deg, #4ECDC4, #7C5CFC)",
  },
  {
    name: "Game Development",
    description:
      "Make games! Start with C# and Lua, then level up to game engines like Phaser for browser-based adventures.",
    emoji: "🎮",
    gradient: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
  },
];
