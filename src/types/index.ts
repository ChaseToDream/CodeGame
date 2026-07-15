// 核心类型定义 —— 对应 PRD 第 7 章数据模型

export type Difficulty = "beginner" | "intermediate";

export type LearningJourney =
  | "Web Development"
  | "Data Science"
  | "Artificial Intelligence"
  | "Computer Science"
  | "Game Development";

export type CourseTag =
  | "Python"
  | "Web Development"
  | "Data Science"
  | "Tools"
  | "Creative Coding"
  | "Beginner"
  | "Intermediate";

export type ExerciseType = "exercise" | "bonus_article" | "challenge_pack" | "checkpoint" | "final_project";

export type Language = "python" | "javascript" | "html" | "css" | "sql" | "cpp" | "java";

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
  email: string;
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
}

export interface ProgressState {
  // key: exerciseId, value: status
  statuses: Record<string, "locked" | "unlocked" | "in_progress" | "completed">;
  // key: exerciseId, value: saved code
  codeSnapshots: Record<string, string>;
}
