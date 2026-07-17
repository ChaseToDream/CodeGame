"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Build, CommunityPost, ProgressState } from "@/types";
import { courses } from "@/data/courses";
import { builds as seedBuilds } from "@/data/builds";
import { communityPosts as seedPosts } from "@/data/posts";
import { genId, levelFromXp } from "@/lib/utils";
import { computeBadgeStates } from "@/lib/badges";

interface UserStoreState {
  user: User;
  progress: ProgressState;
  earnedBadgeIds: string[];
  builds: Build[];
  posts: CommunityPost[];

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

  // community
  createPost: (post: Omit<CommunityPost, "id" | "createdAt" | "likeCount" | "commentCount" | "comments" | "userId" | "authorName" | "authorAvatar" | "authorLevel">) => string;
  togglePostLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;

  // profile
  updateUser: (patch: Partial<User>) => void;

  // badges
  awardBadge: (badgeId: string) => void;

  // data
  resetLocalData: () => void;
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
 */
function computeStreak(prevStreak: number, lastActiveIso: string, now: Date): number {
  const today = dayKey(now);
  const lastDay = dayKey(new Date(lastActiveIso));
  if (lastDay === today) return prevStreak; // 今天已记录
  const yesterday = dayKey(new Date(now.getTime() - 86400000));
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

        set({
          user: nextUser,
          progress: nextProgress,
          earnedBadgeIds: mergedEarned,
        });
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
        // 仅当作品存在于本地 store 时才自增浏览量；
        // 种子作品（仅 seedBuilds）为静态数据，不持久化自增，避免污染展示数据
        if (!state.builds.some((b) => b.id === id)) return;
        set({
          builds: state.builds.map((b) =>
            b.id === id ? { ...b, viewCount: b.viewCount + 1 } : b,
          ),
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
        });
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
      }),
    },
  ),
);
