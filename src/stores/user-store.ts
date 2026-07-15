"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User, Build, CommunityPost, ProgressState } from "@/types";
import { courses } from "@/data/courses";
import { builds as seedBuilds } from "@/data/builds";
import { communityPosts as seedPosts } from "@/data/posts";
import { genId, levelFromXp } from "@/lib/utils";

interface UserStoreState {
  user: User | null;
  isAuthed: boolean;
  progress: ProgressState;
  earnedBadgeIds: string[];
  builds: Build[];
  posts: CommunityPost[];

  // auth
  signup: (email: string, username: string, password: string) => User;
  login: (email: string) => User | null;
  logout: () => void;

  // progress
  ensureCourseInit: (courseSlug: string) => void;
  setExerciseStatus: (exerciseId: string, status: ProgressState["statuses"][string]) => void;
  saveCodeSnapshot: (exerciseId: string, code: string) => void;
  completeExercise: (exerciseId: string, xp: number) => void;

  // builds
  createBuild: (title: string, files: Build["files"]) => string;
  updateBuild: (id: string, patch: Partial<Build>) => void;
  publishBuild: (id: string, description: string) => void;
  forkBuild: (id: string) => string | null;

  // community
  createPost: (post: Omit<CommunityPost, "id" | "createdAt" | "likeCount" | "commentCount" | "comments" | "userId" | "authorName" | "authorAvatar" | "authorLevel">) => string;
  togglePostLike: (postId: string) => void;
  addComment: (postId: string, content: string) => void;

  // profile
  updateUser: (patch: Partial<User>) => void;

  // badges
  awardBadge: (badgeId: string) => void;
}

const DEFAULT_USER: Omit<User, "email" | "username"> = {
  id: "u_local",
  avatarGradient: "linear-gradient(135deg, #7C5CFC, #FF6B9D)",
  bio: "Just a learner on a quest to level up. ⚔️",
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

export const useUserStore = create<UserStoreState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthed: false,
      progress: { statuses: {}, codeSnapshots: {} },
      earnedBadgeIds: [],
      builds: seedBuilds,
      posts: seedPosts,

      signup: (email, username, _password) => {
        const user: User = { ...DEFAULT_USER, id: genId("u"), email, username };
        set({ user, isAuthed: true });
        // auto-award first-steps-ready: ensure first exercise unlocked later
        return user;
      },

      login: (email) => {
        // mock: any email logs in
        const existing = get().user;
        if (existing && existing.email === email) {
          set({ isAuthed: true });
          return existing;
        }
        const username = email.split("@")[0] || "learner";
        const user: User = { ...DEFAULT_USER, id: genId("u"), email, username };
        set({ user, isAuthed: true });
        return user;
      },

      logout: () => set({ isAuthed: false, user: null }),

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
        if (!state.user) return;
        const prevStatus = state.progress.statuses[exerciseId];
        // unlock next
        const newStatuses = { ...state.progress.statuses, [exerciseId]: "completed" as const };
        // find next exercise across all courses
        for (const course of courses) {
          for (const ch of course.chapters) {
            const idx = ch.exercises.findIndex((e) => e.id === exerciseId);
            if (idx === -1) continue;
            if (idx + 1 < ch.exercises.length) {
              const nextId = ch.exercises[idx + 1].id;
              if (newStatuses[nextId] !== "completed") newStatuses[nextId] = "unlocked";
            } else {
              // next chapter's first exercise
              const chIdx = course.chapters.findIndex((c) => c.id === ch.id);
              if (chIdx + 1 < course.chapters.length) {
                const nextEx = course.chapters[chIdx + 1].exercises[0];
                if (nextEx && newStatuses[nextEx.id] !== "completed") newStatuses[nextEx.id] = "unlocked";
              }
            }
          }
        }
        const onlyAwardIfFirst = prevStatus !== "completed";
        const updatedUser = onlyAwardIfFirst ? awardXp(state.user, xp) : state.user;
        set({
          user: { ...updatedUser, lastActiveDate: new Date().toISOString() },
          progress: { ...state.progress, statuses: newStatuses },
        });
        // auto-award streak bump
        const today = new Date().toDateString();
        if (state.user.lastActiveDate !== today) {
          // simple streak: if last active was yesterday, +1, else reset to 1
          const last = new Date(state.user.lastActiveDate);
          const diffDays = Math.floor((Date.now() - last.getTime()) / 86400000);
          const newStreak = diffDays === 1 ? state.user.streakDays + 1 : 1;
          set({ user: { ...get().user!, streakDays: newStreak } });
        }
      },

      createBuild: (title, files) => {
        const state = get();
        const id = genId("b");
        const authorName = state.user?.username ?? "anon";
        const authorAvatar = state.user?.avatarGradient ?? DEFAULT_USER.avatarGradient;
        const build: Build = {
          id,
          userId: state.user?.id ?? "u_anon",
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
        set({ builds: [build, ...state.builds] });
        if (state.user) {
          set({ user: awardXp(state.user, 30) });
        }
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
        set({
          builds: state.builds.map((b) =>
            b.id === id ? { ...b, isPublished: true, description: description || b.description } : b,
          ),
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
          userId: state.user?.id ?? "u_anon",
          authorName: state.user?.username ?? "anon",
          authorAvatar: state.user?.avatarGradient ?? DEFAULT_USER.avatarGradient,
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

      createPost: (post) => {
        const state = get();
        const id = genId("p");
        const newPost: CommunityPost = {
          ...post,
          id,
          userId: state.user?.id ?? "u_anon",
          authorName: state.user?.username ?? "anon",
          authorAvatar: state.user?.avatarGradient ?? DEFAULT_USER.avatarGradient,
          authorLevel: state.user?.level ?? 1,
          likeCount: 0,
          commentCount: 0,
          comments: [],
          createdAt: new Date().toISOString(),
        };
        set({ posts: [newPost, ...state.posts] });
        if (state.user) {
          set({ user: awardXp(state.user, 10) });
        }
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
                  userId: state.user?.id ?? "u_anon",
                  authorName: state.user?.username ?? "anon",
                  authorAvatar: state.user?.avatarGradient ?? DEFAULT_USER.avatarGradient,
                  content,
                  likeCount: 0,
                  createdAt: new Date().toISOString(),
                },
              ],
            };
          }),
        });
        if (state.user) {
          set({ user: awardXp(state.user, 5) });
        }
      },

      updateUser: (patch) => {
        const state = get();
        if (!state.user) return;
        set({ user: { ...state.user, ...patch } });
      },

      awardBadge: (badgeId) => {
        const state = get();
        if (state.earnedBadgeIds.includes(badgeId)) return;
        set({ earnedBadgeIds: [...state.earnedBadgeIds, badgeId] });
      },
    }),
    {
      name: "codedex-clone-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        user: s.user,
        isAuthed: s.isAuthed,
        progress: s.progress,
        earnedBadgeIds: s.earnedBadgeIds,
        builds: s.builds,
        posts: s.posts,
      }),
    },
  ),
);
