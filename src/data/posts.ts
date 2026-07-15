import type { CommunityPost } from "@/types";

export const communityPosts: CommunityPost[] = [
  {
    id: "p_1",
    userId: "u_sarah",
    authorName: "sarah_codes",
    authorAvatar: "linear-gradient(135deg, #FF6B9D, #7C5CFC)",
    authorLevel: 12,
    category: "project_showcase",
    title: "刚完成了我的像素宠物花园作品！🌱",
    content:
      "在 Codédex 上学了 3 周 HTML/CSS/JS 后，我终于发布了自己的第一个交互式项目。这是一个虚拟花园，你可以给像素宠物浇水。最难的部分是搞定点击事件处理，但完成练习时的庆祝动画让我一直保持动力！\n\n很想听听大家对样式的反馈——我还不太确定配色方案。",
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
        content: "太可爱了！宠物上的悬停动画简直完美 👌",
        likeCount: 12,
        createdAt: "2026-07-02T09:30:00Z",
      },
      {
        id: "c_2",
        userId: "u_staff",
        authorName: "codex_team",
        authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
        content: "恭喜发布！我们已将此作品选为编辑精选。🌟 继续创作！",
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
    title: "在 Codédex 学了 6 个月后，我拿到了第一份开发工作 🎉",
    content:
      "今年一月我开始学的时候，编程知识为零。先学 Python，再学 JavaScript，然后是 React。这里的 XP 系统让我每天都能开心地坚持下来。我在作品编辑器里做了 3 个项目，放进了作品集。上周我拿到了一份初级前端岗位的 offer！\n\n致所有怀疑自己能不能做到的人：你可以的。一次一个练习。",
    isStaffPick: false,
    likeCount: 318,
    commentCount: 24,
    comments: [
      {
        id: "c_3",
        userId: "u_aria",
        authorName: "aria_makes",
        authorAvatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
        content: "恭喜恭喜！太励志了 🙌",
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
    title: "卡在 FizzBuzz 上了——能给点提示但不剧透吗？",
    content:
      "我盯着这个看了一个小时。循环能跑了，但倍数的逻辑把我搞晕了。提示说要用取模，但我不太确定怎么组合 FizzBuzz（同时是 3 和 5）的条件。\n\n有人愿意把我往正确方向推一把吗？不想要直接答案！",
    isStaffPick: false,
    likeCount: 27,
    commentCount: 5,
    comments: [
      {
        id: "c_4",
        userId: "u_kenji",
        authorName: "kenji_pixel",
        authorAvatar: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
        content: "想想看：一个数同时能被 3 和 5 整除，那它也能被……什么整除？😉",
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
    title: "大家好！14 岁，来自日本大阪 🇯🇵",
    content:
      "Konnichiwa（你好）！我是 Kenji，上周刚开始在 Codédex 上学习。我很喜欢这里的像素艺术风格——它让我想起我最爱的老游戏。目前正在学 HTML，希望有一天能做出自己的游戏网站。\n\n很高兴认识大家！",
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
    title: "做了一个 Lofi 学习计时器——专注 sessions 神器 🍅",
    content:
      "我学习时老是分心，所以给自己做了一个番茄钟计时器，配上温馨的渐变背景。25 分钟专注，然后停止。简单但对我很有效！\n\n下面是实时演示——告诉我你的想法。",
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
