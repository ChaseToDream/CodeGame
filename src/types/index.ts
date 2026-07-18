// 核心类型定义 —— 对应 PRD 第 7 章数据模型

export type Difficulty = "beginner" | "intermediate" | "advanced";

export type LearningJourney =
  | "Web Development"
  | "Data Science"
  | "Artificial Intelligence"
  | "Computer Science"
  | "Game Development"
  | "Systems Programming";

export type CourseTag =
  | "Python"
  | "Web Development"
  | "Data Science"
  | "Tools"
  | "Creative Coding"
  | "Beginner"
  | "Intermediate"
  | "Advanced"
  | "Systems Programming";

export type ExerciseType = "exercise" | "bonus_article" | "challenge_pack" | "checkpoint" | "final_project";

export type Language = "python" | "javascript" | "html" | "css" | "sql" | "cpp" | "java" | "go" | "rust" | "typescript";

export interface TestCase {
  name: string;
  input?: string;
  expected: string;
  hidden?: boolean;
}

export interface Exercise {
  id: string;
  chapterId: string;
  title: string;
  sortOrder: number;
  type: ExerciseType;
  contentMd: string;
  starterCode: string;
  solutionCode?: string;
  testCases: TestCase[];
  xpReward: number;
  language: Language;
}

export interface Chapter {
  id: string;
  courseId: string;
  title: string;
  description?: string;
  sortOrder: number;
  cutsceneUrl?: string;
  exercises: Exercise[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  isNew: boolean;
  bannerGradient: string;
  icon: string;
  estimatedHours: number;
  learningJourney: LearningJourney[];
  tags: CourseTag[];
  learnerCount: number;
  chapters: Chapter[];
}

export interface BuildFile {
  name: string;
  language: "html" | "css" | "js";
  content: string;
}

export interface Build {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  description: string;
  files: BuildFile[];
  isPublished: boolean;
  thumbnailGradient: string;
  forkedFrom?: string;
  viewCount: number;
  likeCount: number;
  /** 当前用户是否已点赞（本地状态，与 likeCount 同步维护） */
  likedByMe?: boolean;
  createdAt: string;
}

export type PostCategory = "general" | "career" | "project_showcase" | "introductions";

export interface PostComment {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  likeCount: number;
  /** 当前用户是否已点赞（本地状态，与 likeCount 同步维护） */
  likedByMe?: boolean;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  authorName: string;
  authorAvatar: string;
  authorLevel: number;
  category: PostCategory;
  title: string;
  content: string;
  attachedBuildId?: string;
  isStaffPick: boolean;
  likeCount: number;
  commentCount: number;
  likedByMe?: boolean;
  comments: PostComment[];
  createdAt: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  emoji: string;
  criteria: string;
  xpBonus: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Product Updates" | "Learner Stories" | "Announcements" | "Tutorials";
  author: string;
  authorAvatar: string;
  publishedAt: string;
  readingMinutes: number;
  coverGradient: string;
}

export interface User {
  id: string;
  username: string;
  avatarGradient: string;
  bio: string;
  xpTotal: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  createdAt: string;
  countryFlag: string;
  role: "member" | "staff";
  /** 世界模式自定义角色外观 */
  character?: {
    skin: string;
    hair: string;
    outfit: string;
    accessory: string;
  };
}

export interface ProgressState {
  // key: exerciseId, value: status
  statuses: Record<string, "locked" | "unlocked" | "in_progress" | "completed">;
  // key: exerciseId, value: saved code
  codeSnapshots: Record<string, string>;
}

/**
 * 书签类型：与 GlobalSearch 的 SearchEntryType 对齐，
 * 便于在 Dashboard 复用搜索索引逻辑（按类型分组展示）。
 */
export type BookmarkType = "course" | "build" | "post" | "blog";

/**
 * 书签条目：记录用户收藏的内容。
 * - id：目标资源的稳定标识（course.id / build.id / post.id / blog.slug）
 * - type：目标资源类型
 * - addedAt：收藏时间，用于按收藏时间倒序展示
 *
 * 不缓存标题/图标等元数据：源头数据可能更新（如博客修订），
 * 渲染时从原始数据源实时拉取，避免缓存陈旧。
 */
export interface BookmarkItem {
  id: string;
  type: BookmarkType;
  addedAt: string;
}
