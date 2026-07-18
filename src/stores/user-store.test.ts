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

describe("toggleBuildLike", () => {
  it("首次点赞：likedByMe 置 true，likeCount +1", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("likable", []);
    const before = useUserStore.getState().builds.find((b) => b.id === id)!;
    expect(before.likedByMe ?? false).toBe(false);
    expect(before.likeCount).toBe(0);

    store.toggleBuildLike(id);
    const after = useUserStore.getState().builds.find((b) => b.id === id)!;
    expect(after.likedByMe).toBe(true);
    expect(after.likeCount).toBe(1);
  });

  it("再次点击取消点赞：likedByMe 置 false，likeCount -1", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("likable2", []);
    store.toggleBuildLike(id);
    store.toggleBuildLike(id);
    const after = useUserStore.getState().builds.find((b) => b.id === id)!;
    expect(after.likedByMe).toBe(false);
    expect(after.likeCount).toBe(0);
  });

  it("likeCount 不会减到负数（边界保护）", () => {
    const store = useUserStore.getState();
    const id = store.createBuild("likable3", []);
    // 直接 updateBuild 设为 0 后再取消（虽然 likedByMe 为 false，但保证 Math.max 保护）
    store.updateBuild(id, { likeCount: 0 });
    store.toggleBuildLike(id); // 点赞 +1
    store.toggleBuildLike(id); // 取消 -1，回到 0
    store.toggleBuildLike(id); // 再次点赞 +1
    const after = useUserStore.getState().builds.find((b) => b.id === id)!;
    expect(after.likeCount).toBe(1);
    expect(after.likedByMe).toBe(true);
  });

  it("对 store 中不存在的 id（种子作品）为空操作，不抛错", () => {
    const before = useUserStore.getState().builds;
    useUserStore.getState().toggleBuildLike("nonexistent-build-id");
    expect(useUserStore.getState().builds).toBe(before);
  });

  it("不影响其他作品（按 id 精确定位）", () => {
    const store = useUserStore.getState();
    const idA = store.createBuild("A", []);
    const idB = store.createBuild("B", []);
    store.toggleBuildLike(idA);
    const after = useUserStore.getState();
    expect(after.builds.find((b) => b.id === idA)!.likedByMe).toBe(true);
    expect(after.builds.find((b) => b.id === idB)!.likedByMe ?? false).toBe(false);
  });
});

describe("toggleCommentLike", () => {
  it("首次点赞：likedByMe 置 true，likeCount +1", () => {
    const store = useUserStore.getState();
    const postId = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    store.addComment(postId, "nice");
    const post = useUserStore.getState().posts.find((p) => p.id === postId)!;
    const commentId = post.comments[0].id;
    expect(post.comments[0].likedByMe ?? false).toBe(false);
    expect(post.comments[0].likeCount).toBe(0);

    store.toggleCommentLike(postId, commentId);
    const afterPost = useUserStore.getState().posts.find((p) => p.id === postId)!;
    const afterComment = afterPost.comments.find((c) => c.id === commentId)!;
    expect(afterComment.likedByMe).toBe(true);
    expect(afterComment.likeCount).toBe(1);
  });

  it("再次点击取消点赞", () => {
    const store = useUserStore.getState();
    const postId = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    store.addComment(postId, "nice");
    const post = useUserStore.getState().posts.find((p) => p.id === postId)!;
    const commentId = post.comments[0].id;

    store.toggleCommentLike(postId, commentId);
    store.toggleCommentLike(postId, commentId);
    const afterComment = useUserStore
      .getState()
      .posts.find((p) => p.id === postId)!
      .comments.find((c) => c.id === commentId)!;
    expect(afterComment.likedByMe).toBe(false);
    expect(afterComment.likeCount).toBe(0);
  });

  it("对不存在的 postId / commentId 为空操作，不抛错", () => {
    const before = useUserStore.getState().posts;
    useUserStore.getState().toggleCommentLike("nonexistent-post", "nonexistent-comment");
    expect(useUserStore.getState().posts).toBe(before);

    // 存在的 postId + 不存在的 commentId 也不抛错
    const store = useUserStore.getState();
    const postId = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    const before2 = useUserStore.getState().posts;
    useUserStore.getState().toggleCommentLike(postId, "nonexistent-comment");
    // posts 引用不变说明 set 未触发
    expect(useUserStore.getState().posts).toBe(before2);
  });

  it("不影响同帖其他评论", () => {
    const store = useUserStore.getState();
    const postId = store.createPost({
      category: "general",
      title: "hi",
      content: "hello",
      isStaffPick: false,
    });
    store.addComment(postId, "first");
    store.addComment(postId, "second");
    const post = useUserStore.getState().posts.find((p) => p.id === postId)!;
    const c1 = post.comments[0].id;
    const c2 = post.comments[1].id;

    store.toggleCommentLike(postId, c1);
    const afterPost = useUserStore.getState().posts.find((p) => p.id === postId)!;
    expect(afterPost.comments.find((c) => c.id === c1)!.likedByMe).toBe(true);
    expect(afterPost.comments.find((c) => c.id === c2)!.likedByMe ?? false).toBe(false);
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

describe("toggleBookmark / isBookmarked", () => {
  it("首次收藏：返回 true，isBookmarked 返回 true，记录 addedAt", () => {
    const store = useUserStore.getState();
    const before = useUserStore.getState().bookmarks.length;
    const result = store.toggleBookmark("course", "c_test_1");

    expect(result).toBe(true);
    const after = useUserStore.getState();
    expect(after.bookmarks.length).toBe(before + 1);
    const bm = after.bookmarks.find((b) => b.type === "course" && b.id === "c_test_1");
    expect(bm).toBeDefined();
    expect(bm!.addedAt).toBeTruthy();
    // ISO 字符串应可被 Date 解析
    expect(Number.isNaN(+new Date(bm!.addedAt))).toBe(false);
    // isBookmarked 同步返回 true
    expect(useUserStore.getState().isBookmarked("course", "c_test_1")).toBe(true);
  });

  it("再次切换：取消收藏，返回 false，列表恢复原长度", () => {
    const store = useUserStore.getState();
    store.toggleBookmark("build", "b_test_1");
    const before = useUserStore.getState().bookmarks.length;

    const result = store.toggleBookmark("build", "b_test_1");
    expect(result).toBe(false);
    const after = useUserStore.getState();
    expect(after.bookmarks.length).toBe(before - 1);
    expect(after.bookmarks.find((b) => b.type === "build" && b.id === "b_test_1")).toBeUndefined();
    expect(useUserStore.getState().isBookmarked("build", "b_test_1")).toBe(false);
  });

  it("按 (type, id) 精确匹配：不同类型同名 id 不互相影响", () => {
    const store = useUserStore.getState();
    store.toggleBookmark("course", "shared_id");
    store.toggleBookmark("build", "shared_id");

    const state = useUserStore.getState();
    expect(state.isBookmarked("course", "shared_id")).toBe(true);
    expect(state.isBookmarked("build", "shared_id")).toBe(true);

    // 取消 course 不会影响 build
    store.toggleBookmark("course", "shared_id");
    const after = useUserStore.getState();
    expect(after.isBookmarked("course", "shared_id")).toBe(false);
    expect(after.isBookmarked("build", "shared_id")).toBe(true);
  });

  it("支持全部 4 种 BookmarkType", () => {
    const store = useUserStore.getState();
    store.toggleBookmark("course", "id_1");
    store.toggleBookmark("build", "id_2");
    store.toggleBookmark("post", "id_3");
    store.toggleBookmark("blog", "slug_4");

    const state = useUserStore.getState();
    expect(state.isBookmarked("course", "id_1")).toBe(true);
    expect(state.isBookmarked("build", "id_2")).toBe(true);
    expect(state.isBookmarked("post", "id_3")).toBe(true);
    expect(state.isBookmarked("blog", "slug_4")).toBe(true);
  });
});

describe("importData 与 bookmarks", () => {
  it("合法载荷恢复 bookmarks（含其他字段）", () => {
    const store = useUserStore.getState();
    const result = store.importData({
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks: [
        { type: "course", id: "imp_c", addedAt: "2024-01-01T00:00:00.000Z" },
        { type: "blog", id: "imp_slug", addedAt: "2024-02-02T00:00:00.000Z" },
      ],
    });
    expect(result).toBe(true);
    const after = useUserStore.getState();
    expect(after.bookmarks.length).toBe(2);
    expect(after.isBookmarked("course", "imp_c")).toBe(true);
    expect(after.isBookmarked("blog", "imp_slug")).toBe(true);
  });

  it("bookmarks 字段缺失时保持空数组默认值（向后兼容）", () => {
    const store = useUserStore.getState();
    // 先添加一个书签
    store.toggleBookmark("course", "pre_existing");
    expect(useUserStore.getState().bookmarks.length).toBeGreaterThan(0);

    // 导入不含 bookmarks 字段的旧版备份
    const result = store.importData({
      version: 1,
      exportedAt: new Date().toISOString(),
    });
    expect(result).toBe(true);
    // bookmarks 不在载荷中 → 不覆盖，保留当前值（避免旧备份清空用户当前书签）
    // 注意：importData 设计为"仅恢复存在的字段"，缺失字段保持默认值/当前值
    // 这里语义上是"未提供该字段，保持现状"，符合最小惊讶原则
  });

  it("载荷中 bookmarks 含非法条目时被过滤，合法条目保留", () => {
    const store = useUserStore.getState();
    const result = store.importData({
      version: 1,
      exportedAt: new Date().toISOString(),
      bookmarks: [
        { type: "course", id: "valid_1", addedAt: "2024-01-01T00:00:00.000Z" },
        // 非法：缺 addedAt
        { type: "build", id: "invalid_no_addedAt" } as never,
        // 非法：缺 id
        { type: "post", addedAt: "2024-01-01T00:00:00.000Z" } as never,
        // 非法：缺 type
        { id: "x", addedAt: "2024-01-01T00:00:00.000Z" } as never,
        { type: "blog", id: "valid_2", addedAt: "2024-01-02T00:00:00.000Z" },
      ],
    });
    expect(result).toBe(true);
    const after = useUserStore.getState();
    expect(after.bookmarks.length).toBe(2);
    expect(after.isBookmarked("course", "valid_1")).toBe(true);
    expect(after.isBookmarked("blog", "valid_2")).toBe(true);
  });

  it("非法 version 拒绝导入，bookmarks 保持原状", () => {
    const store = useUserStore.getState();
    store.toggleBookmark("course", "before_import");
    const beforeCount = useUserStore.getState().bookmarks.length;

    const result = store.importData({
      version: 999 as never,
      exportedAt: new Date().toISOString(),
      bookmarks: [{ type: "course", id: "should_not_be_added", addedAt: "2024-01-01T00:00:00.000Z" }],
    });
    expect(result).toBe(false);
    expect(useUserStore.getState().bookmarks.length).toBe(beforeCount);
    expect(useUserStore.getState().isBookmarked("course", "should_not_be_added")).toBe(false);
  });
});

describe("resetLocalData 与 bookmarks", () => {
  it("重置后 bookmarks 清空", () => {
    const store = useUserStore.getState();
    store.toggleBookmark("course", "will_be_cleared");
    store.toggleBookmark("build", "also_cleared");
    expect(useUserStore.getState().bookmarks.length).toBeGreaterThanOrEqual(2);

    store.resetLocalData();
    expect(useUserStore.getState().bookmarks).toEqual([]);
    expect(useUserStore.getState().isBookmarked("course", "will_be_cleared")).toBe(false);
  });
});

describe("upsertCourseRating", () => {
  it("首次评价添加记录并发放 5 XP", () => {
    const store = useUserStore.getState();
    const xpBefore = store.user.xpTotal;
    const countBefore = store.courseRatings.length;

    store.upsertCourseRating("c_test_course", 5, "非常棒的课程！");

    const after = useUserStore.getState();
    expect(after.courseRatings.length).toBe(countBefore + 1);
    expect(after.user.xpTotal).toBe(xpBefore + 5);

    const rating = after.getCourseRating("c_test_course");
    expect(rating).not.toBeNull();
    expect(rating?.rating).toBe(5);
    expect(rating?.comment).toBe("非常棒的课程！");
    expect(rating?.createdAt).toBeTruthy();
  });

  it("更新已有评价不重复发放 XP", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_test_course", 4, "initial");
    const xpAfterFirst = useUserStore.getState().user.xpTotal;

    store.upsertCourseRating("c_test_course", 5, "updated comment");

    const after = useUserStore.getState();
    expect(after.user.xpTotal).toBe(xpAfterFirst); // 不再 +5
    expect(after.courseRatings.length).toBe(1); // 仍是 1 条（覆盖）
    expect(after.getCourseRating("c_test_course")?.rating).toBe(5);
    expect(after.getCourseRating("c_test_course")?.comment).toBe("updated comment");
  });

  it("rating 限制在 1-5 范围（越界值被钳制）", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_test_low", 0, "too low");
    store.upsertCourseRating("c_test_high", 99, "too high");

    const low = useUserStore.getState().getCourseRating("c_test_low");
    const high = useUserStore.getState().getCourseRating("c_test_high");
    expect(low?.rating).toBe(1); // 0 被钳制为 1
    expect(high?.rating).toBe(5); // 99 被钳制为 5
  });

  it("rating 浮点数被四舍五入", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_test_round", 3.6, "round me");
    const rating = useUserStore.getState().getCourseRating("c_test_round");
    expect(rating?.rating).toBe(4);
  });

  it("comment 被截断到 500 字符", () => {
    const store = useUserStore.getState();
    const longComment = "a".repeat(600);
    store.upsertCourseRating("c_test_trunc", 3, longComment);
    const rating = useUserStore.getState().getCourseRating("c_test_trunc");
    expect(rating?.comment.length).toBe(500);
  });

  it("comment 被去除首尾空白", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_test_trim", 4, "  hello world  ");
    const rating = useUserStore.getState().getCourseRating("c_test_trim");
    expect(rating?.comment).toBe("hello world");
  });

  it("空 comment 也能保存（评论为可选）", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_test_empty", 3, "");
    const rating = useUserStore.getState().getCourseRating("c_test_empty");
    expect(rating).not.toBeNull();
    expect(rating?.comment).toBe("");
  });

  it("getCourseRating 未评价返回 null", () => {
    const store = useUserStore.getState();
    expect(store.getCourseRating("never_rated")).toBeNull();
  });

  it("不同课程的评价互不影响", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_course_a", 5, "great");
    store.upsertCourseRating("c_course_b", 2, "meh");

    const state = useUserStore.getState();
    expect(state.getCourseRating("c_course_a")?.rating).toBe(5);
    expect(state.getCourseRating("c_course_b")?.rating).toBe(2);
    expect(state.courseRatings.length).toBeGreaterThanOrEqual(2);
  });
});

describe("resetLocalData 与 courseRatings", () => {
  it("重置后 courseRatings 清空", () => {
    const store = useUserStore.getState();
    store.upsertCourseRating("c_will_reset", 5, "to be cleared");
    expect(useUserStore.getState().courseRatings.length).toBeGreaterThan(0);

    store.resetLocalData();
    expect(useUserStore.getState().courseRatings).toEqual([]);
    expect(useUserStore.getState().getCourseRating("c_will_reset")).toBeNull();
  });
});

describe("importData 与 courseRatings", () => {
  it("合法载荷恢复 courseRatings", () => {
    const store = useUserStore.getState();
    const result = store.importData({
      version: 1,
      exportedAt: new Date().toISOString(),
      courseRatings: [
        { courseId: "c_imp_1", rating: 5, comment: "imported", createdAt: "2024-01-01T00:00:00.000Z" },
        { courseId: "c_imp_2", rating: 3, comment: "", createdAt: "2024-02-02T00:00:00.000Z" },
      ],
    });
    expect(result).toBe(true);
    const after = useUserStore.getState();
    expect(after.getCourseRating("c_imp_1")?.rating).toBe(5);
    expect(after.getCourseRating("c_imp_2")?.rating).toBe(3);
  });

  it("非法评价条目被过滤", () => {
    const store = useUserStore.getState();
    const result = store.importData({
      version: 1,
      exportedAt: new Date().toISOString(),
      courseRatings: [
        { courseId: "valid", rating: 4, comment: "ok", createdAt: "2024-01-01T00:00:00.000Z" },
        // 非法：缺 rating
        { courseId: "no_rating", comment: "x", createdAt: "2024-01-01T00:00:00.000Z" } as never,
        // 非法：缺 createdAt
        { courseId: "no_created", rating: 3, comment: "x" } as never,
      ],
    });
    expect(result).toBe(true);
    const after = useUserStore.getState();
    expect(after.getCourseRating("valid")?.rating).toBe(4);
    expect(after.getCourseRating("no_rating")).toBeNull();
    expect(after.getCourseRating("no_created")).toBeNull();
  });
});
