import { describe, it, expect } from "vitest";
import { computeBadgeStates, earnedBadgesOnly } from "./badges";
import type { User, ProgressState, Build, CommunityPost } from "@/types";

// 构造一个干净的用户基线，便于在每个用例中覆盖少量字段
function baselineUser(overrides: Partial<User> = {}): User {
  return {
    id: "u_test",
    username: "tester",
    avatarGradient: "linear-gradient(135deg, #000, #fff)",
    bio: "",
    xpTotal: 0,
    level: 1,
    streakDays: 0,
    lastActiveDate: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    countryFlag: "🏳️",
    role: "member",
    ...overrides,
  };
}

function emptyProgress(): ProgressState {
  return { statuses: {}, codeSnapshots: {} };
}

describe("computeBadgeStates", () => {
  it("默认状态下所有徽章未获得", () => {
    const badges = computeBadgeStates({
      user: baselineUser(),
      progress: emptyProgress(),
      builds: [],
      posts: [],
    });
    // 至少有 12 个徽章
    expect(badges.length).toBeGreaterThanOrEqual(12);
    // 默认全部未获得
    expect(badges.every((b) => b.earned === false)).toBe(true);
  });

  it("bdg_first_steps：完成任意 1 个练习后获得", () => {
    // 取 python 课程第一个练习作为已完成
    const badges = computeBadgeStates({
      user: baselineUser(),
      progress: {
        statuses: { "py_ch1_ex1": "completed" },
        codeSnapshots: {},
      },
      builds: [],
      posts: [],
    });
    const first = badges.find((b) => b.id === "bdg_first_steps");
    expect(first?.earned).toBe(true);
  });

  it("bdg_streak_7 / 30 / 100 随连续天数递进", () => {
    const at7 = computeBadgeStates({
      user: baselineUser({ streakDays: 7 }),
      progress: emptyProgress(),
      builds: [],
      posts: [],
    });
    expect(at7.find((b) => b.id === "bdg_streak_7")?.earned).toBe(true);
    expect(at7.find((b) => b.id === "bdg_streak_30")?.earned).toBe(false);

    const at30 = computeBadgeStates({
      user: baselineUser({ streakDays: 30 }),
      progress: emptyProgress(),
      builds: [],
      posts: [],
    });
    expect(at30.find((b) => b.id === "bdg_streak_7")?.earned).toBe(true);
    expect(at30.find((b) => b.id === "bdg_streak_30")?.earned).toBe(true);
    expect(at30.find((b) => b.id === "bdg_streak_100")?.earned).toBe(false);

    const at100 = computeBadgeStates({
      user: baselineUser({ streakDays: 100 }),
      progress: emptyProgress(),
      builds: [],
      posts: [],
    });
    expect(at100.find((b) => b.id === "bdg_streak_100")?.earned).toBe(true);
  });

  it("bdg_level_10：等级 ≥ 10 获得", () => {
    const badges = computeBadgeStates({
      user: baselineUser({ level: 10, xpTotal: 13750 }),
      progress: emptyProgress(),
      builds: [],
      posts: [],
    });
    expect(badges.find((b) => b.id === "bdg_level_10")?.earned).toBe(true);
  });

  it("bdg_first_build：仅当用户有已发布作品时获得（草稿不算）", () => {
    const draftBuild: Build = {
      id: "b1",
      userId: "u_test",
      authorName: "tester",
      authorAvatar: "",
      title: "draft",
      description: "",
      files: [],
      isPublished: false,
      thumbnailGradient: "",
      viewCount: 0,
      likeCount: 0,
      createdAt: new Date().toISOString(),
    };
    const publishedBuild: Build = { ...draftBuild, id: "b2", isPublished: true };

    expect(
      computeBadgeStates({
        user: baselineUser(),
        progress: emptyProgress(),
        builds: [draftBuild],
        posts: [],
      }).find((b) => b.id === "bdg_first_build")?.earned,
    ).toBe(false);

    expect(
      computeBadgeStates({
        user: baselineUser(),
        progress: emptyProgress(),
        builds: [publishedBuild],
        posts: [],
      }).find((b) => b.id === "bdg_first_build")?.earned,
    ).toBe(true);
  });

  it("bdg_first_post：用户作为作者发表帖子后获得", () => {
    const myPost: CommunityPost = {
      id: "p1",
      userId: "u_test",
      authorName: "tester",
      authorAvatar: "",
      authorLevel: 1,
      category: "general",
      title: "hi",
      content: "hello",
      likeCount: 0,
      commentCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      isStaffPick: false,
    };
    const badges = computeBadgeStates({
      user: baselineUser(),
      progress: emptyProgress(),
      builds: [],
      posts: [myPost],
    });
    expect(badges.find((b) => b.id === "bdg_first_post")?.earned).toBe(true);
  });

  it("bdg_helpful：用户帖子累计点赞 ≥ 100 获得", () => {
    const myPost: CommunityPost = {
      id: "p1",
      userId: "u_test",
      authorName: "tester",
      authorAvatar: "",
      authorLevel: 1,
      category: "general",
      title: "hi",
      content: "hello",
      likeCount: 99,
      commentCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      isStaffPick: false,
    };
    const myPost2: CommunityPost = { ...myPost, id: "p2", likeCount: 1 };

    expect(
      computeBadgeStates({
        user: baselineUser(),
        progress: emptyProgress(),
        builds: [],
        posts: [myPost],
      }).find((b) => b.id === "bdg_helpful")?.earned,
    ).toBe(false);

    expect(
      computeBadgeStates({
        user: baselineUser(),
        progress: emptyProgress(),
        builds: [],
        posts: [myPost, myPost2],
      }).find((b) => b.id === "bdg_helpful")?.earned,
    ).toBe(true);
  });

  it("bdg_staff_pick：用户帖子被标为编辑精选时获得", () => {
    const staffPickPost: CommunityPost = {
      id: "p1",
      userId: "u_test",
      authorName: "tester",
      authorAvatar: "",
      authorLevel: 1,
      category: "general",
      title: "hi",
      content: "hello",
      likeCount: 0,
      commentCount: 0,
      comments: [],
      createdAt: new Date().toISOString(),
      isStaffPick: true,
    };
    const badges = computeBadgeStates({
      user: baselineUser(),
      progress: emptyProgress(),
      builds: [],
      posts: [staffPickPost],
    });
    expect(badges.find((b) => b.id === "bdg_staff_pick")?.earned).toBe(true);
  });
});

describe("earnedBadgesOnly", () => {
  it("仅返回 earned=true 的徽章", () => {
    const earned = earnedBadgesOnly({
      user: baselineUser({ streakDays: 7, level: 10, xpTotal: 13750 }),
      progress: emptyProgress(),
      builds: [],
      posts: [],
    });
    // 至少 streak_7 与 level_10
    const ids = earned.map((b) => b.id);
    expect(ids).toContain("bdg_streak_7");
    expect(ids).toContain("bdg_level_10");
    // 不应包含未达标的
    expect(ids).not.toContain("bdg_streak_30");
    expect(earned.every((b) => b.earned)).toBe(true);
  });
});
