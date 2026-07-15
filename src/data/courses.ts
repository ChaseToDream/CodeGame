import type { Course } from "@/types";

/**
 * 课程种子数据
 * 包含 PRD 第 4.1.4 节列出的 25 门课程，其中 Python / HTML / CSS / JavaScript / SQL / GitHub Copilot 含完整章节与练习，
 * 其余课程提供元数据用于列表展示，章节练习以骨架填充。
 */

export const courses: Course[] = [
  {
    id: "c_python",
    slug: "python",
    title: "Python",
    description: "学习 Python 的基础知识，这是世界上最受欢迎、最适合入门的编程语言之一。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #3776AB 0%, #FFD43B 100%)",
    icon: "🐍",
    estimatedHours: 12,
    learningJourney: ["Data Science", "Artificial Intelligence"],
    tags: ["Python", "Beginner", "Data Science"],
    learnerCount: 480000,
    chapters: [
      {
        id: "py_ch1",
        courseId: "c_python",
        title: "第 1 章：你好，Python！",
        description: "编写你的第一个 Python 程序，学习如何与计算机对话。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex1_1",
            chapterId: "py_ch1",
            title: "1.1 打印你的第一条消息",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 10,
            contentMd: `# 打印你的第一条消息

欢迎来到 Python！🐍 \`print()\` 函数是我们让 Python 在屏幕上显示文本的方式。

## print() 函数

把文本放在引号 \`" "\` 中，然后传给 \`print()\`：

\`\`\`python
print("Hello, World!")
\`\`\`

这会输出：
\`\`\`
Hello, World!
\`\`\`

## 你的任务

使用 \`print()\` 显示消息 **Hello, Python!**

> 💡 提示：别忘了在消息两边加上引号！`,
            starterCode: `# 使用 print() 显示：Hello, Python!
`,
            solutionCode: `print("Hello, Python!")`,
            testCases: [
              { name: "输出 Hello, Python!", expected: "Hello, Python!\n" },
            ],
          },
          {
            id: "py_ex1_2",
            chapterId: "py_ch1",
            title: "1.2 变量",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 15,
            contentMd: `# 变量

**变量**是一个带标签的盒子，用来存储值。使用 \`=\` 来赋值：

\`\`\`python
name = "Ada"
age = 25
print(name)
\`\`\`

## 你的任务

1. 创建一个变量 \`city\`，值为 \`"Tokyo"\`
2. 打印它`,
            starterCode: `# 创建变量 city 并打印它
`,
            solutionCode: `city = "Tokyo"\nprint(city)`,
            testCases: [
              { name: "打印 Tokyo", expected: "Tokyo\n" },
            ],
          },
          {
            id: "py_ex1_3",
            chapterId: "py_ch1",
            title: "1.3 多次打印",
            sortOrder: 3,
            type: "exercise",
            language: "python",
            xpReward: 15,
            contentMd: `# 多次打印

你可以随意调用 \`print()\` 多次——每次都独占一行：

\`\`\`python
print("line 1")
print("line 2")
\`\`\`

## 你的任务

按顺序打印这三行：
\`\`\`
Roses are red
Violets are blue
Sugar is sweet
\`\`\``,
            starterCode: `# 打印这三行
`,
            solutionCode: `print("Roses are red")\nprint("Violets are blue")\nprint("Sugar is sweet")`,
            testCases: [
              { name: "三行输出", expected: "Roses are red\nViolets are blue\nSugar is sweet\n" },
            ],
          },
        ],
      },
      {
        id: "py_ch2",
        courseId: "c_python",
        title: "第 2 章：数据类型",
        description: "数字、字符串和布尔值——数据的基本构建块。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex2_1",
            chapterId: "py_ch2",
            title: "2.1 数字与数学",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 20,
            contentMd: `# 数字与数学

Python 可以做算术运算。试试这些运算符：

| 运算符 | 含义     | 示例     |
| ------ | -------- | -------- |
| \`+\`   | 加       | \`3 + 2\`  |
| \`-\`   | 减       | \`5 - 1\`  |
| \`*\`   | 乘       | \`4 * 6\`  |
| \`/\`   | 除       | \`10 / 2\` |

## 你的任务

计算并打印 \`25 * 4\` 的结果。`,
            starterCode: `# 打印 25 * 4 的结果
`,
            solutionCode: `print(25 * 4)`,
            testCases: [
              { name: "打印 100", expected: "100\n" },
            ],
          },
          {
            id: "py_ex2_2",
            chapterId: "py_ch2",
            title: "2.2 字符串拼接",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 20,
            contentMd: `# 字符串拼接

用 \`+\` 连接字符串：

\`\`\`python
greeting = "Hello, " + "World!"
print(greeting)
\`\`\`

## 你的任务

把 \`"Code"\` 和 \`"Game"\` 合并成一个单词并打印出来。`,
            starterCode: `# 合并 "Code" 和 "Game" 然后打印
`,
            solutionCode: `print("Code" + "Game")`,
            testCases: [
              { name: "打印 CodeGame", expected: "CodeGame\n" },
            ],
          },
        ],
      },
      {
        id: "py_ch3",
        courseId: "c_python",
        title: "第 3 章：控制流",
        description: "用 if/else 做决定，用循环重复执行。",
        sortOrder: 3,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex3_1",
            chapterId: "py_ch3",
            title: "3.1 if 语句",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 25,
            contentMd: `# if 语句

在代码中做决定：

\`\`\`python
age = 18
if age >= 18:
    print("Adult")
else:
    print("Minor")
\`\`\`

> ⚠️ 在 Python 中，缩进（4 个空格）非常重要！

## 你的任务

给定 \`score = 85\`，如果分数大于等于 60，则打印 \`"Pass"\`。`,
            starterCode: `score = 85
# 如果 score >= 60 则打印 "Pass"
`,
            solutionCode: `score = 85\nif score >= 60:\n    print("Pass")`,
            testCases: [
              { name: "打印 Pass", expected: "Pass\n" },
            ],
          },
          {
            id: "py_ex3_2",
            chapterId: "py_ch3",
            title: "3.2 for 循环",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 30,
            contentMd: `# for 循环

用 \`for\` 和 \`range()\` 重复执行代码：

\`\`\`python
for i in range(3):
    print(i)
\`\`\`

输出：
\`\`\`
0
1
2
\`\`\`

## 你的任务

使用 \`for\` 循环打印 1 到 5（含）的数字。使用 \`range(1, 6)\`。`,
            starterCode: `# 使用 for 循环打印 1 到 5
`,
            solutionCode: `for i in range(1, 6):\n    print(i)`,
            testCases: [
              { name: "打印 1 到 5", expected: "1\n2\n3\n4\n5\n" },
            ],
          },
          {
            id: "py_ch3_challenge",
            chapterId: "py_ch3",
            title: "挑战包：FizzBuzz",
            sortOrder: 3,
            type: "challenge_pack",
            language: "python",
            xpReward: 50,
            contentMd: `# 🎯 挑战：FizzBuzz

经典题目！打印 1 到 15 的数字。但是：
- 对于 3 的倍数，打印 \`Fizz\` 代替数字
- 对于 5 的倍数，打印 \`Buzz\`
- 对于 3 和 5 的公倍数，打印 \`FizzBuzz\`

示例输出（前 5 个）：
\`\`\`
1
2
Fizz
4
Buzz
\`\`\``,
            starterCode: `# 编写 1 到 15 的 FizzBuzz
`,
            solutionCode: `for i in range(1, 16):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)`,
            testCases: [
              {
                name: "fizzbuzz 1-15",
                expected:
                  "1\n2\nFizz\n4\nBuzz\nFizz\n7\n8\nFizz\nBuzz\n11\nFizz\n13\n14\nFizzBuzz\n",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_html",
    slug: "html",
    title: "HTML",
    description: "用超文本标记语言构建地球上每个网站的结构。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #E34F26 0%, #F06529 100%)",
    icon: "📄",
    estimatedHours: 8,
    learningJourney: ["Web Development"],
    tags: ["Web Development", "Beginner"],
    learnerCount: 320000,
    chapters: [
      {
        id: "html_ch1",
        courseId: "c_html",
        title: "第 1 章：HTML 基础",
        description: "标签、元素和页面骨架。",
        sortOrder: 1,
        exercises: [
          {
            id: "html_ex1_1",
            chapterId: "html_ch1",
            title: "1.1 你的第一个标题",
            sortOrder: 1,
            type: "exercise",
            language: "html",
            xpReward: 10,
            contentMd: `# 你的第一个标题

HTML 使用包裹在 \`< >\` 中的**标签**。标题使用 \`<h1>\` 到 \`<h6>\`：

\`\`\`html
<h1>Big Title</h1>
<h2>Subtitle</h2>
\`\`\`

## 你的任务

创建一个 \`<h1>\`，文本为 **Welcome to CodeGame**。`,
            starterCode: `<!-- 创建一个 <h1>，内容为 "Welcome to CodeGame" -->
`,
            solutionCode: `<h1>Welcome to CodeGame</h1>`,
            testCases: [
              { name: "包含 h1 和文本", expected: "<h1>Welcome to CodeGame</h1>" },
            ],
          },
          {
            id: "html_ex1_2",
            chapterId: "html_ch1",
            title: "1.2 段落",
            sortOrder: 2,
            type: "exercise",
            language: "html",
            xpReward: 15,
            contentMd: `# 段落

用 \`<p>\` 标签包裹文本：

\`\`\`html
<p>This is a paragraph.</p>
\`\`\`

## 你的任务

创建一个段落，文本为 **I am learning HTML.**`,
            starterCode: `<!-- 创建一个 <p>，内容为该文本 -->
`,
            solutionCode: `<p>I am learning HTML.</p>`,
            testCases: [
              { name: "包含 p 和文本", expected: "<p>I am learning HTML.</p>" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_css",
    slug: "css",
    title: "CSS",
    description: "用颜色、字体、布局和动画为你的网页添加样式。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #264DE4 0%, #2965F1 100%)",
    icon: "🎨",
    estimatedHours: 10,
    learningJourney: ["Web Development"],
    tags: ["Web Development", "Beginner"],
    learnerCount: 210000,
    chapters: [
      {
        id: "css_ch1",
        courseId: "c_css",
        title: "第 1 章：样式基础",
        description: "颜色、字体和选择器。",
        sortOrder: 1,
        exercises: [
          {
            id: "css_ex1_1",
            chapterId: "css_ch1",
            title: "1.1 颜色",
            sortOrder: 1,
            type: "exercise",
            language: "css",
            xpReward: 15,
            contentMd: `# 颜色

设置文本颜色：

\`\`\`css
h1 {
  color: blue;
}
\`\`\`

## 你的任务

编写一条 CSS 规则，把 \`<p>\` 的颜色设为 \`purple\`。`,
            starterCode: `/* 把 <p> 设为紫色 */
`,
            solutionCode: `p {\n  color: purple;\n}`,
            testCases: [
              { name: "p 规则为紫色", expected: "p { color: purple; }" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_javascript",
    slug: "javascript",
    title: "JavaScript",
    description: "用 Web 的语言为你的网站添加交互性。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #F7DF1E 0%, #F0DB4F 100%)",
    icon: "⚡",
    estimatedHours: 14,
    learningJourney: ["Web Development"],
    tags: ["Web Development", "Beginner"],
    learnerCount: 410000,
    chapters: [
      {
        id: "js_ch1",
        courseId: "c_javascript",
        title: "第 1 章：JS 基础",
        description: "变量、类型和控制台输出。",
        sortOrder: 1,
        exercises: [
          {
            id: "js_ex1_1",
            chapterId: "js_ch1",
            title: "1.1 控制台输出",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 10,
            contentMd: `# 控制台输出

使用 \`console.log()\` 打印：

\`\`\`javascript
console.log("Hello!");
\`\`\`

## 你的任务

打印 **Hello, JavaScript!**`,
            starterCode: `// 打印 Hello, JavaScript!
`,
            solutionCode: `console.log("Hello, JavaScript!");`,
            testCases: [
              { name: "输出消息", expected: "Hello, JavaScript!\n" },
            ],
          },
          {
            id: "js_ex1_2",
            chapterId: "js_ch1",
            title: "1.2 变量",
            sortOrder: 2,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# 变量

使用 \`let\` 或 \`const\`：

\`\`\`javascript
const name = "Ada";
let score = 0;
\`\`\`

## 你的任务

创建一个名为 \`platform\` 的 \`const\`，值为 \`"CodeGame"\`，并打印它。`,
            starterCode: `// 创建 platform 并打印它
`,
            solutionCode: `const platform = "CodeGame";\nconsole.log(platform);`,
            testCases: [
              { name: "输出 CodeGame", expected: "CodeGame\n" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_sql",
    slug: "sql",
    title: "SQL",
    description: "查询数据库，释放结构化数据的力量。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #00758F 0%, #F29111 100%)",
    icon: "🗄️",
    estimatedHours: 6,
    learningJourney: ["Data Science"],
    tags: ["Data Science", "Beginner"],
    learnerCount: 95000,
    chapters: [
      {
        id: "sql_ch1",
        courseId: "c_sql",
        title: "第 1 章：SELECT",
        description: "从表中读取数据。",
        sortOrder: 1,
        exercises: [
          {
            id: "sql_ex1_1",
            chapterId: "sql_ch1",
            title: "1.1 查询全部",
            sortOrder: 1,
            type: "exercise",
            language: "sql",
            xpReward: 10,
            contentMd: `# SELECT

从表中读取所有列：

\`\`\`sql
SELECT * FROM users;
\`\`\`

## 你的任务

编写一条查询，从 \`courses\` 表中选择所有列。`,
            starterCode: `-- 从 courses 中选择全部
`,
            solutionCode: `SELECT * FROM courses;`,
            testCases: [
              { name: "查询全部", expected: "SELECT * FROM courses;" },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_copilot",
    slug: "github-copilot",
    title: "GitHub Copilot",
    description: "与一位 AI 助手结对编程，它会在你编写代码时同步生成代码。",
    difficulty: "intermediate",
    isNew: true,
    bannerGradient: "linear-gradient(135deg, #6E40C9 0%, #FF6B9D 100%)",
    icon: "🤖",
    estimatedHours: 5,
    learningJourney: [],
    tags: ["Tools", "Intermediate"],
    learnerCount: 78000,
    chapters: [
      {
        id: "copilot_ch1",
        courseId: "c_copilot",
        title: "第 1 章：入门指南",
        description: "安装 Copilot，编写你的第一段 AI 辅助代码。",
        sortOrder: 1,
        exercises: [
          {
            id: "copilot_ex1_1",
            chapterId: "copilot_ch1",
            title: "1.1 你的第一个建议",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# 你的第一个建议

GitHub Copilot 会在你输入时给出代码建议。编写一条描述你需求的注释，然后按 \`Tab\` 接受建议。

## 你的任务

编写一个函数 \`add(a, b)\`，返回两个数字的和，然后打印 \`add(2, 3)\`。`,
            starterCode: `// 定义 add(a, b) 并打印 add(2, 3)
`,
            solutionCode: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`,
            testCases: [
              { name: "输出 5", expected: "5\n" },
            ],
          },
        ],
      },
    ],
  },
  // —— 以下课程仅用于列表展示，提供骨架章节 ——
  makeSkeletonCourse("c_cpp", "cpp", "C++", "intermediate", "⚙️",
    "linear-gradient(135deg, #00599C 0%, #659AD2 100%)", ["Computer Science"], ["Intermediate"], 18, 88000),
  makeSkeletonCourse("c_java", "java", "Java", "beginner", "☕",
    "linear-gradient(135deg, #007396 0%, #E76F00 100%)", ["Computer Science"], ["Beginner"], 16, 142000),
  makeSkeletonCourse("c_csharp", "csharp", "C#", "beginner", "🎯",
    "linear-gradient(135deg, #9B4F96 0%, #239120 100%)", ["Game Development"], ["Beginner"], 15, 67000),
  makeSkeletonCourse("c_git", "git-and-github", "Git & GitHub", "intermediate", "🔧",
    "linear-gradient(135deg, #F05032 0%, #6E5494 100%)", ["Web Development"], ["Tools", "Intermediate"], 7, 124000),
  makeSkeletonCourse("c_react", "react", "React", "intermediate", "⚛️",
    "linear-gradient(135deg, #61DAFB 0%, #282C34 100%)", ["Web Development"], ["Web Development", "Intermediate"], 12, 198000),
  makeSkeletonCourse("c_node", "nodejs", "Node.js", "intermediate", "🟢",
    "linear-gradient(135deg, #339933 0%, #43853D 100%)", ["Web Development"], ["Web Development", "Intermediate"], 10, 88000),
  makeSkeletonCourse("c_intjs", "intermediate-javascript", "进阶 JavaScript", "intermediate", "🔧",
    "linear-gradient(135deg, #F7DF1E 0%, #323330 100%)", ["Web Development"], ["Web Development", "Intermediate"], 11, 134000),
  makeSkeletonCourse("c_intpy", "intermediate-python", "进阶 Python", "intermediate", "🐍",
    "linear-gradient(135deg, #3776AB 0%, #FFD43B 100%)", ["Data Science"], ["Python", "Intermediate", "Data Science"], 13, 102000),
  makeSkeletonCourse("c_numpy", "numpy", "NumPy", "intermediate", "📊",
    "linear-gradient(135deg, #013243 0%, #4DABCF 100%)", ["Data Science"], ["Data Science", "Intermediate"], 8, 71000),
  makeSkeletonCourse("c_pandas", "pandas", "Pandas", "beginner", "🐼",
    "linear-gradient(135deg, #150458 0%, #FFCA00 100%)", ["Data Science"], ["Data Science", "Beginner"], 9, 84000),
  makeSkeletonCourse("c_matplotlib", "matplotlib", "Matplotlib", "intermediate", "📈",
    "linear-gradient(135deg, #11557C 0%, #4DABCF 100%)", ["Data Science"], ["Data Science", "Intermediate"], 7, 52000),
  makeSkeletonCourse("c_ml", "machine-learning", "机器学习", "intermediate", "🧠",
    "linear-gradient(135deg, #00B4D8 0%, #7C5CFC 100%)", ["Data Science", "Artificial Intelligence"], ["Data Science", "Intermediate"], 20, 156000),
  makeSkeletonCourse("c_genai", "genai", "GenAI", "intermediate", "✨",
    "linear-gradient(135deg, #FF6B9D 0%, #7C5CFC 100%)", ["Artificial Intelligence"], ["Intermediate"], 9, 98000),
  makeSkeletonCourse("c_dsa", "data-structures-algorithms", "数据结构与算法", "intermediate", "🌳",
    "linear-gradient(135deg, #4ECDC4 0%, #7C5CFC 100%)", ["Computer Science"], ["Intermediate"], 22, 178000),
  makeSkeletonCourse("c_p5js", "p5js", "p5.js", "intermediate", "🖼️",
    "linear-gradient(135deg, #ED225D 0%, #2B7FFF 100%)", [], ["Creative Coding", "Intermediate"], 8, 47000),
  makeSkeletonCourse("c_phaser", "phaser", "Phaser", "intermediate", "🎮",
    "linear-gradient(135deg, #FF6B9D 0%, #F0A04B 100%)", ["Game Development"], ["Creative Coding", "Intermediate"], 10, 39000),
  makeSkeletonCourse("c_lua", "lua", "Lua", "intermediate", "🌙",
    "linear-gradient(135deg, #2C2D72 0%, #000080 100%)", ["Game Development"], ["Intermediate"], 6, 28000),
  makeSkeletonCourse("c_uiux", "ui-ux-design", "UI/UX 设计", "beginner", "🖌️",
    "linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)", [], ["Tools", "Beginner"], 7, 61000),
  makeSkeletonCourse("c_cli", "command-line", "命令行", "beginner", "⌨️",
    "linear-gradient(135deg, #2D2D52 0%, #4ECDC4 100%)", ["Web Development"], ["Beginner", "Tools"], 4, 89000),
];

function makeSkeletonCourse(
  id: string,
  slug: string,
  title: string,
  difficulty: "beginner" | "intermediate",
  icon: string,
  bannerGradient: string,
  learningJourney: Course["learningJourney"],
  tags: Course["tags"],
  estimatedHours: number,
  learnerCount: number,
): Course {
  return {
    id,
    slug,
    title,
    description: `${title} 是 CodeGame 上热门的技能之一。开启你的冒险，不断升级吧！`,
    difficulty,
    isNew: false,
    bannerGradient,
    icon,
    estimatedHours,
    learningJourney,
    tags,
    learnerCount,
    chapters: [
      {
        id: `${id}_ch1`,
        courseId: id,
        title: "第 1 章：入门介绍",
        description: "从基础知识开始。",
        sortOrder: 1,
        exercises: [
          {
            id: `${id}_ex1_1`,
            chapterId: `${id}_ch1`,
            title: "1.1 入门指南",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 10,
            contentMd: `# 入门指南\n\n欢迎来到 ${title}！这是一个帮你入门的示例练习。\n\n## 你的任务\n\n使用 console.log 打印 \`"Ready!"\`。`,
            starterCode: `// 打印 "Ready!"\n`,
            solutionCode: `console.log("Ready!");`,
            testCases: [{ name: "输出 Ready!", expected: "Ready!\n" }],
          },
        ],
      },
    ],
  };
}

/** 工具函数：根据 slug 获取课程 */
export function getCourseBySlug(slug: string): Course | undefined {
  return courses.find((c) => c.slug === slug);
}

/** 工具函数：根据 courseSlug / chapterId / exerciseId 查找练习 */
export function findExercise(
  courseSlug: string,
  chapterId: string,
  exerciseId: string,
): { course: Course; chapter: Chapter; exercise: Exercise } | undefined {
  const course = getCourseBySlug(courseSlug);
  if (!course) return undefined;
  const chapter = course.chapters.find((c) => c.id === chapterId);
  if (!chapter) return undefined;
  const exercise = chapter.exercises.find((e) => e.id === exerciseId);
  if (!exercise) return undefined;
  return { course, chapter, exercise };
}

// 局部类型导入以避免循环
import type { Chapter, Exercise } from "@/types";
