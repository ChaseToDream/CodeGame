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
    description: "Learn the fundamentals of Python, one of the most popular and beginner-friendly programming languages in the world.",
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
        title: "Chapter 1: Hello, Python!",
        description: "Write your first Python program and learn how to talk to the computer.",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex1_1",
            chapterId: "py_ch1",
            title: "1.1 Print Your First Message",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 10,
            contentMd: `# Print Your First Message

Welcome to Python! 🐍 The \`print()\` function is how we tell Python to display text on the screen.

## The print() function

You put text inside quotes \`" "\` and pass it to \`print()\`:

\`\`\`python
print("Hello, World!")
\`\`\`

This will output:
\`\`\`
Hello, World!
\`\`\`

## Your mission

Use \`print()\` to display the message **Hello, Python!**

> 💡 Tip: Don't forget the quotes around your message!`,
            starterCode: `# Use print() to display: Hello, Python!
`,
            solutionCode: `print("Hello, Python!")`,
            testCases: [
              { name: "outputs Hello, Python!", expected: "Hello, Python!\n" },
            ],
          },
          {
            id: "py_ex1_2",
            chapterId: "py_ch1",
            title: "1.2 Variables",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 15,
            contentMd: `# Variables

A **variable** is a labeled box that stores a value. Use \`=\` to assign:

\`\`\`python
name = "Ada"
age = 25
print(name)
\`\`\`

## Your mission

1. Create a variable \`city\` with the value \`"Tokyo"\`
2. Print it`,
            starterCode: `# Create variable city and print it
`,
            solutionCode: `city = "Tokyo"\nprint(city)`,
            testCases: [
              { name: "prints Tokyo", expected: "Tokyo\n" },
            ],
          },
          {
            id: "py_ex1_3",
            chapterId: "py_ch1",
            title: "1.3 Multiple Prints",
            sortOrder: 3,
            type: "exercise",
            language: "python",
            xpReward: 15,
            contentMd: `# Multiple Prints

You can call \`print()\` as many times as you want — each on its own line:

\`\`\`python
print("line 1")
print("line 2")
\`\`\`

## Your mission

Print these three lines, in order:
\`\`\`
Roses are red
Violets are blue
Sugar is sweet
\`\`\``,
            starterCode: `# Print the three lines
`,
            solutionCode: `print("Roses are red")\nprint("Violets are blue")\nprint("Sugar is sweet")`,
            testCases: [
              { name: "three lines", expected: "Roses are red\nViolets are blue\nSugar is sweet\n" },
            ],
          },
        ],
      },
      {
        id: "py_ch2",
        courseId: "c_python",
        title: "Chapter 2: Data Types",
        description: "Numbers, strings, and booleans — the building blocks of data.",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex2_1",
            chapterId: "py_ch2",
            title: "2.1 Numbers & Math",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 20,
            contentMd: `# Numbers & Math

Python can do arithmetic. Try these operators:

| Operator | Meaning  | Example  |
| -------- | -------- | -------- |
| \`+\`      | add      | \`3 + 2\`  |
| \`-\`      | subtract | \`5 - 1\`  |
| \`*\`      | multiply | \`4 * 6\`  |
| \`/\`      | divide   | \`10 / 2\` |

## Your mission

Compute and print the result of \`25 * 4\`.`,
            starterCode: `# Print the result of 25 * 4
`,
            solutionCode: `print(25 * 4)`,
            testCases: [
              { name: "prints 100", expected: "100\n" },
            ],
          },
          {
            id: "py_ex2_2",
            chapterId: "py_ch2",
            title: "2.2 String Concatenation",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 20,
            contentMd: `# String Concatenation

Join strings with \`+\`:

\`\`\`python
greeting = "Hello, " + "World!"
print(greeting)
\`\`\`

## Your mission

Combine \`"Code"\` and \`"dex"\` into one word and print it.`,
            starterCode: `# Combine "Code" and "dex" then print
`,
            solutionCode: `print("Code" + "dex")`,
            testCases: [
              { name: "prints Codedex", expected: "Codedex\n" },
            ],
          },
        ],
      },
      {
        id: "py_ch3",
        courseId: "c_python",
        title: "Chapter 3: Control Flow",
        description: "Make decisions with if/else and repeat with loops.",
        sortOrder: 3,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex3_1",
            chapterId: "py_ch3",
            title: "3.1 If Statements",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 25,
            contentMd: `# If Statements

Make decisions in code:

\`\`\`python
age = 18
if age >= 18:
    print("Adult")
else:
    print("Minor")
\`\`\`

> ⚠️ Indentation (4 spaces) matters in Python!

## Your mission

Given \`score = 85\`, print \`"Pass"\` if score is 60 or above.`,
            starterCode: `score = 85
# Print "Pass" if score >= 60
`,
            solutionCode: `score = 85\nif score >= 60:\n    print("Pass")`,
            testCases: [
              { name: "prints Pass", expected: "Pass\n" },
            ],
          },
          {
            id: "py_ex3_2",
            chapterId: "py_ch3",
            title: "3.2 For Loops",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 30,
            contentMd: `# For Loops

Repeat code with \`for\` and \`range()\`:

\`\`\`python
for i in range(3):
    print(i)
\`\`\`

Output:
\`\`\`
0
1
2
\`\`\`

## Your mission

Use a \`for\` loop to print numbers from 1 to 5 (inclusive). Use \`range(1, 6)\`.`,
            starterCode: `# Print 1 through 5 using a for loop
`,
            solutionCode: `for i in range(1, 6):\n    print(i)`,
            testCases: [
              { name: "prints 1 to 5", expected: "1\n2\n3\n4\n5\n" },
            ],
          },
          {
            id: "py_ch3_challenge",
            chapterId: "py_ch3",
            title: "Challenge Pack: FizzBuzz",
            sortOrder: 3,
            type: "challenge_pack",
            language: "python",
            xpReward: 50,
            contentMd: `# 🎯 Challenge: FizzBuzz

The classic! Print numbers 1 through 15. But:
- For multiples of 3, print \`Fizz\` instead of the number
- For multiples of 5, print \`Buzz\`
- For multiples of both 3 and 5, print \`FizzBuzz\`

Example output (first 5):
\`\`\`
1
2
Fizz
4
Buzz
\`\`\``,
            starterCode: `# Write FizzBuzz from 1 to 15
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
    description: "Build the structure of every website on earth with HyperText Markup Language.",
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
        title: "Chapter 1: HTML Basics",
        description: "Tags, elements, and the skeleton of a page.",
        sortOrder: 1,
        exercises: [
          {
            id: "html_ex1_1",
            chapterId: "html_ch1",
            title: "1.1 Your First Heading",
            sortOrder: 1,
            type: "exercise",
            language: "html",
            xpReward: 10,
            contentMd: `# Your First Heading

HTML uses **tags** wrapped in \`< >\`. Headings use \`<h1>\` to \`<h6>\`:

\`\`\`html
<h1>Big Title</h1>
<h2>Subtitle</h2>
\`\`\`

## Your mission

Create an \`<h1>\` with the text **Welcome to Codédex**.`,
            starterCode: `<!-- Create an <h1> with "Welcome to Codédex" -->
`,
            solutionCode: `<h1>Welcome to Codédex</h1>`,
            testCases: [
              { name: "contains h1 with text", expected: "<h1>Welcome to Codédex</h1>" },
            ],
          },
          {
            id: "html_ex1_2",
            chapterId: "html_ch1",
            title: "1.2 Paragraphs",
            sortOrder: 2,
            type: "exercise",
            language: "html",
            xpReward: 15,
            contentMd: `# Paragraphs

Wrap text in \`<p>\` tags:

\`\`\`html
<p>This is a paragraph.</p>
\`\`\`

## Your mission

Create a paragraph with the text **I am learning HTML.**`,
            starterCode: `<!-- Create a <p> with the text -->
`,
            solutionCode: `<p>I am learning HTML.</p>`,
            testCases: [
              { name: "contains p with text", expected: "<p>I am learning HTML.</p>" },
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
    description: "Style your web pages with colors, fonts, layouts, and animations.",
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
        title: "Chapter 1: Styling Basics",
        description: "Colors, fonts, and selectors.",
        sortOrder: 1,
        exercises: [
          {
            id: "css_ex1_1",
            chapterId: "css_ch1",
            title: "1.1 Color",
            sortOrder: 1,
            type: "exercise",
            language: "css",
            xpReward: 15,
            contentMd: `# Color

Set text color:

\`\`\`css
h1 {
  color: blue;
}
\`\`\`

## Your mission

Write a CSS rule that sets the color of \`<p>\` to \`purple\`.`,
            starterCode: `/* Make <p> purple */
`,
            solutionCode: `p {\n  color: purple;\n}`,
            testCases: [
              { name: "rule for p with purple", expected: "p { color: purple; }" },
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
    description: "Add interactivity to your websites with the language of the web.",
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
        title: "Chapter 1: JS Basics",
        description: "Variables, types, and console output.",
        sortOrder: 1,
        exercises: [
          {
            id: "js_ex1_1",
            chapterId: "js_ch1",
            title: "1.1 Console Log",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 10,
            contentMd: `# Console Log

Use \`console.log()\` to print:

\`\`\`javascript
console.log("Hello!");
\`\`\`

## Your mission

Print **Hello, JavaScript!**`,
            starterCode: `// Print Hello, JavaScript!
`,
            solutionCode: `console.log("Hello, JavaScript!");`,
            testCases: [
              { name: "logs message", expected: "Hello, JavaScript!\n" },
            ],
          },
          {
            id: "js_ex1_2",
            chapterId: "js_ch1",
            title: "1.2 Variables",
            sortOrder: 2,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# Variables

Use \`let\` or \`const\`:

\`\`\`javascript
const name = "Ada";
let score = 0;
\`\`\`

## Your mission

Create a \`const\` named \`platform\` with value \`"Codédex"\` and log it.`,
            starterCode: `// Create platform and log it
`,
            solutionCode: `const platform = "Codédex";\nconsole.log(platform);`,
            testCases: [
              { name: "logs Codedex", expected: "Codédex\n" },
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
    description: "Query databases and unlock the power of structured data.",
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
        title: "Chapter 1: SELECT",
        description: "Read data from tables.",
        sortOrder: 1,
        exercises: [
          {
            id: "sql_ex1_1",
            chapterId: "sql_ch1",
            title: "1.1 Select All",
            sortOrder: 1,
            type: "exercise",
            language: "sql",
            xpReward: 10,
            contentMd: `# SELECT

Read all columns from a table:

\`\`\`sql
SELECT * FROM users;
\`\`\`

## Your mission

Write a query to select all columns from the \`courses\` table.`,
            starterCode: `-- Select all from courses
`,
            solutionCode: `SELECT * FROM courses;`,
            testCases: [
              { name: "select all", expected: "SELECT * FROM courses;" },
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
    description: "Pair-program with an AI assistant that writes code alongside you.",
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
        title: "Chapter 1: Getting Started",
        description: "Install Copilot and write your first AI-assisted code.",
        sortOrder: 1,
        exercises: [
          {
            id: "copilot_ex1_1",
            chapterId: "copilot_ch1",
            title: "1.1 Your First Suggestion",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# Your First Suggestion

GitHub Copilot suggests code as you type. Write a comment describing what you want, then press \`Tab\` to accept.

## Your mission

Write a function \`add(a, b)\` that returns the sum of two numbers, then log \`add(2, 3)\`.`,
            starterCode: `// Define add(a, b) and log add(2, 3)
`,
            solutionCode: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(2, 3));`,
            testCases: [
              { name: "logs 5", expected: "5\n" },
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
  makeSkeletonCourse("c_intjs", "intermediate-javascript", "Intermediate JavaScript", "intermediate", "🔧",
    "linear-gradient(135deg, #F7DF1E 0%, #323330 100%)", ["Web Development"], ["Web Development", "Intermediate"], 11, 134000),
  makeSkeletonCourse("c_intpy", "intermediate-python", "Intermediate Python", "intermediate", "🐍",
    "linear-gradient(135deg, #3776AB 0%, #FFD43B 100%)", ["Data Science"], ["Python", "Intermediate", "Data Science"], 13, 102000),
  makeSkeletonCourse("c_numpy", "numpy", "NumPy", "intermediate", "📊",
    "linear-gradient(135deg, #013243 0%, #4DABCF 100%)", ["Data Science"], ["Data Science", "Intermediate"], 8, 71000),
  makeSkeletonCourse("c_pandas", "pandas", "Pandas", "beginner", "🐼",
    "linear-gradient(135deg, #150458 0%, #FFCA00 100%)", ["Data Science"], ["Data Science", "Beginner"], 9, 84000),
  makeSkeletonCourse("c_matplotlib", "matplotlib", "Matplotlib", "intermediate", "📈",
    "linear-gradient(135deg, #11557C 0%, #4DABCF 100%)", ["Data Science"], ["Data Science", "Intermediate"], 7, 52000),
  makeSkeletonCourse("c_ml", "machine-learning", "Machine Learning", "intermediate", "🧠",
    "linear-gradient(135deg, #00B4D8 0%, #7C5CFC 100%)", ["Data Science", "Artificial Intelligence"], ["Data Science", "Intermediate"], 20, 156000),
  makeSkeletonCourse("c_genai", "genai", "GenAI", "intermediate", "✨",
    "linear-gradient(135deg, #FF6B9D 0%, #7C5CFC 100%)", ["Artificial Intelligence"], ["Intermediate"], 9, 98000),
  makeSkeletonCourse("c_dsa", "data-structures-algorithms", "Data Structures & Algorithms", "intermediate", "🌳",
    "linear-gradient(135deg, #4ECDC4 0%, #7C5CFC 100%)", ["Computer Science"], ["Intermediate"], 22, 178000),
  makeSkeletonCourse("c_p5js", "p5js", "p5.js", "intermediate", "🖼️",
    "linear-gradient(135deg, #ED225D 0%, #2B7FFF 100%)", [], ["Creative Coding", "Intermediate"], 8, 47000),
  makeSkeletonCourse("c_phaser", "phaser", "Phaser", "intermediate", "🎮",
    "linear-gradient(135deg, #FF6B9D 0%, #F0A04B 100%)", ["Game Development"], ["Creative Coding", "Intermediate"], 10, 39000),
  makeSkeletonCourse("c_lua", "lua", "Lua", "intermediate", "🌙",
    "linear-gradient(135deg, #2C2D72 0%, #000080 100%)", ["Game Development"], ["Intermediate"], 6, 28000),
  makeSkeletonCourse("c_uiux", "ui-ux-design", "UI/UX Design", "beginner", "🖌️",
    "linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%)", [], ["Tools", "Beginner"], 7, 61000),
  makeSkeletonCourse("c_cli", "command-line", "Command Line", "beginner", "⌨️",
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
    description: `${title} is one of the in-demand skills on Codédex. Start your adventure and level up!`,
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
        title: "Chapter 1: Introduction",
        description: "Get started with the fundamentals.",
        sortOrder: 1,
        exercises: [
          {
            id: `${id}_ex1_1`,
            chapterId: `${id}_ch1`,
            title: "1.1 Getting Started",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 10,
            contentMd: `# Getting Started\n\nWelcome to ${title}! This is a sample exercise to get you started.\n\n## Your mission\n\nPrint \`"Ready!"\` using console.log.`,
            starterCode: `// Print "Ready!"\n`,
            solutionCode: `console.log("Ready!");`,
            testCases: [{ name: "logs Ready!", expected: "Ready!\n" }],
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
