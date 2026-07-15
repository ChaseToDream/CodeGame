import type { CommunityPost } from "@/types";

export const communityPosts: CommunityPost[] = [
  {
    id: "p_1",
    userId: "u_sarah",
    authorName: "sarah_codes",
    authorAvatar: "linear-gradient(135deg, #FF6B9D, #7C5CFC)",
    authorLevel: 12,
    category: "project_showcase",
    title: "Just finished my Pixel Pet Garden build! 🌱",
    content:
      "After 3 weeks of learning HTML/CSS/JS on Codédex, I finally shipped my first interactive project. It's a virtual garden where you water pixel pets. The hardest part was getting the click handlers right, but the celebration animation when you complete an exercise kept me motivated!\n\nWould love feedback on the styling — still not sure about the color palette.",
    attachedBuildId: "b_1",
    isStaffPick: true,
    likeCount: 142,
    commentCount: 8,
    comments: [
      {
        id: "c_1",
        userId: "u_marco",
        authorName: "marco.dev",
        authorAvatar: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
        content: "This is so cute! The hover animations on the pets are chef's kiss 👌",
        likeCount: 12,
        createdAt: "2026-07-02T09:30:00Z",
      },
      {
        id: "c_2",
        userId: "u_staff",
        authorName: "codex_team",
        authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
        content: "Congrats on shipping! We featured this as a Staff Pick. 🌟 Keep building!",
        likeCount: 34,
        createdAt: "2026-07-02T11:00:00Z",
      },
    ],
    createdAt: "2026-07-01T14:30:00Z",
  },
  {
    id: "p_2",
    userId: "u_marco",
    authorName: "marco.dev",
    authorAvatar: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
    authorLevel: 18,
    category: "career",
    title: "Got my first dev job after 6 months on Codédex 🎉",
    content:
      "I started with zero programming knowledge back in January. Did Python, then JavaScript, then React. The XP system here made it actually fun to show up every day. I built 3 projects in the Builds editor and put them on my portfolio. Last week I got an offer for a Junior Frontend role!\n\nTo anyone doubting if they can do it: yes, you can. One exercise at a time.",
    isStaffPick: false,
    likeCount: 318,
    commentCount: 24,
    comments: [
      {
        id: "c_3",
        userId: "u_aria",
        authorName: "aria_makes",
        authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
        content: "Huge congrats! This is so inspiring 🙌",
        likeCount: 8,
        createdAt: "2026-07-03T08:00:00Z",
      },
    ],
    createdAt: "2026-07-03T07:45:00Z",
  },
  {
    id: "p_3",
    userId: "u_aria",
    authorName: "aria_makes",
    authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
    authorLevel: 7,
    category: "general",
    title: "Stuck on FizzBuzz — any hints without spoiling?",
    content:
      "I've been staring at this for an hour. I have the loop working but the multiples logic is confusing me. The hint says to use modulo but I'm not sure how to combine the conditions for FizzBuzz (both 3 and 5).\n\nAnyone willing to nudge me in the right direction? Not looking for the answer!",
    isStaffPick: false,
    likeCount: 27,
    commentCount: 5,
    comments: [
      {
        id: "c_4",
        userId: "u_kenji",
        authorName: "kenji_pixel",
        authorAvatar: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
        content: "Think about it: a number that's divisible by BOTH 3 and 5 is also divisible by... what? 😉",
        likeCount: 19,
        createdAt: "2026-07-04T16:20:00Z",
      },
    ],
    createdAt: "2026-07-04T15:00:00Z",
  },
  {
    id: "p_4",
    userId: "u_kenji",
    authorName: "kenji_pixel",
    authorAvatar: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
    authorLevel: 9,
    category: "introductions",
    title: "Hi everyone! 14yo from Osaka, Japan 🇯🇵",
    content:
      "Konnichiwa! I'm Kenji, I just started learning on Codédex last week. I love the pixel art style — it reminds me of my favorite old games. Currently working through HTML and hoping to make my own game website someday.\n\nNice to meet you all!",
    isStaffPick: false,
    likeCount: 89,
    commentCount: 12,
    comments: [],
    createdAt: "2026-07-05T10:00:00Z",
  },
  {
    id: "p_5",
    userId: "u_aria",
    authorName: "aria_makes",
    authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
    authorLevel: 7,
    category: "project_showcase",
    title: "Built a Lofi Study Timer — perfect for focus sessions 🍅",
    content:
      "I kept getting distracted while studying so I built myself a pomodoro timer with a cozy gradient background. 25 min focus, then it stops. Simple but it works for me!\n\nLive demo below — let me know what you think.",
    attachedBuildId: "b_3",
    isStaffPick: false,
    likeCount: 67,
    commentCount: 4,
    comments: [],
    createdAt: "2026-07-08T18:00:00Z",
  },
];

export function getPostById(id: string): CommunityPost | undefined {
  return communityPosts.find((p) => p.id === id);
}
