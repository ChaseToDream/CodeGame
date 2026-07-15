import Link from "next/link";
import { courses } from "@/data/courses";
import { learningJourneys } from "@/data/journeys";
import { builds } from "@/data/builds";
import { CourseCard } from "@/components/course/CourseCard";
import { formatNumber } from "@/lib/utils";

const STATS = [
  { num: "1.75M+", label: "Learners", emoji: "👥" },
  { num: "150+", label: "Countries", emoji: "🌍" },
  { num: "5M+", label: "Exercises", emoji: "🎯" },
  { num: "10K+", label: "Builds", emoji: "🏗️" },
];

const FEATURED_SLUGS = ["python", "html", "css", "javascript", "sql", "github-copilot"];

const STORIES = [
  {
    name: "Marco Silva",
    flag: "🇵🇹",
    role: "Junior Frontend Dev",
    avatar: "linear-gradient(135deg, #4ECDC4, #2D2D52)",
    excerpt:
      "From barista to developer in 6 months. The streak system kept me showing up every single night.",
  },
  {
    name: "Aria Patel",
    flag: "🇮🇳",
    role: "CS Student",
    avatar: "linear-gradient(135deg, #F0A04B, #FF6B9D)",
    excerpt:
      "I tried 3 other platforms. Codédex is the only one that didn't make me feel stupid. Lumi is a lifesaver.",
  },
  {
    name: "Kenji Tanaka",
    flag: "🇯🇵",
    role: "14yo Builder",
    avatar: "linear-gradient(135deg, #7C5CFC, #4ECDC4)",
    excerpt:
      "I built my first game with what I learned here. My friends can't believe a 14-year-old made it.",
  },
];

const SUPPORTERS = ["GitHub", "Microsoft", "Vercel", "OpenAI", "Anthropic"];

export default function HomePage() {
  const featured = FEATURED_SLUGS.map((s) => courses.find((c) => c.slug === s)!).filter(Boolean);
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
            1.75M+ learners and counting
          </div>
          <h1 className="font-outfit text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight">
            The most <span className="gradient-text">fun</span> and{" "}
            <span className="gradient-text-cyan">beginner-friendly</span>
            <br className="hidden sm:block" /> way to learn to code
          </h1>
          <p className="mt-6 text-lg text-muted max-w-2xl mx-auto">
            Level up with interactive lessons, a browser code editor, XP and badges, a friendly community,
            and an AI buddy named Lumi. Zero setup. Zero boredom.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/signup"
              className="px-7 py-3.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold text-base hover:shadow-glow transition-all hover:scale-105"
            >
              Get started — it's free
            </Link>
            <Link
              href="/courses"
              className="px-7 py-3.5 rounded-lg border border-rule bg-bg2/60 text-ink font-semibold text-base hover:border-accent transition"
            >
              Explore courses
            </Link>
          </div>
          <div className="mt-10">
            <p className="text-xs uppercase tracking-widest text-muted mb-3">Supported by</p>
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
            Explore <span className="gradient-text">250+ hours</span> of free interactive coding lessons
          </h2>
          <p className="mt-3 text-muted">
            From your first <code className="px-1.5 py-0.5 rounded bg-bg3 text-accent3 font-mono text-sm">print(&quot;Hello&quot;)</code> to deploying real apps.
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
            Explore all courses
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
        eyebrow="Gamified learning"
        title="Level up your learning"
        body="Create a pixel-art character, earn XP with every exercise, and unlock badges as you go. Learning to code has never felt this much like a real RPG."
        bullets={[
          { icon: "⚔️", text: "Create and customize your own pixel character" },
          { icon: "✨", text: "Earn 10-500 XP per exercise, level up automatically" },
          { icon: "🏅", text: "Collect 12+ unique badges by hitting milestones" },
          { icon: "🔥", text: "Build streaks — 7, 30, even 100 days in a row" },
        ]}
        visual={
          <div className="space-y-4">
            <div className="rounded-xl border border-accent/40 bg-bg3 p-5 shadow-glow">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full ring-2 ring-accent" style={{ background: "linear-gradient(135deg, #7C5CFC, #FF6B9D)" }} />
                  <div>
                    <div className="font-bold text-ink">Your Hero</div>
                    <div className="text-xs text-muted">Level 7 · Python path</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-pixel text-xl text-accent2">Lvl 7</div>
                  <div className="text-[10px] text-muted">1,540 XP</div>
                </div>
              </div>
              <div className="h-2.5 rounded-full bg-bg2 overflow-hidden">
                <div className="h-full w-[62%] rounded-full bg-gradient-to-r from-accent to-accent2" />
              </div>
              <div className="flex justify-between mt-1 text-[10px] text-muted">
                <span>Lvl 7</span>
                <span>620 / 1000 XP to Lvl 8</span>
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
        eyebrow="Hands-on practice"
        title="Practice your coding chops"
        body="Every lesson comes with a real, in-browser code editor. No setup, no installs. Write code, hit Run, and see the output instantly. Then check your solution against our test cases."
        bullets={[
          { icon: "💻", text: "Monaco editor — the same one VS Code uses" },
          { icon: "▶️", text: "Run Python, JS, HTML, CSS right in the browser" },
          { icon: "✅", text: "Auto-graded test cases with instant feedback" },
          { icon: "🤖", text: "Stuck? Ask Lumi, your AI coding buddy" },
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
{`# Your first program
`}<span className="text-accent2">for</span><span className="text-ink"> i </span><span className="text-accent2">in</span><span className="text-ink"> </span><span className="text-accent3">range</span><span className="text-ink">(</span><span className="text-warning">5</span><span className="text-ink">):</span>{`
    `}<span className="text-accent3">print</span><span className="text-ink">(</span><span className="text-success">"Level up!"</span><span className="text-ink">)</span>{`
`}
            </pre>
            <div className="bg-bg2 px-4 py-2 text-xs font-mono text-success border-t border-rule">
              <span className="text-muted">$ </span>Level up!{"\n"}<span className="text-muted">$ </span>Level up!{"\n"}<span className="text-muted">$ </span>Level up!...
            </div>
            <div className="bg-success/10 px-4 py-2 text-xs text-success border-t border-rule flex items-center gap-2">
              <span>✓</span> All tests passed — <span className="font-bold">+25 XP</span>
            </div>
          </div>
        }
      />

      {/* ============ FEATURE 3: Builds ============ */}
      <FeatureSection
        eyebrow="Build real things"
        title="Build an awesome portfolio"
        body="Codédex Builds is your in-browser project studio. Build websites, games, and visualizations with HTML, CSS, and JS. Publish with one click and show off your work to the community."
        bullets={[
          { icon: "🗂️", text: "Multi-file projects with live preview" },
          { icon: "🚀", text: "One-click publish to a shareable link" },
          { icon: "🍴", text: "Fork any public Build to remix it" },
          { icon: "🌟", text: "Get featured as a Staff Pick" },
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
        eyebrow="Together is better"
        title="Join a motivating community"
        body="You're not learning alone. Share your Builds, ask questions, post your wins, and cheer each other on in our friendly forum and active Discord server."
        bullets={[
          { icon: "💬", text: "4 categories: General, Career, Showcase, Intros" },
          { icon: "🏆", text: "Monthly challenges and Game Jam events" },
          { icon: "🌙", text: "30NitesOfCode — the annual streak challenge" },
          { icon: "❤️", text: "Like, comment, and earn XP for helping others" },
        ]}
        visual={
          <div className="space-y-3">
            {[
              { name: "sarah_codes", flag: "�", text: "Just shipped my first build!", likes: 142, color: "linear-gradient(135deg, #FF6B9D, #7C5CFC)" },
              { name: "marco.dev", flag: "�", text: "Got my first dev job!!", likes: 318, color: "linear-gradient(135deg, #4ECDC4, #2D2D52)" },
              { name: "kenji_pixel", flag: "👋", text: "Hi everyone! 14yo from Osaka", likes: 89, color: "linear-gradient(135deg, #7C5CFC, #4ECDC4)" },
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
          Learners like you
        </h2>
        <p className="text-center text-muted mb-10">Real stories from the Codédex community.</p>
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
                Read story →
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
            Ready to start your <span className="gradient-text">coding adventure?</span>
          </h2>
          <p className="text-muted mb-6">It's free. It's fun. It only takes one exercise to begin.</p>
          <Link
            href="/signup"
            className="inline-block px-8 py-3.5 rounded-lg bg-gradient-to-r from-accent to-accent2 text-white font-semibold text-base hover:shadow-glow transition-all hover:scale-105"
          >
            Create your free account
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
