import LeaderboardClient from "./LeaderboardClient";

export const metadata = {
  title: "排行榜 · CodeGame",
  description: "查看全球学习者的 XP 排名，与社区一起进步。",
};

export default function Page() {
  return <LeaderboardClient />;
}
