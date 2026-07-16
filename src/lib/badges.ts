import type { Badge, Build, CommunityPost, ProgressState, User } from "@/types";
import { badges as allBadges } from "@/data/badges";
import { courses } from "@/data/courses";

export type BadgeWithEarned = Badge & { earned: boolean; earnedAt?: string };

/**
 * 计算所有徽章的获得状态。
 * 集中维护以避免 dashboard / 用户资料页逻辑漂移。
 *
 * 业务规则：
 * - bdg_first_steps：完成任意 1 个练习
 * - bdg_python_complete：完成 Python 课程所有练习
 * - bdg_streak_7 / 30 / 100：连续学习天数达标
 * - bdg_first_build：已发布至少 1 个作品
 * - bdg_first_post：发表至少 1 条社区帖子
 * - bdg_helpful：用户作为作者的所有帖子累计点赞 ≥ 100
 * - bdg_staff_pick：用户任意作品/帖子被选为编辑精选（isStaffPick）
 * - bdg_chapter_master：在任意课程中完成 ≥ 5 个章节
 * - bdg_challenge_pack：完成任意 1 个 type=challenge_pack 的练习
 * - bdg_level_10：等级 ≥ 10
 */
export function computeBadgeStates(params: {
  user: User;
  progress: ProgressState;
  builds: Build[];
  posts: CommunityPost[];
}): BadgeWithEarned[] {
  const { user, progress, builds, posts } = params;

  // 预计算常用聚合值
  const completedStatuses = Object.values(progress.statuses).filter((s) => s === "completed");

  // Python 课程完成度
  const pythonCourse = courses.find((c) => c.slug === "python");
  const pythonCompleted =
    pythonCourse && pythonCourse.chapters.length > 0
      ? pythonCourse.chapters
          .flatMap((ch) => ch.exercises)
          .every((ex) => progress.statuses[ex.id] === "completed")
      : false;

  // 章节大师：完成 ≥ 5 个章节（章节内所有练习均 completed）
  const completedChapters = courses.reduce((acc, course) => {
    return (
      acc +
      course.chapters.filter((ch) =>
        ch.exercises.length > 0
          ? ch.exercises.every((ex) => progress.statuses[ex.id] === "completed")
          : false,
      ).length
    );
  }, 0);

  // 挑战包：完成任意 type=challenge_pack 的练习
  const challengePackCompleted = courses.some((course) =>
    course.chapters.some((ch) =>
      ch.exercises.some(
        (ex) =>
          ex.type === "challenge_pack" && progress.statuses[ex.id] === "completed",
      ),
    ),
  );

  // 用户作为作者的帖子累计点赞
  const userPostLikes = posts
    .filter((p) => p.userId === user.id)
    .reduce((acc, p) => acc + p.likeCount, 0);

  // 编辑精选：用户发布的任意帖子或作品被标为 staff pick
  // 帖子有 isStaffPick 字段；作品暂无该字段，按帖子判定
  const hasStaffPick = posts.some((p) => p.userId === user.id && p.isStaffPick);

  // 已发布作品
  const publishedBuilds = builds.filter((b) => b.userId === user.id && b.isPublished);

  const earnedMap: Record<string, boolean> = {
    bdg_first_steps: completedStatuses.length > 0,
    bdg_python_complete: pythonCompleted,
    bdg_streak_7: user.streakDays >= 7,
    bdg_streak_30: user.streakDays >= 30,
    bdg_streak_100: user.streakDays >= 100,
    bdg_first_build: publishedBuilds.length > 0,
    bdg_first_post: posts.filter((p) => p.userId === user.id).length > 0,
    bdg_helpful: userPostLikes >= 100,
    bdg_staff_pick: hasStaffPick,
    bdg_chapter_master: completedChapters >= 5,
    bdg_challenge_pack: challengePackCompleted,
    bdg_level_10: user.level >= 10,
  };

  return allBadges.map((b) => ({
    ...b,
    earned: !!earnedMap[b.id],
  }));
}

/** 仅返回已获得的徽章 */
export function earnedBadgesOnly(params: {
  user: User;
  progress: ProgressState;
  builds: Build[];
  posts: CommunityPost[];
}): BadgeWithEarned[] {
  return computeBadgeStates(params).filter((b) => b.earned);
}
