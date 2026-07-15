import Link from "next/link";
import { courses } from "@/data/courses";
import { learningJourneys } from "@/data/journeys";
import { builds } from "@/data/builds";
import { CourseCard } from "@/components/course/CourseCard";
import { formatNumber } from "@/lib/utils";

const STATS = [
  { num: "1.75M+", label: "学习者", emoji: "👥" },
  { num: "150+", label: "国家", emoji: "🌍" },
  { num: "5M+", label: "练习", emoji: "🎯" },
  { num: "10K+", label: "作品", emoji: "🏗️" },
];

const FEATURED_SLUGS = ["python", "html", "css", "javascript", "sql", "github-copilot"];

const STORIES = [
  {
    name: "Marco Silva",
    flag: "🇵🇹",
    role: "初级前端开发者",
    avatar: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
    excerpt:
      "6 个月内从咖啡师转行为开发者。连续学习系统让我每天晚上都坚持打卡。",
  },
  {
    name: "Aria Patel",
    flag: "🇮🇳",
    role: "计算机科学学生",
    avatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
    excerpt:
      "我试过其他 3 个平台。CodeGame 是唯一一个不让我觉得自己笨的平台。Lumi 真是救星。",
  },
  {
    name: "Kenji Tanaka",
    flag: "🇯🇵",
    role: "14 岁创作者",
    avatar: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
    excerpt:
      "我用在这里学到的知识做出了我的第一个游戏。我的朋友们都不敢相信这是 14 岁的人做的。",
  },
];

const SUPPORTERS = ["GitHub", "Microsoft", "Vercel", "OpenAI", "Anthropic"];

export default function HomePage() {
  const featured = FEATURED_SLUGS.map((s) => courses.find((c) => c.slug === s)).filter((c): c is NonNullable<typeof c> => !!c);
  const topBuilds = builds.slice(0, 3);

  return (
    <div className="relative">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(124,92,252,0.18),_transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(255,107,157,0.12),_transparent_55%)]" />
          {/* 像素装饰 */}
          <div className="absolute top-20 left-10 text-4xl animate-floaty opacity-60 select-none">⭐</div>
          <div className="absolute top-32 right-16 text-3xl animate-floaty opacity-50 select-none" style={{ animationDelay: "1s" }}>🎮</div>
          <div className="absolute bottom-20 left-1/4 text-3xl animate-floaty opacity-40 select-none" style={{ animationDelay: "2s" }}>🐍</div>
          <div className="absolute bottom-32 right-1/4 text-2xl animate-floaty opacity-40 select-none" style={{ animationDelay: "0.5s" }}>⚡</div>
        </div>

        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-accent/40 bg-accent/10 text-xs text-accent2 font-pixel">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            1.75M+ 学习者，且持续增长中
          </div>
          <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            最<span className="gradient-text">有趣</span>且
            <span className="gradient-text-cyan">入门友好</span>
            <br className="hidden sm:block" />的学编程方式
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            通过互动课程、浏览器代码编辑器、XP 和徽章、友好的社区，
            以及名为 Lumi 的 AI 小伙伴来提升等级。零配置。零枯燥。
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/courses"
              className="px-7 py-3.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold text-base hover:shadow-glow transition-all hover:scale-105"
            >
              立即开始 — 完全免费
            </Link>
            <Link
              href="/builds"
              className="px-7 py-3.5 rounded-lg border border-rule bg-bg2/60 text-ink font-semibold text-base hover:border-accent transition"
            >
              探索作品
            </Link>
          </div>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-muted mb-3">支持方</p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
              {SUPPORTERS.map((s) => (
                <span key={s} className="font-outfit font-bold text-muted/70 text-lg">{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ============ COURSES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold">
            探索 <span className="gradient-text">250+ 小时</span>免费互动编程课程
          </h2>
          <p className="mt-3 text-muted">
            从你的第一行 <code className="px-1.5 py-0.5 rounded bg-bg3 text-accent3 font-mono text-sm">print(&quot;Hello&quot;)</code> 到部署真实应用。
          </p>
        </div>

        {/* 学习路径 chips */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {learningJourneys.map((j) => (
            <Link
              key={j.name}
              href="/courses"
              className="px-4 py-2 rounded-full border border-rule bg-bg2 text-sm text-ink hover:border-accent hover:text-accent transition flex items-center gap-2"
            >
              <span>{j.emoji}</span>
              {j.name}
            </Link>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featured.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
        <div className="text-center mt-10">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-accent text-accent font-semibold hover:bg-accent hover:text-white transition"
          >
            探索所有课程
            <span aria-hidden>→</span>
          </Link>
        </div>
      </section>

      {/* ============ STATS ============ */}
      <section className="border-y border-rule bg-bg2/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {STATS.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl mb-2">{s.emoji}</div>
                <div className="font-pixel text-3xl sm:text-4xl gradient-text font-bold">{s.num}</div>
                <div className="mt-1 text-xs uppercase tracking-wider text-muted">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FEATURE 1: Level up ============ */}
      <FeatureSection
        eyebrow="游戏化学习"
        title="让你的学习升级"
        body="创建一个像素风角色，每完成一个练习都能获得 XP，并沿途解锁徽章。学编程从未如此像一场真实的 RPG 冒险。"
        bullets={[
          { icon: "⚔️", text: "创建并自定义你自己的像素角色" },
          { icon: "✨", text: "每个练习可获得 10-500 XP，自动升级" },
          { icon: "🏅", text: "达成里程碑可收集 12+ 个独特徽章" },
          { icon: "🔥", text: "建立连续学习记录 — 7 天、30 天，甚至 100 天" },
        ]}
        visual={
          <div className="space-y-4">
            <div className="rounded-xl border border-accent/40 bg-bg3 p-5 shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full ring-2 ring-accent" style={{ background: "linear-gradient(135deg, #7C5CFC, #FF6B9D)" }} />
                  <div>
                    <div className="font-bold text-ink">你的英雄角色</div>
                    <div className="text-xs text-muted">等级 7 · Python 路径</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-xl text-accent2">等级 7</div>
                  <div className="text-[10px] text-muted">1,540 XP</div>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-bg2 overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-accent to-accent2" />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted">
                <span>等级 7</span>
                <span>620 / 1000 XP 升至等级 8</span>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {["�", "�", "🎯", "�"].map((e, i) => (
                <div key={i} className="aspect-square rounded-lg border border-rule bg-bg3 flex items-center justify-center text-2xl">
                  {e}
                </div>
              ))}
            </div>
          </div>
        }
      />

      {/* ============ FEATURE 2: Practice ============ */}
      <FeatureSection
        reversed
        eyebrow="动手实践"
        title="练习你的编程技巧"
        body="每节课都配备真实的浏览器内代码编辑器。无需配置，无需安装。编写代码，点击运行，立即看到输出。然后用我们的测试用例检查你的答案。"
        bullets={[
          { icon: "💻", text: "Monaco 编辑器 — 与 VS Code 使用的是同一款" },
          { icon: "▶️", text: "直接在浏览器中运行 Python、JS、HTML、CSS" },
          { icon: "✅", text: "自动评分的测试用例，即时反馈" },
          { icon: "🤖", text: "卡住了？问问 Lumi，你的 AI 编程伙伴" },
        ]}
        visual={
          <div className="rounded-xl border border-rule overflow-hidden shadow-card">
            <div className="bg-bg3 px-4 py-2 flex items-center gap-2 border-b border-rule">
              <span className="w-3 h-3 rounded-full bg-accent2" />
              <span className="w-3 h-3 rounded-full bg-warning" />
              <span className="w-3 h-3 rounded-full bg-success" />
              <span className="ml-2 text-xs text-muted font-mono">main.py</span>
            </div>
            <pre className="bg-codebg p-4 text-xs font-mono text-ink overflow-x-auto">
{`# 你的第一个程序
`}<span className="text-accent2">for</span><span className="text-ink"> i </span><span className="text-accent2">in</span><span className="text-ink"> </span><span className="text-accent3">range</span><span className="text-ink">(</span><span className="text-warning">5</span><span className="text-ink">):</span>{`
    `}<span className="text-accent3">print</span><span className="text-ink">(</span><span className="text-success">"升级！"</span><span className="text-ink">)</span>{`
`}
            </pre>
            <div className="bg-bg2 px-4 py-2 text-xs font-mono text-success border-t border-rule">
              <span className="text-muted">$ </span>升级！{"\n"}<span className="text-muted">$ </span>升级！{"\n"}<span className="text-muted">$ </span>升级！...
            </div>
            <div className="bg-success/10 px-4 py-2 text-xs text-success border-t border-rule flex items-center gap-2">
              <span>✓</span> 所有测试通过 — <span className="font-bold">+25 XP</span>
            </div>
          </div>
        }
      />

      {/* ============ FEATURE 3: Builds ============ */}
      <FeatureSection
        eyebrow="构建真实作品"
        title="打造精彩的作品集"
        body="CodeGame 作品是你的浏览器内项目工作室。使用 HTML、CSS 和 JS 构建网站、游戏和可视化作品。一键发布，向社区展示你的成果。"
        bullets={[
          { icon: "🗂️", text: "支持多文件项目和在线预览" },
          { icon: "🚀", text: "一键发布到可分享的链接" },
          { icon: "🍴", text: "复刻任意公开作品进行再创作" },
          { icon: "🌟", text: "有机会被选为编辑精选" },
        ]}
        visual={
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {topBuilds.map((b) => (
              <Link
                key={b.id}
                href={`/builds/${b.id}`}
                className="group rounded-lg overflow-hidden border border-rule bg-bg2 hover:border-accent transition"
              >
                <div className="h-20 flex items-center justify-center text-3xl" style={{ background: b.thumbnailGradient }}>
                  {b.title.includes("Snake") ? "🐍" : b.title.includes("Timer") ? "⏰" : "🌱"}
                </div>
                <div className="p-3">
                  <div className="font-bold text-sm text-ink group-hover:text-accent line-clamp-1">{b.title}</div>
                  <div className="text-[10px] text-muted mt-1 flex justify-between">
                    <span>❤️ {b.likeCount}</span>
                    <span>👁 {formatNumber(b.viewCount)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        }
      />

      {/* ============ FEATURE 4: Community ============ */}
      <FeatureSection
        reversed
        eyebrow="结伴同行更精彩"
        title="加入充满动力的社区"
        body="你不是一个人在学习。在友好的论坛和活跃的 Discord 服务器中分享你的作品、提出问题、分享你的成就，相互鼓励。"
        bullets={[
          { icon: "💬", text: "4 个分类：综合、职业、展示、自我介绍" },
          { icon: "🏆", text: "每月挑战和 Game Jam 活动" },
          { icon: "🌙", text: "30NitesOfCode — 年度连续学习挑战" },
          { icon: "❤️", text: "点赞、评论，帮助他人即可获得 XP" },
        ]}
        visual={
          <div className="space-y-3">
            {[
              { name: "sarah_codes", flag: "�", text: "刚发布了我的第一个作品！", likes: 142, color: "linear-gradient(135deg, #FF6B9D, #7C5CFC)" },
              { name: "marco.dev", flag: "�", text: "拿到了我的第一份开发工作！！", likes: 318, color: "linear-gradient(135deg, #4ECDC4, #2D2D52)" },
              { name: "kenji_pixel", flag: "👋", text: "大家好！我 14 岁，来自大阪", likes: 89, color: "linear-gradient(135deg, #7C5CFC, #4ECDC4)" },
            ].map((p, i) => (
              <div key={i} className="rounded-lg border border-rule bg-bg2 p-3 flex gap-3">
                <div className="h-9 w-9 rounded-full shrink-0" style={{ background: p.color }} />
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-muted">@{p.name}</div>
                  <div className="text-sm text-ink truncate">{p.flag} {p.text}</div>
                  <div className="text-[10px] text-muted mt-1">❤️ {p.likes}</div>
                </div>
              </div>
            ))}
          </div>
        }
      />

      {/* ============ LEARNER STORIES ============ */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-center font-outfit text-3xl sm:text-4xl font-bold mb-2">
          和你一样的学习者
        </h2>
        <p className="text-center text-muted mb-10">来自 CodeGame 社区的真实故事。</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {STORIES.map((s) => (
            <div
              key={s.name}
              className="rounded-xl border border-rule bg-bg2 p-6 hover:border-accent transition group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full ring-2 ring-accent/40" style={{ background: s.avatar }} />
                <div>
                  <div className="font-bold text-ink">{s.name} {s.flag}</div>
                  <div className="text-xs text-accent2">{s.role}</div>
                </div>
              </div>
              <p className="text-sm text-muted leading-relaxed italic">&ldquo;{s.excerpt}&rdquo;</p>
              <Link href="/blog" className="mt-4 inline-block text-sm text-accent hover:text-accent2 transition">
                阅读故事 →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="rounded-2xl border border-accent/40 bg-gradient-to-br from-bg2 to-bg3 p-10 text-center relative overflow-hidden">
          <div className="absolute top-4 left-4 text-3xl animate-floaty">⭐</div>
          <div className="absolute bottom-4 right-4 text-3xl animate-floaty" style={{ animationDelay: "1s" }}>🚀</div>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold mb-3">
            准备好开始你的<span className="gradient-text">编程冒险了吗？</span>
          </h2>
          <p className="text-muted mb-6">免费。有趣。只需一个练习即可开始。</p>
          <Link
            href="/courses"
            className="inline-block px-8 py-3.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold text-base hover:shadow-glow transition-all hover:scale-105"
          >
            开始你的编程冒险
          </Link>
        </div>
      </section>
    </div>
  );
}

interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  body: string;
  bullets: { icon: string; text: string }[];
  visual: React.ReactNode;
  reversed?: boolean;
}

function FeatureSection({ eyebrow, title, body, bullets, visual, reversed }: FeatureSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${reversed ? "lg:[direction:rtl]" : ""}`}>
        <div className="[direction:ltr]">
          <div className="text-xs uppercase tracking-widest text-accent2 font-bold mb-2">{eyebrow}</div>
          <h2 className="font-outfit text-3xl sm:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-muted mb-6 text-lg">{body}</p>
          <ul className="space-y-3">
            {bullets.map((b, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="text-xl shrink-0">{b.icon}</span>
                <span className="text-ink text-sm leading-relaxed">{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="[direction:ltr]">{visual}</div>
      </div>
    </section>
  );
}
