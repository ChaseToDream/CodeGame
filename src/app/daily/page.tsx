import DailyChallengeClient from "./DailyChallengeClient";

export const metadata = {
  title: "每日挑战 · CodeGame",
  description: "每天一道精选编程题，保持学习节奏，累积连续天数。",
};

export default function Page() {
  return <DailyChallengeClient />;
}
