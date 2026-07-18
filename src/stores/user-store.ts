"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Build, CommunityPost, ProgressState, BookmarkItem, BookmarkType, CourseRating } from "@/types";
import { courses } from "@/data/courses";
import { builds as seedBuilds } from "@/data/builds";
import { communityPosts as seedPosts } from "@/data/posts";
import { genId, levelFromXp } from "@/lib/utils";
import { useNotificationStore } from "@/stores/notification-store";
import { computeBadgeStates } from "@/lib/badges";

interface UserStoreState {
  user: User;
  progress: ProgressState;
  earnedBadgeIds: string[];
  builds: Build[];
  posts: CommunityPost[];
  /**
   * 学习活动日志：key 为本地日期 (YYYY-MM-DD)，value 为当天完成的练习数。
   * 仅在 completeExercise 首次完成时 +1，避免重复完成刷数据。
   * 用于 Dashboard 的学习日历热力图，可视化学习历史。
   */
  activityLog: Record<string, number>;
  /**
   * 用户书签列表：跨课程/作品/帖子/博客的统一收藏。
   * 使用数组而非 Set 以便 persist 序列化；查询时用 some/finding 即可（数据量小）。
   */
  bookmarks: BookmarkItem[];
  /**
   * 课程评价列表：用户对课程的评分与评论。
   * 每门课程仅保留一条记录（upsert），用 find 查询（数据量小）。
   */
  courseRatings: CourseRating[];

  // progress
  ensureCourseInit: (courseSlug: string) => void;
  /** 批量初始化所有课程的进度状态，单次 set 完成，避免多次触发订阅与持久化 */
  ensureAllCoursesInit: () => void;
  setExerciseStatus: (exerciseId: string, status: ProgressState["statuses"][string]) => void;
  saveCodeSnapshot: (exerciseId: string, code: string) => void;
  /** 完成练习，返回本次新解锁的徽章 id 列表（用于 UI 庆祝反馈） */
  completeExercise: (exerciseId: string, xp: number) => string[];

  // builds
  createBuild: (title: string, files: Build["files"]) => string;
  updateBuild: (id: string, patch: Partial<Build>) => void;
  publishBuild: (id: string, description: string) => void;
  forkBuild: (id: string) => string | null;
  /** 浏览量 +1。仅对存在于本地 store 的作品生效（种子作品为静态数据，不持久化） */
  incrementBuildView: (id: string) => void;
  /** 切换作品点赞状态。仅对存在于本地 store 的作品生效；
   *  种子作品为静态数据，点赞不持久化，但 UI 仍可即时反馈 */
  toggleBuildLike: (id: string) => void;

  // community
  createPost: (post: Omit<CommunityPost, "id" | "createdAt" | "likeCount" | "commentCount" | "comments" | "userId" | "authorName" | "authorAvatar" | "authorLevel">) => string;
  togglePostLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;
  /** 切换评论点赞状态。仅对存在于本地 store 的评论生效 */
  toggleCommentLike: (postId: string, commentId: string) => void;

  // bookmarks
  /** 切换某资源的书签状态（已收藏则取消，未收藏则添加）。返回操作后的最终状态（true=已收藏） */
  toggleBookmark: (type: BookmarkType, id: string) => boolean;
  /** 查询某资源是否已收藏。提供 selector 友好的纯查询方法 */
  isBookmarked: (type: BookmarkType, id: string) => boolean;

  // course ratings
  /**
   * 提交或更新课程评价（upsert）。
   * - 同一 courseId 再次提交将覆盖旧评价（rating/comment/createdAt 全部更新）
   * - 首次评价发放 5 XP 奖励（鼓励评价），后续更新不重复发放
   * - rating 限制在 1-5 范围，comment 长度限制 500 字符
   */
  upsertCourseRating: (courseId: string, rating: number, comment: string) => void;
  /** 查询当前用户对某课程的评，未评价返回 null */
  getCourseRating: (courseId: string) => CourseRating | null;

  // profile
  updateUser: (patch: Partial<User>) => void;

  // badges
  awardBadge: (badgeId: string) => void;

  // data
  resetLocalData: () => void;
  /**
   * 从外部数据载荷恢复本地状态（导入备份）。
   * 仅恢复结构化字段，缺失字段回退到默认值，避免单字段缺失导致整个状态损坏。
   * 返回是否成功；失败时调用方应给出错误反馈。
   */
  importData: (payload: ExportedData) => boolean;
}

/**
 * 可导出/导入的数据载荷结构。
 * 与 store 的 partialize 字段保持一致，便于版本演进时向后兼容。
 */
export interface ExportedData {
  version: 1;
  exportedAt: string;
  user?: User;
  progress?: ProgressState;
  earnedBadgeIds?: string[];
  builds?: Build[];
  posts?: CommunityPost[];
  activityLog?: Record<string, number>;
  bookmarks?: BookmarkItem[];
  courseRatings?: CourseRating[];
}

const DEFAULT_USER: User = {
  id: "u_local",
  username: "玩家",
  avatarGradient: "linear-gradient(135deg, #7C5CFC, #FF6B9D)",
  bio: "正在编程世界中冒险的学习者。⚔️",
  xpTotal: 0,
  level: 1,
  streakDays: 0,
  lastActiveDate: new Date().toISOString(),
  createdAt: new Date().toISOString(),
  countryFlag: "🏳️",
  role: "member",
};

function awardXp(user: User, amount: number): User {
  const xpTotal = user.xpTotal + amount;
  const { level } = levelFromXp(xpTotal);
  return { ...user, xpTotal, level: Math.max(user.level, level) };
}

/** 本地日期键（YYYY-MM-DD），避免时区与格式不一致问题 */
function dayKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * 计算新的连续学习天数：
 * - 今天已记录过 → 保持不变
 * - 昨天有记录 → +1
 * - 否则 → 重置为 1
 *
 * 使用日期字符串比较而非毫秒减法，避免 DST（夏令时）切换时
 * 86400000ms 不是真正"昨天"的问题。
 */
function computeStreak(prevStreak: number, lastActiveIso: string, now: Date): number {
  const today = dayKey(now);
  const lastDay = dayKey(new Date(lastActiveIso));
  if (lastDay === today) return prevStreak; // 今天已记录
  // 通过日期构造计算昨天，正确处理 DST 与跨月/跨年
  const yesterdayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
  const yesterday = dayKey(yesterdayDate);
  return lastDay === yesterday ? prevStreak + 1 : 1;
}

/**
 * 预计算每个练习的"下一个练习 id"映射表，模块加载时一次性构建 O(n)。
 * 避免每次 completeExercise 都遍历所有课程 O(n²)。
 * 仅在同一课程内链接，不跨课程解锁。
 */
const nextExerciseMap: Record<string, string> = (() => {
  const map: Record<string, string> = {};
  for (const course of courses) {
    for (let chIdx = 0; chIdx < course.chapters.length; chIdx++) {
      const ch = course.chapters[chIdx];
      for (let i = 0; i < ch.exercises.length; i++) {
        const ex = ch.exercises[i];
        if (i + 1 < ch.exercises.length) {
          // 同章节下一个练习
          map[ex.id] = ch.exercises[i + 1].id;
        } else if (chIdx + 1 < course.chapters.length) {
          // 下一章节第一个练习
          const nextCh = course.chapters[chIdx + 1];
          if (nextCh.exercises[0]) map[ex.id] = nextCh.exercises[0].id;
        }
      }
    }
  }
  return map;
})();

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: DEFAULT_USER,
      progress: { statuses: {}, codeSnapshots: {} },
      earnedBadgeIds: [],
      builds: seedBuilds,
      posts: seedPosts,
      activityLog: {},
      bookmarks: [],
      courseRatings: [],

      ensureCourseInit: (courseSlug) => {
        const course = courses.find((c) => c.slug === courseSlug);
        if (!course) return;
        const { progress } = get();
        const newStatuses = { ...progress.statuses };
        let changed = false;
        let firstExerciseId: string | null = null;
        for (const ch of course.chapters) {
          for (const ex of ch.exercises) {
            if (firstExerciseId === null) firstExerciseId = ex.id;
            if (newStatuses[ex.id] === undefined) {
              newStatuses[ex.id] = ex.id === firstExerciseId ? "unlocked" : "locked";
              changed = true;
            }
          }
        }
        if (changed) {
          set({ progress: { ...progress, statuses: newStatuses } });
        }
      },

      ensureAllCoursesInit: () => {
        const { progress } = get();
        const newStatuses = { ...progress.statuses };
        let changed = false;
        for (const course of courses) {
          let firstExerciseId: string | null = null;
          for (const ch of course.chapters) {
            for (const ex of ch.exercises) {
              if (firstExerciseId === null) firstExerciseId = ex.id;
              if (newStatuses[ex.id] === undefined) {
                newStatuses[ex.id] = ex.id === firstExerciseId ? "unlocked" : "locked";
                changed = true;
              }
            }
          }
        }
        if (changed) {
          set({ progress: { ...progress, statuses: newStatuses } });
        }
      },

      setExerciseStatus: (exerciseId, status) => {
        const { progress } = get();
        // 状态未变化时提前返回，避免每次按键都创建新 progress 对象触发无谓的重渲染与持久化
        if (progress.statuses[exerciseId] === status) return;
        set({
          progress: { ...progress, statuses: { ...progress.statuses, [exerciseId]: status } },
        });
      },

      saveCodeSnapshot: (exerciseId, code) => {
        const { progress } = get();
        set({
          progress: { ...progress, codeSnapshots: { ...progress.codeSnapshots, [exerciseId]: code } },
        });
      },

      completeExercise: (exerciseId, xp) => {
        const state = get();
        const prevStatus = state.progress.statuses[exerciseId];
        // unlock next（O(1) 查表，替代原来遍历所有课程 O(n²)）
        const newStatuses = { ...state.progress.statuses, [exerciseId]: "completed" as const };
        const nextId = nextExerciseMap[exerciseId];
        if (nextId && newStatuses[nextId] !== "completed") {
          newStatuses[nextId] = "unlocked";
        }
        const onlyAwardIfFirst = prevStatus !== "completed";
        const now = new Date();
        const updatedUser = onlyAwardIfFirst ? awardXp(state.user, xp) : state.user;
        // 单次 set 合并 XP、streak、lastActiveDate，避免多次 set 互相覆盖
        const newStreak = computeStreak(state.user.streakDays, state.user.lastActiveDate, now);
        const nextUser = {
          ...updatedUser,
          lastActiveDate: now.toISOString(),
          streakDays: newStreak,
        };
        const nextProgress = { ...state.progress, statuses: newStatuses };

        // 计算本次完成新解锁的徽章（与已记录的 earnedBadgeIds 取差集）
        const prevEarned = new Set(state.earnedBadgeIds);
        const nextBadges = computeBadgeStates({
          user: nextUser,
          progress: nextProgress,
          builds: state.builds,
          posts: state.posts,
        });
        const newlyEarned = nextBadges
          .filter((b) => b.earned && !prevEarned.has(b.id))
          .map((b) => b.id);
        const mergedEarned =
          newlyEarned.length > 0
            ? Array.from(new Set([...state.earnedBadgeIds, ...newlyEarned]))
            : state.earnedBadgeIds;

        // 仅首次完成才计入活动日志，避免重复完成刷数据
        // 复用 dayKey 保持日期键格式一致，避免时区错位
        const nextActivityLog = onlyAwardIfFirst
          ? (() => {
              const key = dayKey(now);
              return { ...state.activityLog, [key]: (state.activityLog[key] ?? 0) + 1 };
            })()
          : state.activityLog;

        set({
          user: nextUser,
          progress: nextProgress,
          earnedBadgeIds: mergedEarned,
          activityLog: nextActivityLog,
        });

        // 触发通知：新徽章
        if (newlyEarned.length > 0) {
          const notifStore = useNotificationStore.getState();
          // 动态导入 badges 数据以获取徽章名称
          import("@/data/badges").then(({ badges }) => {
            for (const badgeId of newlyEarned) {
              const badge = badges.find((b) => b.id === badgeId);
              if (badge) {
                notifStore.addNotification({
                  type: "badge",
                  title: `获得新徽章：${badge.emoji} ${badge.name}`,
                  message: badge.description,
                  link: "/dashboard#all-badges",
                });
              }
            }
          });
        }

        // 触发通知：连续学习里程碑
        const streakMilestones = [7, 10, 14, 21, 30, 50, 100];
        if (streakMilestones.includes(newStreak) && newStreak !== state.user.streakDays) {
          const notifStore = useNotificationStore.getState();
          notifStore.addNotification({
            type: "streak",
            title: `🔥 连续学习 ${newStreak} 天！`,
            message: `你已连续 ${newStreak} 天保持学习，太棒了！继续保持这个势头。`,
            link: "/dashboard",
          });
        }

        return newlyEarned;
      },

      createBuild: (title, files) => {
        const state = get();
        const id = genId("b");
        const authorName = state.user.username;
        const authorAvatar = state.user.avatarGradient;
        const build: Build = {
          id,
          userId: state.user.id,
          authorName,
          authorAvatar,
          title,
          description: "",
          files,
          isPublished: false,
          thumbnailGradient: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
          viewCount: 0,
          likeCount: 0,
          createdAt: new Date().toISOString(),
        };
        // 创建草稿不发放 XP，避免反复创建模板刷 XP；XP 改在首次发布时发放
        set({ builds: [build, ...state.builds] });
        return id;
      },

      updateBuild: (id, patch) => {
        const state = get();
        set({
          builds: state.builds.map((b) => (b.id === id ? { ...b, ...patch } : b)),
        });
      },

      publishBuild: (id, description) => {
        const state = get();
        const target = state.builds.find((b) => b.id === id);
        // 仅首次发布（isPublished 由 false 变 true）时发放 XP，避免重复发布刷 XP
        const firstPublish = target ? !target.isPublished : false;
        set({
          builds: state.builds.map((b) =>
            b.id === id ? { ...b, isPublished: true, description: description || b.description } : b,
          ),
          user: firstPublish ? awardXp(state.user, 30) : state.user,
        });
      },

      forkBuild: (id) => {
        const state = get();
        const original = state.builds.find((b) => b.id === id);
        if (!original) return null;
        const newId = genId("b");
        const forked: Build = {
          ...original,
          id: newId,
          userId: state.user.id,
          authorName: state.user.username,
          authorAvatar: state.user.avatarGradient,
          title: `${original.title} (Fork)`,
          isPublished: false,
          viewCount: 0,
          likeCount: 0,
          createdAt: new Date().toISOString(),
          forkedFrom: original.id,
        };
        set({ builds: [forked, ...state.builds] });
        return newId;
      },

      incrementBuildView: (id) => {
        const state = get();
        // 仅当作品存在于本地 store 且属于当前用户（用户创建/fork 的作品）时才自增浏览量；
        // 种子作品（其他用户的静态数据）不持久化自增，避免污染展示数据。
        // 通过 userId 区分：用户创建/fork 的作品 userId === state.user.id，
        // 种子作品 userId 是其他作者（如 u_sarah）。
        const target = state.builds.find((b) => b.id === id);
        if (!target || target.userId !== state.user.id) return;
        set({
          builds: state.builds.map((b) =>
            b.id === id ? { ...b, viewCount: b.viewCount + 1 } : b,
          ),
        });
      },

      toggleBuildLike: (id) => {
        const state = get();
        // 与 incrementBuildView 不同：点赞对所有本地 store 中的作品都生效
        // （包括用户从 fork 来源派生的作品，以及用户自己创建的）。
        // 种子作品的点赞不会持久化（不在 store 中），UI 层负责即时反馈。
        const target = state.builds.find((b) => b.id === id);
        if (!target) return;
        set({
          builds: state.builds.map((b) => {
            if (b.id !== id) return b;
            const liked = !b.likedByMe;
            return {
              ...b,
              likedByMe: liked,
              likeCount: Math.max(0, b.likeCount + (liked ? 1 : -1)),
            };
          }),
        });
      },

      createPost: (post) => {
        const state = get();
        const id = genId("p");
        const newPost: CommunityPost = {
          ...post,
          id,
          userId: state.user.id,
          authorName: state.user.username,
          authorAvatar: state.user.avatarGradient,
          authorLevel: state.user.level,
          likeCount: 0,
          commentCount: 0,
          comments: [],
          createdAt: new Date().toISOString(),
        };
        set({ posts: [newPost, ...state.posts], user: awardXp(state.user, 10) });
        return id;
      },

      togglePostLike: (postId) => {
        const state = get();
        set({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            const liked = !p.likedByMe;
            return {
              ...p,
              likedByMe: liked,
              likeCount: Math.max(0, p.likeCount + (liked ? 1 : -1)),
            };
          }),
        });
      },

      addComment: (postId, content) => {
        const state = get();
        set({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              commentCount: p.commentCount + 1,
              comments: [
                ...p.comments,
                {
                  id: genId("c"),
                  userId: state.user.id,
                  authorName: state.user.username,
                  authorAvatar: state.user.avatarGradient,
                  content,
                  likeCount: 0,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }),
          user: awardXp(state.user, 5),
        });
      },

      toggleCommentLike: (postId, commentId) => {
        const state = get();
        // 仅对存在于本地 store 的帖子中的评论生效；种子帖子的评论点赞不持久化
        const post = state.posts.find((p) => p.id === postId);
        if (!post) return;
        const comment = post.comments.find((c) => c.id === commentId);
        // 评论不存在时提前返回，避免无意义的 set（导致 posts 引用变更、触发订阅与持久化）
        if (!comment) return;
        set({
          posts: state.posts.map((p) => {
            if (p.id !== postId) return p;
            return {
              ...p,
              comments: p.comments.map((c) => {
                if (c.id !== commentId) return c;
                const liked = !c.likedByMe;
                return {
                  ...c,
                  likedByMe: liked,
                  likeCount: Math.max(0, c.likeCount + (liked ? 1 : -1)),
                };
              }),
            };
          }),
        });
      },

      toggleBookmark: (type, id) => {
        const state = get();
        const existingIdx = state.bookmarks.findIndex(
          (b) => b.type === type && b.id === id,
        );
        if (existingIdx >= 0) {
          // 已收藏 → 取消
          set({
            bookmarks: state.bookmarks.filter((b) => !(b.type === type && b.id === id)),
          });
          return false;
        }
        // 未收藏 → 添加
        set({
          bookmarks: [
            ...state.bookmarks,
            { type, id, addedAt: new Date().toISOString() },
          ],
        });
        return true;
      },

      isBookmarked: (type, id) => {
        return get().bookmarks.some((b) => b.type === type && b.id === id);
      },

      upsertCourseRating: (courseId, rating, comment) => {
        const state = get();
        // 输入规范化：rating 限制 1-5，comment 截断 500 字符并 trim
        const normalizedRating = Math.max(1, Math.min(5, Math.round(rating)));
        const normalizedComment = (comment ?? "").trim().slice(0, 500);
        const existing = state.courseRatings.find((r) => r.courseId === courseId);
        const isFirstRating = !existing;
        const now = new Date().toISOString();
        const newRating: CourseRating = {
          courseId,
          rating: normalizedRating,
          comment: normalizedComment,
          createdAt: now,
        };
        set({
          courseRatings: existing
            ? state.courseRatings.map((r) => (r.courseId === courseId ? newRating : r))
            : [...state.courseRatings, newRating],
          // 仅首次评价发放 XP，避免反复更新刷 XP
          user: isFirstRating ? awardXp(state.user, 5) : state.user,
        });
      },

      getCourseRating: (courseId) => {
        return get().courseRatings.find((r) => r.courseId === courseId) ?? null;
      },

      updateUser: (patch) => {
        const state = get();
        set({ user: { ...state.user, ...patch } });
      },

      awardBadge: (badgeId) => {
        const state = get();
        if (state.earnedBadgeIds.includes(badgeId)) return;
        set({ earnedBadgeIds: [...state.earnedBadgeIds, badgeId] });
      },

      resetLocalData: () => {
        set({
          user: { ...DEFAULT_USER, createdAt: new Date().toISOString(), lastActiveDate: new Date().toISOString() },
          progress: { statuses: {}, codeSnapshots: {} },
          earnedBadgeIds: [],
          builds: seedBuilds,
          posts: seedPosts,
          activityLog: {},
          bookmarks: [],
          courseRatings: [],
        });
      },

      importData: (payload) => {
        // 基础校验：必须包含 version 字段且为预期版本
        // 避免错误格式的 JSON 损坏本地状态
        if (!payload || typeof payload !== "object" || payload.version !== 1) {
          return false;
        }
        try {
          // 仅恢复存在的字段，缺失字段保持默认值，保证向后兼容
          const next: Partial<UserStoreState> = {};
          if (payload.user && typeof payload.user === "object") {
            next.user = { ...DEFAULT_USER, ...payload.user };
          }
          if (payload.progress && typeof payload.progress === "object") {
            next.progress = {
              statuses: payload.progress.statuses ?? {},
              codeSnapshots: payload.progress.codeSnapshots ?? {},
            };
          }
          if (Array.isArray(payload.earnedBadgeIds)) {
            next.earnedBadgeIds = payload.earnedBadgeIds;
          }
          if (Array.isArray(payload.builds)) {
            next.builds = payload.builds;
          }
          if (Array.isArray(payload.posts)) {
            next.posts = payload.posts;
          }
          if (payload.activityLog && typeof payload.activityLog === "object") {
            next.activityLog = payload.activityLog;
          }
          if (Array.isArray(payload.bookmarks)) {
            // 过滤掉结构不合法的条目，避免污染 store
            next.bookmarks = payload.bookmarks.filter(
              (b) => b && typeof b.id === "string" && typeof b.type === "string" && typeof b.addedAt === "string",
            );
          }
          if (Array.isArray(payload.courseRatings)) {
            // 过滤掉结构不合法的评价条目
            next.courseRatings = payload.courseRatings.filter(
              (r) => r && typeof r.courseId === "string" && typeof r.rating === "number" && typeof r.createdAt === "string",
            );
          }
          set(next);
          return true;
        } catch {
          // 任何异常都不破坏现有状态
          return false;
        }
      },
    }),
    {
      name: "codegame-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        progress: s.progress,
        earnedBadgeIds: s.earnedBadgeIds,
        builds: s.builds,
        posts: s.posts,
        activityLog: s.activityLog,
        bookmarks: s.bookmarks,
        courseRatings: s.courseRatings,
      }),
    },
  ),
);
