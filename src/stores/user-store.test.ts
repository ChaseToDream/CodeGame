import { describe, it, expect, beforeEach } from "vitest";
import { useUserStore } from "./user-store";
import { courses } from "@/data/courses";

/**
 * user-store 单元测试
 *
 * 由于 store 使用 persist 中间件 + localStorage，每个用例前需：
 * 1. 清空 localStorage，避免上一个用例的持久化状态泄漏
 * 2. 调用 store 的 resetLocalData，把内存状态恢复为默认值
 */
beforeEach(() => {
  if (typeof localStorage !== "undefined") localStorage.clear();
  useUserStore.getState().resetLocalData();
});

describe("ensureCourseInit", () => {
  it("初始化后第一章第一个练习为 unlocked，其余为 locked", () => {
    const { ensureCourseInit, progress } = useUserStore.getState();
    ensureCourseInit("python");
    const statuses = useUserStore.getState().progress.statuses;

    const python = courses.find((c) => c.slug === "python")!;
    const firstEx = python.chapters[0].exercises[0];
    expect(statuses[firstEx.id]).toBe("unlocked");

    // 其余练习应为 locked（除非已被前次测试污染，但 beforeEach 已重置）
    const otherEx = python.chapters[0].exercises[1];
    if (otherEx) {
      expect(statuses[otherEx.id]).toBe("locked");
    }
  });

  it("重复调用幂等，不覆盖已完成的进度", () => {
    const store = useUserStore.getState();
    store.ensureCourseInit("python");
    const firstEx = courses.find((c) => c.slug === "python")!.chapters[0].exercises[0];
    // 标记为已完成
    store.setExerciseStatus(firstEx.id, "completed");

    // 再次初始化不应覆盖
    useUserStore.getState().ensureCourseInit("python");
    expect(useUserStore.getState().progress.statuses[firstEx.id]).toBe("completed");
  });

  it("不存在的课程 slug 静默返回", () => {
    const before = useUserStore.getState().progress.statuses;
    useUserStore.getState().ensureCourseInit("nonexistent-course");
    expect(useUserStore.getState().progress.statuses).toEqual(before);
  });
});

describe("completeExercise", () => {
  it("首次完成发放 XP 并解锁下一个练习", () => {
    const store = useUserStore.getState();
    store.ensureCourseInit("python");
    const python = courses.find((c) => c.slug === "python")!;
    const firstEx = python.chapters[0].exercises[0];
    const nextEx = python.chapters[0].exercises[1] ?? python.chapters[1]?.exercises[0];

    const xpBefore = useUserStore.getState().user.xpTotal;
    const newBadges = store.completeExercise(firstEx.id, 50);

    const after = useUserStore.getState();
    expect(after.user.xpTotal).toBe(xpBefore + 50);
    expect(after.progress.statuses[firstEx.id]).toBe("completed");
    if (nextEx) {
      expect(after.progress.statuses[nextEx.id]).toBe("unlocked");
    }
    // 首次完成第一个练习应解锁 bdg_first_steps
    expect(newBadges).toContain("bdg_first_steps");
  });

  it("重复完成同一练习不重复发放 XP", () => {
    const store = useUserStore.getState();
    store.ensureCourseInit("python");
    const firstEx = courses.find((c) => c.slug === "python")!.chapters[0].exercises[0];

    store.completeExercise(firstEx.id, 50);
    const xpAfterFirst = useUserStore.getState().user.xpTotal;

    store.completeExercise(firstEx.id, 50);
    expect(useUserStore.getState().user.xpTotal).toBe(xpAfterFirst);
  });

  it("更新 lastActiveDate 与 streakDays", () => {
    const store = useUserStore.getState();
    store.ensureCourseInit("python");
    const firstEx = courses.find((c) => c.slug === "python")!.chapters[0].exercises[0];

    // DEFAULT_USER 的 lastActiveDate 是今天，computeStreak 会判定"今天已记录"→ streak 不变
    // 为验证"昨天记录 → +1"分支，先把 lastActiveDate 设为昨天
    const yesterday = new Date(Date.now() - 86400000).toISOString();
    store.updateUser({ lastActiveDate: yesterday, streakDays: 0 });

    const before = useUserStore.getState().user;
    store.completeExercise(firstEx.id, 10);
    const after = useUserStore.getState().user;

    // 昨天有记录 → streak 应为 1
    expect(after.streakDays).toBe(1);
    expect(new Date(after.lastActiveDate).getTime()).toBeGreaterThan(
      new Date(before.lastActiveDate).getTime(),
    );
  });
});

describe("createBuild / updateBuild / publishBuild", () => {
  it("createBuild 创建未发布草稿，不发放 XP", () => {
    const store = useUserStore.getState();
    const xpBefore = store.user.xpTotal;
    const id = store.createBuild("test", []);
    expect(id.startsWith("b_")).toBe(true);

    const after = useUserStore.getState();
    const build = after.builds.find((b) => b.id === id);
    expect(build).toBeDefined();
    expect(build!.isPublished).toBe(false);
    expect(build!.userId).toBe(after.user.id);
    // 创建草稿不发 XP
    expect(after.user.xpTotal).toBe(xpBefore);
  });

  it("updateBuild 局部更新", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("title", []);
    store.updateBuild(id, { title: "new title", description: "desc" });

    const build = useUserStore.getState().builds.find((b) => b.id === id);
    expect(build!.title).toBe("new title");
    expect(build!.description).toBe("desc");
  });

  it("publishBuild 首次发布发放 30 XP", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("pub", []);
    const xpBefore = useUserStore.getState().user.xpTotal;

    store.publishBuild(id, "desc");
    const after = useUserStore.getState();
    expect(after.builds.find((b) => b.id === id)!.isPublished).toBe(true);
    expect(after.user.xpTotal).toBe(xpBefore + 30);
  });

  it("publishBuild 重复发布不重复发放 XP", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("pub", []);
    store.publishBuild(id, "desc");
    const xpAfterFirst = useUserStore.getState().user.xpTotal;

    store.publishBuild(id, "new desc");
    expect(useUserStore.getState().user.xpTotal).toBe(xpAfterFirst);
  });
});

describe("forkBuild", () => {
  it("复刻已存在的作品，标题加 (Fork) 后缀", () => {
    const store = useUserStore.getState();
    const originalId = store.createBuild("original", []);
    const forkedId = store.forkBuild(originalId);
    expect(forkedId).not.toBeNull();

    const forked = useUserStore.getState().builds.find((b) => b.id === forkedId);
    expect(forked!.title).toBe("original (Fork)");
    expect(forked!.isPublished).toBe(false);
    expect(forked!.forkedFrom).toBe(originalId);
    expect(forked!.userId).toBe(useUserStore.getState().user.id);
  });

  it("复刻不存在的 id 返回 null", () => {
    expect(useUserStore.getState().forkBuild("nonexistent")).toBeNull();
  });
});

describe("incrementBuildView", () => {
  it("对 store 中存在的作品浏览量 +1", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("viewable", []);
    const before = useUserStore.getState().builds.find((b) => b.id === id)!.viewCount;

    store.incrementBuildView(id);
    store.incrementBuildView(id);
    const after = useUserStore.getState().builds.find((b) => b.id === id)!.viewCount;

    expect(after).toBe(before + 2);
  });

  it("对 store 中不存在的 id（种子作品）为空操作，不抛错", () => {
    const before = useUserStore.getState().builds;
    useUserStore.getState().incrementBuildView("nonexistent-build-id");
    // builds 引用不变，说明未触发 set
    expect(useUserStore.getState().builds).toBe(before);
  });
});

describe("createPost / togglePostLike / addComment", () => {
  it("createPost 发放 10 XP", () => {
    const store = useUserStore.getState();
    const xpBefore = store.user.xpTotal;
    const id = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    expect(id.startsWith("p_")).toBe(true);
    expect(useUserStore.getState().user.xpTotal).toBe(xpBefore + 10);
  });

  it("togglePostLike 切换 likedByMe 并增减 likeCount", () => {
    const store = useUserStore.getState();
    const id = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    const before = useUserStore.getState().posts.find((p) => p.id === id)!;
    expect(before.likedByMe ?? false).toBe(false);
    expect(before.likeCount).toBe(0);

    store.togglePostLike(id);
    const after1 = useUserStore.getState().posts.find((p) => p.id === id)!;
    expect(after1.likedByMe).toBe(true);
    expect(after1.likeCount).toBe(1);

    store.togglePostLike(id);
    const after2 = useUserStore.getState().posts.find((p) => p.id === id)!;
    expect(after2.likedByMe).toBe(false);
    expect(after2.likeCount).toBe(0);
  });

  it("addComment 增加评论并发放 5 XP", () => {
    const store = useUserStore.getState();
    const id = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    const xpBefore = useUserStore.getState().user.xpTotal;

    store.addComment(id, "nice post");
    const after = useUserStore.getState();
    const post = after.posts.find((p) => p.id === id)!;
    expect(post.commentCount).toBe(1);
    expect(post.comments.length).toBe(1);
    expect(post.comments[0].content).toBe("nice post");
    expect(after.user.xpTotal).toBe(xpBefore + 5);
  });
});

describe("updateUser", () => {
  it("局部更新用户字段", () => {
    const store = useUserStore.getState();
    store.updateUser({ username: "newname", bio: "new bio" });
    const after = useUserStore.getState().user;
    expect(after.username).toBe("newname");
    expect(after.bio).toBe("new bio");
  });
});

describe("awardBadge", () => {
  it("添加未持有的徽章", () => {
    const store = useUserStore.getState();
    store.awardBadge("bdg_test");
    expect(useUserStore.getState().earnedBadgeIds).toContain("bdg_test");
  });

  it("重复添加同一徽章幂等", () => {
    const store = useUserStore.getState();
    store.awardBadge("bdg_test");
    store.awardBadge("bdg_test");
    const count = useUserStore.getState().earnedBadgeIds.filter((x) => x === "bdg_test").length;
    expect(count).toBe(1);
  });
});

describe("resetLocalData", () => {
  it("重置后用户回到默认状态", () => {
    const store = useUserStore.getState();
    store.updateUser({ xpTotal: 9999, username: "changed" });
    store.resetLocalData();
    const after = useUserStore.getState();
    expect(after.user.xpTotal).toBe(0);
    expect(after.user.username).toBe("玩家");
    expect(after.progress.statuses).toEqual({});
    expect(after.earnedBadgeIds).toEqual([]);
  });
});
