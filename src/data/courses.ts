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
      {
        id: "py_ch4",
        courseId: "c_python",
        title: "第 4 章：函数",
        description: "把代码打包成可复用的函数，让程序更清晰。",
        sortOrder: 4,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex4_1",
            chapterId: "py_ch4",
            title: "4.1 定义函数",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 25,
            contentMd: `# 定义函数

用 \`def\` 定义函数，用 \`return\` 返回值：

\`\`\`python
def greet(name):
    return "Hello, " + name

print(greet("Ada"))
\`\`\`

## 你的任务

定义一个函数 \`double(x)\`，返回 \`x * 2\`，然后打印 \`double(21)\`。`,
            starterCode: `# 定义 double(x) 并打印 double(21)
`,
            solutionCode: `def double(x):\n    return x * 2\nprint(double(21))`,
            testCases: [
              { name: "打印 42", expected: "42\n" },
            ],
          },
          {
            id: "py_ex4_2",
            chapterId: "py_ch4",
            title: "4.2 多参数函数",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 30,
            contentMd: `# 多参数函数

函数可以接收多个参数：

\`\`\`python
def add(a, b):
    return a + b
\`\`\`

## 你的任务

定义函数 \`multiply(a, b)\`，返回 \`a * b\`。然后打印 \`multiply(6, 7)\`。`,
            starterCode: `# 定义 multiply(a, b) 并打印 multiply(6, 7)
`,
            solutionCode: `def multiply(a, b):\n    return a * b\nprint(multiply(6, 7))`,
            testCases: [
              { name: "打印 42", expected: "42\n" },
            ],
          },
          {
            id: "py_ex4_3",
            chapterId: "py_ch4",
            title: "4.3 默认参数",
            sortOrder: 3,
            type: "exercise",
            language: "python",
            xpReward: 30,
            contentMd: `# 默认参数

参数可以设置默认值：

\`\`\`python
def power(base, exp=2):
    return base ** exp

print(power(3))    # 9
print(power(3, 3)) # 27
\`\`\`

## 你的任务

定义函数 \`repeat(text, times=3)\`，返回 \`text\` 重复 \`times\` 次的结果。打印 \`repeat("Hi")\`。`,
            starterCode: `# 定义 repeat(text, times=3) 并打印 repeat("Hi")
`,
            solutionCode: `def repeat(text, times=3):\n    return text * times\nprint(repeat("Hi"))`,
            testCases: [
              { name: "打印 HiHiHi", expected: "HiHiHi\n" },
            ],
          },
          {
            id: "py_ex4_challenge",
            chapterId: "py_ch4",
            title: "挑战包：素数判断",
            sortOrder: 4,
            type: "challenge_pack",
            language: "python",
            xpReward: 50,
            contentMd: `# 🎯 挑战：素数判断

编写函数 \`is_prime(n)\`，判断 \`n\` 是否为素数（大于 1 且只能被 1 和自身整除）。

然后打印 2 到 10 之间所有素数，每行一个。

预期输出：
\`\`\`
2
3
5
7
\`\`\`

> 💡 提示：用 for 循环检查 2 到 n-1 是否有整除 n 的数。`,
            starterCode: `# 编写 is_prime(n) 并打印 2-10 的素数
`,
            solutionCode: `def is_prime(n):\n    if n <= 1:\n        return False\n    for i in range(2, n):\n        if n % i == 0:\n            return False\n    return True\nfor i in range(2, 11):\n    if is_prime(i):\n        print(i)`,
            testCases: [
              { name: "素数 2-10", expected: "2\n3\n5\n7\n" },
            ],
          },
        ],
      },
      {
        id: "py_ch5",
        courseId: "c_python",
        title: "第 5 章：列表与数据结构",
        description: "用列表存储多个值，掌握索引、切片与遍历。",
        sortOrder: 5,
        cutsceneUrl: "",
        exercises: [
          {
            id: "py_ex5_1",
            chapterId: "py_ch5",
            title: "5.1 创建列表",
            sortOrder: 1,
            type: "exercise",
            language: "python",
            xpReward: 25,
            contentMd: `# 创建列表

**列表**用方括号 \`[]\` 包裹多个值，用逗号分隔：

\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # apple
\`\`\`

## 你的任务

创建一个列表 \`colors\`，包含 \`"red"\`、\`"green"\`、\`"blue"\`。打印第一个元素。`,
            starterCode: `# 创建 colors 列表并打印第一个元素
`,
            solutionCode: `colors = ["red", "green", "blue"]\nprint(colors[0])`,
            testCases: [
              { name: "打印 red", expected: "red\n" },
            ],
          },
          {
            id: "py_ex5_2",
            chapterId: "py_ch5",
            title: "5.2 遍历列表",
            sortOrder: 2,
            type: "exercise",
            language: "python",
            xpReward: 30,
            contentMd: `# 遍历列表

用 \`for\` 直接遍历列表元素：

\`\`\`python
for fruit in fruits:
    print(fruit)
\`\`\`

## 你的任务

给定列表 \`nums = [10, 20, 30]\`，用 for 循环逐行打印每个数字。`,
            starterCode: `nums = [10, 20, 30]\n# 用 for 循环逐行打印
`,
            solutionCode: `nums = [10, 20, 30]\nfor n in nums:\n    print(n)`,
            testCases: [
              { name: "打印三个数", expected: "10\n20\n30\n" },
            ],
          },
          {
            id: "py_ex5_3",
            chapterId: "py_ch5",
            title: "5.3 列表求和",
            sortOrder: 3,
            type: "exercise",
            language: "python",
            xpReward: 30,
            contentMd: `# 列表求和

\`sum()\` 函数可以求列表总和：

\`\`\`python
total = sum([1, 2, 3])  # 6
\`\`\`

## 你的任务

给定 \`scores = [85, 90, 78, 92]\`，计算总分并打印。`,
            starterCode: `scores = [85, 90, 78, 92]\n# 计算并打印总分
`,
            solutionCode: `scores = [85, 90, 78, 92]\nprint(sum(scores))`,
            testCases: [
              { name: "打印 345", expected: "345\n" },
            ],
          },
          {
            id: "py_ex5_challenge",
            chapterId: "py_ch5",
            title: "挑战包：找出最大值",
            sortOrder: 4,
            type: "challenge_pack",
            language: "python",
            xpReward: 60,
            contentMd: `# 🎯 挑战：手动找最大值

编写函数 \`find_max(lst)\`，**不使用** \`max()\` 函数，手动遍历列表找出最大值。

打印 \`find_max([3, 7, 2, 9, 5])\` 的结果。

> 💡 提示：先假设第一个元素是最大值，然后逐个比较更新。`,
            starterCode: `# 编写 find_max(lst) 并打印结果
`,
            solutionCode: `def find_max(lst):\n    m = lst[0]\n    for x in lst:\n        if x > m:\n            m = x\n    return m\nprint(find_max([3, 7, 2, 9, 5]))`,
            testCases: [
              { name: "打印 9", expected: "9\n" },
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
          {
            id: "html_ex1_3",
            chapterId: "html_ch1",
            title: "1.3 链接",
            sortOrder: 3,
            type: "exercise",
            language: "html",
            xpReward: 15,
            contentMd: `# 链接

用 \`<a>\` 标签创建超链接，\`href\` 属性指定目标地址：

\`\`\`html
<a href="https://example.com">点击这里</a>
\`\`\`

## 你的任务

创建一个链接，文本为 **CodeGame**，指向 \`https://codegame.dev\`。`,
            starterCode: `<!-- 创建一个指向 codegame.dev 的链接 -->
`,
            solutionCode: `<a href="https://codegame.dev">CodeGame</a>`,
            testCases: [
              { name: "包含 a 标签和 href", expected: '<a href="https://codegame.dev">CodeGame</a>' },
            ],
          },
          {
            id: "html_ex1_4",
            chapterId: "html_ch1",
            title: "1.4 图片",
            sortOrder: 4,
            type: "exercise",
            language: "html",
            xpReward: 15,
            contentMd: `# 图片

用 \`<img>\` 标签插入图片，\`src\` 指定路径，\`alt\` 提供替代文本：

\`\`\`html
<img src="logo.png" alt="网站 Logo">
\`\`\`

## 你的任务

创建一个 \`<img>\` 标签，\`src\` 为 \`/images/cat.jpg\`，\`alt\` 为 \`一只猫\`。`,
            starterCode: `<!-- 插入一张图片 -->
`,
            solutionCode: `<img src="/images/cat.jpg" alt="一只猫">`,
            testCases: [
              { name: "包含 img 标签", expected: '<img src="/images/cat.jpg" alt="一只猫">' },
            ],
          },
        ],
      },
      {
        id: "html_ch2",
        courseId: "c_html",
        title: "第 2 章：列表与结构",
        description: "有序/无序列表、容器元素与页面骨架。",
        sortOrder: 2,
        exercises: [
          {
            id: "html_ex2_1",
            chapterId: "html_ch2",
            title: "2.1 无序列表",
            sortOrder: 1,
            type: "exercise",
            language: "html",
            xpReward: 20,
            contentMd: `# 无序列表

用 \`<ul>\` 包裹 \`<li>\` 创建无序列表：

\`\`\`html
<ul>
  <li>苹果</li>
  <li>香蕉</li>
</ul>
\`\`\`

## 你的任务

创建一个无序列表，包含两项：**Python** 和 **JavaScript**。`,
            starterCode: `<!-- 创建无序列表 -->
`,
            solutionCode: `<ul>\n  <li>Python</li>\n  <li>JavaScript</li>\n</ul>`,
            testCases: [
              { name: "包含 ul 和 li", expected: "<ul><li>Python</li><li>JavaScript</li></ul>" },
            ],
          },
          {
            id: "html_ex2_2",
            chapterId: "html_ch2",
            title: "2.2 有序列表",
            sortOrder: 2,
            type: "exercise",
            language: "html",
            xpReward: 20,
            contentMd: `# 有序列表

用 \`<ol>\` 替代 \`<ul>\` 即可创建带编号的有序列表：

\`\`\`html
<ol>
  <li>第一步</li>
  <li>第二步</li>
</ol>
\`\`\`

## 你的任务

创建一个有序列表，包含三项：**早上**、**中午**、**晚上**。`,
            starterCode: `<!-- 创建有序列表 -->
`,
            solutionCode: `<ol>\n  <li>早上</li>\n  <li>中午</li>\n  <li>晚上</li>\n</ol>`,
            testCases: [
              { name: "包含 ol 和三个 li", expected: "<ol><li>早上</li><li>中午</li><li>晚上</li></ol>" },
            ],
          },
          {
            id: "html_ex2_3",
            chapterId: "html_ch2",
            title: "2.3 容器 div",
            sortOrder: 3,
            type: "exercise",
            language: "html",
            xpReward: 20,
            contentMd: `# div 容器

\`<div>\` 是通用容器，用于分组内容：

\`\`\`html
<div class="card">
  <h2>标题</h2>
  <p>内容</p>
</div>
\`\`\`

## 你的任务

创建一个 \`<div>\`，\`class\` 为 \`"container"\`，内部包含一个 \`<p>\`，文本为 **Hello**。`,
            starterCode: `<!-- 创建 div.container 包含 p -->
`,
            solutionCode: `<div class="container">\n  <p>Hello</p>\n</div>`,
            testCases: [
              { name: "包含 div 和 p", expected: '<div class="container"><p>Hello</p></div>' },
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
          {
            id: "css_ex1_2",
            chapterId: "css_ch1",
            title: "1.2 字号",
            sortOrder: 2,
            type: "exercise",
            language: "css",
            xpReward: 15,
            contentMd: `# 字号

用 \`font-size\` 设置文字大小：

\`\`\`css
h1 {
  font-size: 32px;
}
\`\`\`

## 你的任务

把 \`<p>\` 的字号设为 \`18px\`。`,
            starterCode: `/* 设置 p 字号为 18px */
`,
            solutionCode: `p {\n  font-size: 18px;\n}`,
            testCases: [
              { name: "p 字号 18px", expected: "p { font-size: 18px; }" },
            ],
          },
          {
            id: "css_ex1_3",
            chapterId: "css_ch1",
            title: "1.3 背景色",
            sortOrder: 3,
            type: "exercise",
            language: "css",
            xpReward: 15,
            contentMd: `# 背景色

用 \`background-color\` 设置背景：

\`\`\`css
body {
  background-color: #f0f0f0;
}
\`\`\`

## 你的任务

把 \`body\` 的背景色设为 \`black\`。`,
            starterCode: `/* 设置 body 背景为黑色 */
`,
            solutionCode: `body {\n  background-color: black;\n}`,
            testCases: [
              { name: "body 背景黑色", expected: "body { background-color: black; }" },
            ],
          },
        ],
      },
      {
        id: "css_ch2",
        courseId: "c_css",
        title: "第 2 章：盒模型与布局",
        description: "内外边距、边框、Flex 布局基础。",
        sortOrder: 2,
        exercises: [
          {
            id: "css_ex2_1",
            chapterId: "css_ch2",
            title: "2.1 内边距",
            sortOrder: 1,
            type: "exercise",
            language: "css",
            xpReward: 20,
            contentMd: `# 内边距 padding

\`padding\` 控制内容与边框之间的距离：

\`\`\`css
.box {
  padding: 16px;
}
\`\`\`

## 你的任务

为 \`.card\` 设置 \`padding\` 为 \`24px\`。`,
            starterCode: `/* 为 .card 设置 padding */
`,
            solutionCode: `.card {\n  padding: 24px;\n}`,
            testCases: [
              { name: ".card padding 24px", expected: ".card { padding: 24px; }" },
            ],
          },
          {
            id: "css_ex2_2",
            chapterId: "css_ch2",
            title: "2.2 边框",
            sortOrder: 2,
            type: "exercise",
            language: "css",
            xpReward: 20,
            contentMd: `# 边框 border

\`border\` 简写：宽度、样式、颜色：

\`\`\`css
div {
  border: 1px solid #ccc;
}
\`\`\`

## 你的任务

为 \`img\` 设置边框：\`2px solid red\`。`,
            starterCode: `/* 为 img 设置红色边框 */
`,
            solutionCode: `img {\n  border: 2px solid red;\n}`,
            testCases: [
              { name: "img 边框", expected: "img { border: 2px solid red; }" },
            ],
          },
          {
            id: "css_ex2_3",
            chapterId: "css_ch2",
            title: "2.3 Flex 居中",
            sortOrder: 3,
            type: "exercise",
            language: "css",
            xpReward: 25,
            contentMd: `# Flex 居中

用 Flexbox 让内容水平垂直居中：

\`\`\`css
.container {
  display: flex;
  justify-content: center;
  align-items: center;
}
\`\`\`

## 你的任务

为 \`.center\` 设置 \`display: flex\`、\`justify-content: center\`、\`align-items: center\`。`,
            starterCode: `/* 让 .center 内容居中 */
`,
            solutionCode: `.center {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
            testCases: [
              { name: "flex 居中", expected: ".center { display: flex; justify-content: center; align-items: center; }" },
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
          {
            id: "js_ex1_3",
            chapterId: "js_ch1",
            title: "1.3 算术运算",
            sortOrder: 3,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# 算术运算

JS 支持加减乘除：

\`\`\`javascript
console.log(10 + 5);  // 15
console.log(10 - 3);  // 7
\`\`\`

## 你的任务

计算并打印 \`8 * 7\` 的结果。`,
            starterCode: `// 打印 8 * 7
`,
            solutionCode: `console.log(8 * 7);`,
            testCases: [
              { name: "输出 56", expected: "56\n" },
            ],
          },
          {
            id: "js_ex1_4",
            chapterId: "js_ch1",
            title: "1.4 字符串拼接",
            sortOrder: 4,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# 字符串拼接

用 \`+\` 拼接字符串：

\`\`\`javascript
const greeting = "Hello, " + "World!";
\`\`\`

## 你的任务

把 \`"Code"\` 和 \`"Game"\` 拼接并打印。`,
            starterCode: `// 拼接并打印
`,
            solutionCode: `console.log("Code" + "Game");`,
            testCases: [
              { name: "输出 CodeGame", expected: "CodeGame\n" },
            ],
          },
        ],
      },
      {
        id: "js_ch2",
        courseId: "c_javascript",
        title: "第 2 章：函数与数组",
        description: "函数定义、数组操作与箭头函数。",
        sortOrder: 2,
        exercises: [
          {
            id: "js_ex2_1",
            chapterId: "js_ch2",
            title: "2.1 定义函数",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 20,
            contentMd: `# 定义函数

用 \`function\` 关键字定义函数：

\`\`\`javascript
function greet(name) {
  return "Hi, " + name;
}
\`\`\`

## 你的任务

定义函数 \`add(a, b)\` 返回 \`a + b\`，打印 \`add(3, 4)\`。`,
            starterCode: `// 定义 add 并打印 add(3, 4)
`,
            solutionCode: `function add(a, b) {\n  return a + b;\n}\nconsole.log(add(3, 4));`,
            testCases: [
              { name: "输出 7", expected: "7\n" },
            ],
          },
          {
            id: "js_ex2_2",
            chapterId: "js_ch2",
            title: "2.2 箭头函数",
            sortOrder: 2,
            type: "exercise",
            language: "javascript",
            xpReward: 20,
            contentMd: `# 箭头函数

箭头函数是更简洁的函数写法：

\`\`\`javascript
const square = (x) => x * x;
\`\`\`

## 你的任务

用箭头函数定义 \`double(x)\` 返回 \`x * 2\`，打印 \`double(21)\`。`,
            starterCode: `// 用箭头函数定义 double
`,
            solutionCode: `const double = (x) => x * 2;\nconsole.log(double(21));`,
            testCases: [
              { name: "输出 42", expected: "42\n" },
            ],
          },
          {
            id: "js_ex2_3",
            chapterId: "js_ch2",
            title: "2.3 数组",
            sortOrder: 3,
            type: "exercise",
            language: "javascript",
            xpReward: 20,
            contentMd: `# 数组

数组用 \`[]\` 创建，用索引访问：

\`\`\`javascript
const nums = [10, 20, 30];
console.log(nums[0]);  // 10
\`\`\`

## 你的任务

创建数组 \`fruits\`，包含 \`"apple"\`、\`"banana"\`、\`"cherry"\`，打印第二个元素。`,
            starterCode: `// 创建数组并打印第二个元素
`,
            solutionCode: `const fruits = ["apple", "banana", "cherry"];\nconsole.log(fruits[1]);`,
            testCases: [
              { name: "输出 banana", expected: "banana\n" },
            ],
          },
          {
            id: "js_ex2_challenge",
            chapterId: "js_ch2",
            title: "挑战包：数组求和",
            sortOrder: 4,
            type: "challenge_pack",
            language: "javascript",
            xpReward: 50,
            contentMd: `# 🎯 挑战：数组求和

用 \`for\` 循环计算数组 \`[5, 10, 15, 20]\` 的总和并打印。

> 💡 提示：先定义一个累加变量 \`sum = 0\`，然后遍历数组累加。`,
            starterCode: `// 计算 [5, 10, 15, 20] 的总和
`,
            solutionCode: `const nums = [5, 10, 15, 20];\nlet sum = 0;\nfor (let i = 0; i < nums.length; i++) {\n  sum += nums[i];\n}\nconsole.log(sum);`,
            testCases: [
              { name: "输出 50", expected: "50\n" },
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
          {
            id: "sql_ex1_2",
            chapterId: "sql_ch1",
            title: "1.2 选择特定列",
            sortOrder: 2,
            type: "exercise",
            language: "sql",
            xpReward: 15,
            contentMd: `# 选择特定列

用逗号分隔列名，只查询需要的列：

\`\`\`sql
SELECT name, age FROM users;
\`\`\`

## 你的任务

从 \`products\` 表中选择 \`name\` 和 \`price\` 两列。`,
            starterCode: `-- 选择 name 和 price 两列
`,
            solutionCode: `SELECT name, price FROM products;`,
            testCases: [
              { name: "选择两列", expected: "SELECT name, price FROM products;" },
            ],
          },
          {
            id: "sql_ex1_3",
            chapterId: "sql_ch1",
            title: "1.3 WHERE 条件",
            sortOrder: 3,
            type: "exercise",
            language: "sql",
            xpReward: 20,
            contentMd: `# WHERE 条件

用 \`WHERE\` 筛选行：

\`\`\`sql
SELECT * FROM users WHERE age >= 18;
\`\`\`

## 你的任务

从 \`products\` 表中选择 \`price > 100\` 的所有行。`,
            starterCode: `-- 筛选 price > 100
`,
            solutionCode: `SELECT * FROM products WHERE price > 100;`,
            testCases: [
              { name: "WHERE 条件", expected: "SELECT * FROM products WHERE price > 100;" },
            ],
          },
        ],
      },
      {
        id: "sql_ch2",
        courseId: "c_sql",
        title: "第 2 章：排序与聚合",
        description: "ORDER BY 排序、COUNT/SUM 聚合与 GROUP BY 分组。",
        sortOrder: 2,
        exercises: [
          {
            id: "sql_ex2_1",
            chapterId: "sql_ch2",
            title: "2.1 ORDER BY 排序",
            sortOrder: 1,
            type: "exercise",
            language: "sql",
            xpReward: 20,
            contentMd: `# ORDER BY 排序

用 \`ORDER BY\` 对结果排序，\`DESC\` 表示降序：

\`\`\`sql
SELECT * FROM users ORDER BY age DESC;
\`\`\`

## 你的任务

从 \`products\` 表中选择全部，按 \`price\` 升序排列。`,
            starterCode: `-- 按 price 升序排列
`,
            solutionCode: `SELECT * FROM products ORDER BY price ASC;`,
            testCases: [
              { name: "ORDER BY", expected: "SELECT * FROM products ORDER BY price ASC;" },
            ],
          },
          {
            id: "sql_ex2_2",
            chapterId: "sql_ch2",
            title: "2.2 COUNT 计数",
            sortOrder: 2,
            type: "exercise",
            language: "sql",
            xpReward: 20,
            contentMd: `# COUNT 计数

\`COUNT(*)\` 统计行数：

\`\`\`sql
SELECT COUNT(*) FROM users;
\`\`\`

## 你的任务

统计 \`orders\` 表中的总行数。`,
            starterCode: `-- 统计 orders 总行数
`,
            solutionCode: `SELECT COUNT(*) FROM orders;`,
            testCases: [
              { name: "COUNT", expected: "SELECT COUNT(*) FROM orders;" },
            ],
          },
          {
            id: "sql_ex2_3",
            chapterId: "sql_ch2",
            title: "2.3 LIMIT 限制",
            sortOrder: 3,
            type: "exercise",
            language: "sql",
            xpReward: 20,
            contentMd: `# LIMIT 限制

\`LIMIT\` 限制返回行数：

\`\`\`sql
SELECT * FROM users LIMIT 10;
\`\`\`

## 你的任务

从 \`products\` 表中选择前 5 行。`,
            starterCode: `-- 只取前 5 行
`,
            solutionCode: `SELECT * FROM products LIMIT 5;`,
            testCases: [
              { name: "LIMIT", expected: "SELECT * FROM products LIMIT 5;" },
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
          {
            id: "copilot_ex1_2",
            chapterId: "copilot_ch1",
            title: "1.2 用注释引导生成",
            sortOrder: 2,
            type: "exercise",
            language: "javascript",
            xpReward: 20,
            contentMd: `# 用注释引导生成

清晰的注释能让 Copilot 生成更准确的代码。先写描述需求的注释，再按 \`Tab\` 接受建议。

## 你的任务

编写函数 \`isEven(n)\`，当 \`n\` 为偶数时返回 \`true\`，否则返回 \`false\`。打印 \`isEven(4)\`。`,
            starterCode: `// 定义 isEven(n) 并打印 isEven(4)
`,
            solutionCode: `function isEven(n) {\n  return n % 2 === 0;\n}\nconsole.log(isEven(4));`,
            testCases: [
              { name: "输出 true", expected: "true\n" },
            ],
          },
          {
            id: "copilot_ex1_3",
            chapterId: "copilot_ch1",
            title: "1.3 批量生成数组操作",
            sortOrder: 3,
            type: "exercise",
            language: "javascript",
            xpReward: 25,
            contentMd: `# 批量生成数组操作

Copilot 擅长识别常见模式。当你开始写数组遍历时，它会自动补全循环体。

## 你的任务

定义函数 \`sumArray(arr)\` 返回数组元素之和，打印 \`sumArray([1, 2, 3, 4])\`。`,
            starterCode: `// 定义 sumArray(arr) 并打印结果
`,
            solutionCode: `function sumArray(arr) {\n  let sum = 0;\n  for (const n of arr) {\n    sum += n;\n  }\n  return sum;\n}\nconsole.log(sumArray([1, 2, 3, 4]));`,
            testCases: [
              { name: "输出 10", expected: "10\n" },
            ],
          },
        ],
      },
    ],
  },
  // —— 以下为新增编程语言游戏（Go / Rust / TypeScript），含完整章节与练习 ——
  {
    id: "c_go",
    slug: "go",
    title: "Go",
    description: "学习 Go 语言——简洁、高效、天生支持并发的现代系统编程语言。",
    difficulty: "beginner",
    isNew: true,
    bannerGradient: "linear-gradient(135deg, #00ADD8 0%, #5DC9E2 100%)",
    icon: "🐹",
    estimatedHours: 12,
    learningJourney: ["Systems Programming"],
    tags: ["Systems Programming", "Beginner"],
    learnerCount: 88000,
    chapters: [
      {
        id: "go_ch1",
        courseId: "c_go",
        title: "第 1 章：Go 入门（初级）",
        description: "包、main 函数、fmt.Println 与变量声明。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "go_ex1_1",
            chapterId: "go_ch1",
            title: "1.1 Hello, Go!",
            sortOrder: 1,
            type: "exercise",
            language: "go",
            xpReward: 15,
            contentMd: `# Hello, Go!

每个 Go 程序都从 \`package main\` 开始，\`main()\` 是入口函数。用 \`fmt.Println()\` 输出：

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
\`\`\`

## 你的任务

编写一个完整的 Go 程序，打印 **Hello, Gopher!**`,
            starterCode: `package main

import "fmt"

func main() {
    // 打印 Hello, Gopher!
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, Gopher!")\n}`,
            testCases: [
              { name: "包含 Println", expected: `fmt.Println("Hello, Gopher!")` },
            ],
          },
          {
            id: "go_ex1_2",
            chapterId: "go_ch1",
            title: "1.2 变量声明",
            sortOrder: 2,
            type: "exercise",
            language: "go",
            xpReward: 20,
            contentMd: `# 变量声明

用 \`var\` 显式声明，或用 \`:=\` 短声明：

\`\`\`go
var name string = "Ada"
age := 25
\`\`\`

## 你的任务

用短声明 \`:=\` 创建变量 \`city\`，值为 \`"Tokyo"\`，然后用 \`fmt.Println\` 打印它。`,
            starterCode: `package main

import "fmt"

func main() {
    // 用 := 创建 city 并打印
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    city := "Tokyo"\n    fmt.Println(city)\n}`,
            testCases: [
              { name: "短声明与打印", expected: `city := "Tokyo"` },
            ],
          },
          {
            id: "go_ex1_3",
            chapterId: "go_ch1",
            title: "1.3 多变量打印",
            sortOrder: 3,
            type: "exercise",
            language: "go",
            xpReward: 20,
            contentMd: `# 多变量打印

\`fmt.Println\` 可以接收多个参数，用空格分隔输出：

\`\`\`go
fmt.Println("Name:", name, "Age:", age)
\`\`\`

## 你的任务

声明 \`name := "Go"\` 和 \`version := 1.22\`，用一次 \`fmt.Println\` 打印 \`Name: Go Version: 1.22\`。`,
            starterCode: `package main

import "fmt"

func main() {
    // 声明 name 和 version 并打印
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    name := "Go"\n    version := 1.22\n    fmt.Println("Name:", name, "Version:", version)\n}`,
            testCases: [
              { name: "多参数打印", expected: `fmt.Println("Name:", name, "Version:", version)` },
            ],
          },
        ],
      },
      {
        id: "go_ch2",
        courseId: "c_go",
        title: "第 2 章：控制流与函数（中级）",
        description: "if/for 控制流、函数定义与切片操作。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "go_ex2_1",
            chapterId: "go_ch2",
            title: "2.1 if 语句",
            sortOrder: 1,
            type: "exercise",
            language: "go",
            xpReward: 25,
            contentMd: `# if 语句

Go 的 if 不需要小括号，但花括号是必须的：

\`\`\`go
score := 85
if score >= 60 {
    fmt.Println("Pass")
} else {
    fmt.Println("Fail")
}
\`\`\`

## 你的任务

给定 \`temp := 30\`，如果 \`temp > 25\` 则打印 \`"Hot"\`。`,
            starterCode: `package main

import "fmt"

func main() {
    temp := 30
    // 如果 temp > 25 打印 Hot
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    temp := 30\n    if temp > 25 {\n        fmt.Println("Hot")\n    }\n}`,
            testCases: [
              { name: "if 条件", expected: `if temp > 25 {` },
            ],
          },
          {
            id: "go_ex2_2",
            chapterId: "go_ch2",
            title: "2.2 for 循环",
            sortOrder: 2,
            type: "exercise",
            language: "go",
            xpReward: 25,
            contentMd: `# for 循环

Go 只有 \`for\` 一种循环关键字：

\`\`\`go
for i := 0; i < 3; i++ {
    fmt.Println(i)
}
\`\`\`

## 你的任务

用 for 循环打印 1 到 5（含）。`,
            starterCode: `package main

import "fmt"

func main() {
    // for 循环打印 1-5
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 5; i++ {\n        fmt.Println(i)\n    }\n}`,
            testCases: [
              { name: "for 循环", expected: `for i := 1; i <= 5; i++ {` },
            ],
          },
          {
            id: "go_ex2_3",
            chapterId: "go_ch2",
            title: "2.3 定义函数",
            sortOrder: 3,
            type: "exercise",
            language: "go",
            xpReward: 30,
            contentMd: `# 定义函数

Go 函数用 \`func\` 定义，类型在参数名之后：

\`\`\`go
func add(a int, b int) int {
    return a + b
}
\`\`\`

## 你的任务

定义函数 \`multiply(a int, b int) int\` 返回 \`a * b\`，在 main 中打印 \`multiply(6, 7)\`。`,
            starterCode: `package main

import "fmt"

// 定义 multiply 函数

func main() {
    // 打印 multiply(6, 7)
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc multiply(a int, b int) int {\n    return a * b\n}\n\nfunc main() {\n    fmt.Println(multiply(6, 7))\n}`,
            testCases: [
              { name: "函数定义", expected: `func multiply(a int, b int) int {` },
            ],
          },
          {
            id: "go_ex2_debug",
            chapterId: "go_ch2",
            title: "调试挑战：修复循环边界",
            sortOrder: 4,
            type: "challenge_pack",
            language: "go",
            xpReward: 40,
            contentMd: `# 🐛 调试挑战：修复循环边界

下面的代码想打印 1 到 5，但有 bug——它打印了 0 到 4。

\`\`\`go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
\`\`\`

## 你的任务

修复循环，使其打印 1 到 5（含）。即 \`i\` 从 1 开始，到 5 结束。`,
            starterCode: `package main

import "fmt"

func main() {
    for i := 0; i < 5; i++ {
        fmt.Println(i)
    }
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc main() {\n    for i := 1; i <= 5; i++ {\n        fmt.Println(i)\n    }\n}`,
            testCases: [
              { name: "修复起始值", expected: `for i := 1; i <= 5; i++ {` },
            ],
          },
        ],
      },
      {
        id: "go_ch3",
        courseId: "c_go",
        title: "第 3 章：结构体与算法（高级）",
        description: "结构体、方法与算法实现实战。",
        sortOrder: 3,
        cutsceneUrl: "",
        exercises: [
          {
            id: "go_ex3_1",
            chapterId: "go_ch3",
            title: "3.1 结构体",
            sortOrder: 1,
            type: "exercise",
            language: "go",
            xpReward: 35,
            contentMd: `# 结构体

用 \`type\` 和 \`struct\` 定义自定义类型：

\`\`\`go
type Person struct {
    Name string
    Age  int
}

p := Person{Name: "Ada", Age: 30}
\`\`\`

## 你的任务

定义结构体 \`Rect\`，包含 \`Width\` 和 \`Height\` 两个 \`int\` 字段。在 main 中创建一个 \`Rect{Width: 4, Height: 5}\`。`,
            starterCode: `package main

import "fmt"

// 定义 Rect 结构体

func main() {
    // 创建 Rect 实例
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\ntype Rect struct {\n    Width  int\n    Height int\n}\n\nfunc main() {\n    r := Rect{Width: 4, Height: 5}\n    fmt.Println(r)\n}`,
            testCases: [
              { name: "结构体定义", expected: `type Rect struct {` },
              { name: "字段定义", expected: `Width  int` },
            ],
          },
          {
            id: "go_ex3_2",
            chapterId: "go_ch3",
            title: "3.2 方法",
            sortOrder: 2,
            type: "exercise",
            language: "go",
            xpReward: 35,
            contentMd: `# 方法

为类型定义方法，接收者在 \`func\` 与方法名之间：

\`\`\`go
func (r Rect) Area() int {
    return r.Width * r.Height
}
\`\`\`

## 你的任务

为 \`Rect\` 定义方法 \`Area() int\` 返回面积。在 main 中打印 \`r.Area()\`。`,
            starterCode: `package main

import "fmt"

type Rect struct {
    Width  int
    Height int
}

// 为 Rect 定义 Area 方法

func main() {
    r := Rect{Width: 4, Height: 5}
    // 打印面积
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\ntype Rect struct {\n    Width  int\n    Height int\n}\n\nfunc (r Rect) Area() int {\n    return r.Width * r.Height\n}\n\nfunc main() {\n    r := Rect{Width: 4, Height: 5}\n    fmt.Println(r.Area())\n}`,
            testCases: [
              { name: "方法定义", expected: `func (r Rect) Area() int {` },
            ],
          },
          {
            id: "go_ex3_challenge",
            chapterId: "go_ch3",
            title: "算法挑战：冒泡排序",
            sortOrder: 3,
            type: "challenge_pack",
            language: "go",
            xpReward: 60,
            contentMd: `# 🎯 算法挑战：冒泡排序

实现函数 \`bubbleSort(arr []int) []int\`，对整数切片进行升序排序。

冒泡排序核心思路：重复遍历数组，比较相邻元素，若顺序错误则交换。

## 你的任务

1. 定义 \`bubbleSort\` 函数
2. 在 main 中对 \`[]int{5, 2, 8, 1, 9}\` 排序并打印

> 💡 提示：用两层 for 循环，外层控制轮数，内层比较相邻元素。`,
            starterCode: `package main

import "fmt"

// 定义 bubbleSort

func main() {
    arr := []int{5, 2, 8, 1, 9}
    // 排序并打印
}
`,
            solutionCode: `package main\n\nimport "fmt"\n\nfunc bubbleSort(arr []int) []int {\n    n := len(arr)\n    for i := 0; i < n-1; i++ {\n        for j := 0; j < n-i-1; j++ {\n            if arr[j] > arr[j+1] {\n                arr[j], arr[j+1] = arr[j+1], arr[j]\n            }\n        }\n    }\n    return arr\n}\n\nfunc main() {\n    arr := []int{5, 2, 8, 1, 9}\n    fmt.Println(bubbleSort(arr))\n}`,
            testCases: [
              { name: "函数签名", expected: `func bubbleSort(arr []int) []int {` },
              { name: "交换逻辑", expected: `arr[j], arr[j+1] = arr[j+1], arr[j]` },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_rust",
    slug: "rust",
    title: "Rust",
    description: "学习 Rust——无 GC 的内存安全系统语言，所有权模型的革新者。",
    difficulty: "intermediate",
    isNew: true,
    bannerGradient: "linear-gradient(135deg, #CE422B 0%, #000000 100%)",
    icon: "🦀",
    estimatedHours: 16,
    learningJourney: ["Systems Programming"],
    tags: ["Systems Programming", "Intermediate"],
    learnerCount: 92000,
    chapters: [
      {
        id: "rust_ch1",
        courseId: "c_rust",
        title: "第 1 章：Rust 基础（中级）",
        description: "fn、let、println! 宏与基本类型。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "rust_ex1_1",
            chapterId: "rust_ch1",
            title: "1.1 Hello, Rust!",
            sortOrder: 1,
            type: "exercise",
            language: "rust",
            xpReward: 15,
            contentMd: `# Hello, Rust!

Rust 程序从 \`fn main()\` 开始。用 \`println!\` 宏输出（注意感叹号）：

\`\`\`rust
fn main() {
    println!("Hello, Rust!");
}
\`\`\`

## 你的任务

编写程序打印 **Hello, Rustacean!**`,
            starterCode: `fn main() {
    // 打印 Hello, Rustacean!
}
`,
            solutionCode: `fn main() {\n    println!("Hello, Rustacean!");\n}`,
            testCases: [
              { name: "println 宏", expected: `println!("Hello, Rustacean!")` },
            ],
          },
          {
            id: "rust_ex1_2",
            chapterId: "rust_ch1",
            title: "1.2 不可变变量",
            sortOrder: 2,
            type: "exercise",
            language: "rust",
            xpReward: 20,
            contentMd: `# 不可变变量

用 \`let\` 声明变量，默认不可变。需要修改时用 \`let mut\`：

\`\`\`rust
let x = 5;       // 不可变
let mut y = 10;  // 可变
y = 20;
\`\`\`

## 你的任务

用 \`let mut\` 声明 \`count\` 值为 \`0\`，然后赋值为 \`10\`，最后打印 \`count\`。`,
            starterCode: `fn main() {
    // 用 let mut 声明 count 并修改
}
`,
            solutionCode: `fn main() {\n    let mut count = 0;\n    count = 10;\n    println!("{}", count);\n}`,
            testCases: [
              { name: "mut 声明", expected: `let mut count = 0;` },
            ],
          },
          {
            id: "rust_ex1_3",
            chapterId: "rust_ch1",
            title: "1.3 格式化输出",
            sortOrder: 3,
            type: "exercise",
            language: "rust",
            xpReward: 20,
            contentMd: `# 格式化输出

用 \`{}\` 占位符插入变量值：

\`\`\`rust
let name = "Ada";
println!("Hello, {}!", name);
\`\`\`

## 你的任务

声明 \`lang = "Rust"\`，打印 \`I am learning Rust!\`（用 \`{}\` 占位符）。`,
            starterCode: `fn main() {
    // 声明 lang 并用 {} 打印
}
`,
            solutionCode: `fn main() {\n    let lang = "Rust";\n    println!("I am learning {}!", lang);\n}`,
            testCases: [
              { name: "格式化", expected: `println!("I am learning {}!", lang)` },
            ],
          },
        ],
      },
      {
        id: "rust_ch2",
        courseId: "c_rust",
        title: "第 2 章：控制流与所有权（中级）",
        description: "if/loop/match、所有权与 Vec 动态数组。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "rust_ex2_1",
            chapterId: "rust_ch2",
            title: "2.1 if 表达式",
            sortOrder: 1,
            type: "exercise",
            language: "rust",
            xpReward: 25,
            contentMd: `# if 表达式

\`\`\`rust
let score = 85;
if score >= 60 {
    println!("Pass");
} else {
    println!("Fail");
}
\`\`\`

## 你的任务

给定 \`temp = 30\`，如果 \`temp > 25\` 打印 \`"Hot"\`。`,
            starterCode: `fn main() {
    let temp = 30;
    // 如果 temp > 25 打印 Hot
}
`,
            solutionCode: `fn main() {\n    let temp = 30;\n    if temp > 25 {\n        println!("Hot");\n    }\n}`,
            testCases: [
              { name: "if 条件", expected: `if temp > 25 {` },
            ],
          },
          {
            id: "rust_ex2_2",
            chapterId: "rust_ch2",
            title: "2.2 loop 循环",
            sortOrder: 2,
            type: "exercise",
            language: "rust",
            xpReward: 25,
            contentMd: `# loop 与 for 循环

\`for\` 遍历范围：

\`\`\`rust
for i in 1..=5 {
    println!("{}", i);
}
\`\`\`

## 你的任务

用 \`for\` 循环打印 1 到 5（含）。使用 \`1..=5\` 范围语法。`,
            starterCode: `fn main() {
    // for 循环打印 1-5
}
`,
            solutionCode: `fn main() {\n    for i in 1..=5 {\n        println!("{}", i);\n    }\n}`,
            testCases: [
              { name: "for 范围", expected: `for i in 1..=5 {` },
            ],
          },
          {
            id: "rust_ex2_3",
            chapterId: "rust_ch2",
            title: "2.3 Vec 动态数组",
            sortOrder: 3,
            type: "exercise",
            language: "rust",
            xpReward: 30,
            contentMd: `# Vec 动态数组

\`Vec\` 是 Rust 的动态数组：

\`\`\`rust
let nums = vec![10, 20, 30];
println!("{}", nums[0]); // 10
\`\`\`

## 你的任务

用 \`vec!\` 创建包含 \`1, 2, 3\` 的 Vec，打印第一个元素。`,
            starterCode: `fn main() {
    // 创建 Vec 并打印第一个元素
}
`,
            solutionCode: `fn main() {\n    let nums = vec![1, 2, 3];\n    println!("{}", nums[0]);\n}`,
            testCases: [
              { name: "vec 宏", expected: `vec![1, 2, 3]` },
            ],
          },
          {
            id: "rust_ex2_debug",
            chapterId: "rust_ch2",
            title: "调试挑战：修复 mut",
            sortOrder: 4,
            type: "challenge_pack",
            language: "rust",
            xpReward: 40,
            contentMd: `# 🐛 调试挑战：修复不可变错误

下面的代码尝试修改变量 \`x\`，但编译器会报错——因为 \`let\` 默认不可变。

\`\`\`rust
let x = 5;
x = 10;
\`\`\`

## 你的任务

修复代码，使 \`x\` 可以被修改。打印修改后的 \`x\`。`,
            starterCode: `fn main() {
    let x = 5;
    x = 10;
    println!("{}", x);
}
`,
            solutionCode: `fn main() {\n    let mut x = 5;\n    x = 10;\n    println!("{}", x);\n}`,
            testCases: [
              { name: "添加 mut", expected: `let mut x = 5;` },
            ],
          },
        ],
      },
      {
        id: "rust_ch3",
        courseId: "c_rust",
        title: "第 3 章：结构体与算法（高级）",
        description: "struct、impl、trait 与算法实现。",
        sortOrder: 3,
        cutsceneUrl: "",
        exercises: [
          {
            id: "rust_ex3_1",
            chapterId: "rust_ch3",
            title: "3.1 结构体",
            sortOrder: 1,
            type: "exercise",
            language: "rust",
            xpReward: 35,
            contentMd: `# 结构体

\`\`\`rust
struct Point {
    x: f64,
    y: f64,
}

let p = Point { x: 1.0, y: 2.0 };
\`\`\`

## 你的任务

定义结构体 \`Rect\`，包含 \`width: f64\` 和 \`height: f64\`。在 main 中创建 \`Rect { width: 4.0, height: 5.0 }\`。`,
            starterCode: `fn main() {
    // 定义并创建 Rect
}
`,
            solutionCode: `struct Rect {\n    width: f64,\n    height: f64,\n}\n\nfn main() {\n    let r = Rect { width: 4.0, height: 5.0 };\n    println!("{} {}", r.width, r.height);\n}`,
            testCases: [
              { name: "结构体定义", expected: `struct Rect {` },
              { name: "字段", expected: `width: f64` },
            ],
          },
          {
            id: "rust_ex3_2",
            chapterId: "rust_ch3",
            title: "3.2 impl 方法",
            sortOrder: 2,
            type: "exercise",
            language: "rust",
            xpReward: 35,
            contentMd: `# impl 方法

用 \`impl\` 块为结构体定义方法：

\`\`\`rust
impl Rect {
    fn area(&self) -> f64 {
        self.width * self.height
    }
}
\`\`\`

## 你的任务

为 \`Rect\` 实现 \`area(&self) -> f64\` 方法。在 main 中打印 \`r.area()\`。`,
            starterCode: `struct Rect {
    width: f64,
    height: f64,
}

// 为 Rect 实现 area 方法

fn main() {
    let r = Rect { width: 4.0, height: 5.0 };
    // 打印面积
}
`,
            solutionCode: `struct Rect {\n    width: f64,\n    height: f64,\n}\n\nimpl Rect {\n    fn area(&self) -> f64 {\n        self.width * self.height\n    }\n}\n\nfn main() {\n    let r = Rect { width: 4.0, height: 5.0 };\n    println!("{}", r.area());\n}`,
            testCases: [
              { name: "impl 块", expected: `impl Rect {` },
              { name: "方法签名", expected: `fn area(&self) -> f64 {` },
            ],
          },
          {
            id: "rust_ex3_challenge",
            chapterId: "rust_ch3",
            title: "算法挑战：斐波那契",
            sortOrder: 3,
            type: "challenge_pack",
            language: "rust",
            xpReward: 60,
            contentMd: `# 🎯 算法挑战：斐波那契数列

实现函数 \`fib(n: u32) -> u32\`，返回第 n 个斐波那契数。

斐波那契数列：0, 1, 1, 2, 3, 5, 8, 13, 21, 34, ...
- fib(0) = 0
- fib(1) = 1
- fib(n) = fib(n-1) + fib(n-2)

## 你的任务

1. 定义 \`fib\` 函数
2. 在 main 中打印 \`fib(10)\`（应为 55）

> 💡 提示：用迭代法避免递归的性能问题。`,
            starterCode: `fn main() {
    // 定义 fib 并打印 fib(10)
}
`,
            solutionCode: `fn fib(n: u32) -> u32 {\n    if n == 0 { return 0; }\n    if n == 1 { return 1; }\n    let mut a = 0;\n    let mut b = 1;\n    for _ in 2..=n {\n        let temp = a + b;\n        a = b;\n        b = temp;\n    }\n    b\n}\n\nfn main() {\n    println!("{}", fib(10));\n}`,
            testCases: [
              { name: "函数签名", expected: `fn fib(n: u32) -> u32 {` },
              { name: "迭代逻辑", expected: `let temp = a + b;` },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_typescript",
    slug: "typescript",
    title: "TypeScript",
    description: "学习 TypeScript——JavaScript 的超集，用类型系统写出更安全的代码。",
    difficulty: "intermediate",
    isNew: true,
    bannerGradient: "linear-gradient(135deg, #3178C6 0%, #235A97 100%)",
    icon: "🔷",
    estimatedHours: 12,
    learningJourney: ["Web Development"],
    tags: ["Web Development", "Intermediate"],
    learnerCount: 156000,
    chapters: [
      {
        id: "ts_ch1",
        courseId: "c_typescript",
        title: "第 1 章：类型基础（中级）",
        description: "类型注解、接口与联合类型。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "ts_ex1_1",
            chapterId: "ts_ch1",
            title: "1.1 类型注解",
            sortOrder: 1,
            type: "exercise",
            language: "typescript",
            xpReward: 20,
            contentMd: `# 类型注解

TypeScript 在变量名后用 \`: type\` 注解类型：

\`\`\`typescript
let name: string = "Ada";
let age: number = 25;
let isStudent: boolean = true;
\`\`\`

## 你的任务

声明 \`const city: string\` 值为 \`"Tokyo"\`，并用 \`console.log\` 打印。`,
            starterCode: `// 声明带类型的 city 并打印
`,
            solutionCode: `const city: string = "Tokyo";\nconsole.log(city);`,
            testCases: [
              { name: "类型注解", expected: `const city: string = "Tokyo";` },
            ],
          },
          {
            id: "ts_ex1_2",
            chapterId: "ts_ch1",
            title: "1.2 函数类型",
            sortOrder: 2,
            type: "exercise",
            language: "typescript",
            xpReward: 25,
            contentMd: `# 函数类型

为参数和返回值添加类型：

\`\`\`typescript
function add(a: number, b: number): number {
    return a + b;
}
\`\`\`

## 你的任务

定义函数 \`multiply(a: number, b: number): number\`，返回 \`a * b\`，打印 \`multiply(6, 7)\`。`,
            starterCode: `// 定义 multiply 并打印
`,
            solutionCode: `function multiply(a: number, b: number): number {\n  return a * b;\n}\nconsole.log(multiply(6, 7));`,
            testCases: [
              { name: "函数类型", expected: `function multiply(a: number, b: number): number {` },
            ],
          },
          {
            id: "ts_ex1_3",
            chapterId: "ts_ch1",
            title: "1.3 接口",
            sortOrder: 3,
            type: "exercise",
            language: "typescript",
            xpReward: 30,
            contentMd: `# 接口 interface

接口定义对象的形状：

\`\`\`typescript
interface User {
    name: string;
    age: number;
}

const u: User = { name: "Ada", age: 30 };
\`\`\`

## 你的任务

定义接口 \`Point\`，包含 \`x: number\` 和 \`y: number\`。创建一个 \`Point\` 对象 \`{ x: 1, y: 2 }\` 并打印。`,
            starterCode: `// 定义 Point 接口并创建对象
`,
            solutionCode: `interface Point {\n  x: number;\n  y: number;\n}\nconst p: Point = { x: 1, y: 2 };\nconsole.log(p);`,
            testCases: [
              { name: "接口定义", expected: `interface Point {` },
              { name: "x 字段", expected: `x: number;` },
            ],
          },
        ],
      },
      {
        id: "ts_ch2",
        courseId: "c_typescript",
        title: "第 2 章：类型进阶（高级）",
        description: "联合类型、泛型与类型守卫。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "ts_ex2_1",
            chapterId: "ts_ch2",
            title: "2.1 联合类型",
            sortOrder: 1,
            type: "exercise",
            language: "typescript",
            xpReward: 30,
            contentMd: `# 联合类型

用 \`|\` 表示可以是多种类型之一：

\`\`\`typescript
let id: number | string;
id = 123;
id = "ABC";
\`\`\`

## 你的任务

声明 \`const value: number | string\` 值为 \`"hello"\`，并打印。`,
            starterCode: `// 声明联合类型并打印
`,
            solutionCode: `const value: number | string = "hello";\nconsole.log(value);`,
            testCases: [
              { name: "联合类型", expected: `const value: number | string = "hello";` },
            ],
          },
          {
            id: "ts_ex2_2",
            chapterId: "ts_ch2",
            title: "2.2 泛型函数",
            sortOrder: 2,
            type: "exercise",
            language: "typescript",
            xpReward: 35,
            contentMd: `# 泛型函数

泛型让函数适用于多种类型：

\`\`\`typescript
function identity<T>(value: T): T {
    return value;
}
\`\`\`

## 你的任务

定义泛型函数 \`first<T>(arr: T[]): T\` 返回数组第一个元素。打印 \`first([1, 2, 3])\`。`,
            starterCode: `// 定义泛型 first 并打印
`,
            solutionCode: `function first<T>(arr: T[]): T {\n  return arr[0];\n}\nconsole.log(first([1, 2, 3]));`,
            testCases: [
              { name: "泛型签名", expected: `function first<T>(arr: T[]): T {` },
            ],
          },
          {
            id: "ts_ex2_3",
            chapterId: "ts_ch2",
            title: "2.3 类型守卫",
            sortOrder: 3,
            type: "exercise",
            language: "typescript",
            xpReward: 35,
            contentMd: `# 类型守卫 typeof

\`typeof\` 缩小联合类型范围：

\`\`\`typescript
function process(value: number | string) {
    if (typeof value === "number") {
        return value * 2;
    }
    return value.length;
}
\`\`\`

## 你的任务

定义函数 \`describe(value: number | string): string\`：
- 若是 number，返回 \`"Number: " + value\`
- 若是 string，返回 \`"String: " + value\``,
            starterCode: `// 定义 describe 函数
`,
            solutionCode: `function describe(value: number | string): string {\n  if (typeof value === "number") {\n    return "Number: " + value;\n  }\n  return "String: " + value;\n}`,
            testCases: [
              { name: "typeof 守卫", expected: `typeof value === "number"` },
            ],
          },
          {
            id: "ts_ex2_debug",
            chapterId: "ts_ch2",
            title: "调试挑战：修复类型错误",
            sortOrder: 4,
            type: "challenge_pack",
            language: "typescript",
            xpReward: 45,
            contentMd: `# 🐛 调试挑战：修复类型错误

下面的代码有类型错误——函数声明返回 \`number\` 但实际返回了字符串。

\`\`\`typescript
function getAge(): number {
    return "25";
}
\`\`\`

## 你的任务

修复函数使其返回正确的 \`number\` 类型。打印 \`getAge()\`。`,
            starterCode: `function getAge(): number {
    return "25";
}
// console.log(getAge());
`,
            solutionCode: `function getAge(): number {\n  return 25;\n}\nconsole.log(getAge());`,
            testCases: [
              { name: "返回数字", expected: `return 25;` },
            ],
          },
        ],
      },
      {
        id: "ts_ch3",
        courseId: "c_typescript",
        title: "第 3 章：实战与算法（高级）",
        description: "面向对象、类型工具与算法实现。",
        sortOrder: 3,
        cutsceneUrl: "",
        exercises: [
          {
            id: "ts_ex3_1",
            chapterId: "ts_ch3",
            title: "3.1 类与继承",
            sortOrder: 1,
            type: "exercise",
            language: "typescript",
            xpReward: 35,
            contentMd: `# 类与继承

TypeScript 支持完整的面向对象：

\`\`\`typescript
class Animal {
    constructor(public name: string) {}
    speak(): string {
        return this.name + " makes a sound";
    }
}

class Dog extends Animal {
    speak(): string {
        return this.name + " barks";
    }
}
\`\`\`

## 你的任务

定义类 \`Shape\`，含构造函数 \`constructor(public color: string)\` 和方法 \`describe(): string\` 返回 \`"A " + this.color + " shape"\`。创建实例并打印 \`describe()\`。`,
            starterCode: `// 定义 Shape 类
`,
            solutionCode: `class Shape {\n  constructor(public color: string) {}\n  describe(): string {\n    return "A " + this.color + " shape";\n  }\n}\nconst s = new Shape("red");\nconsole.log(s.describe());`,
            testCases: [
              { name: "类定义", expected: `class Shape {` },
              { name: "构造函数", expected: `constructor(public color: string)` },
            ],
          },
          {
            id: "ts_ex3_2",
            chapterId: "ts_ch3",
            title: "3.2 类型别名与 Pick",
            sortOrder: 2,
            type: "exercise",
            language: "typescript",
            xpReward: 35,
            contentMd: `# 类型别名 type

用 \`type\` 创建类型别名，支持交叉类型 \`&\`：

\`\`\`typescript
type User = { name: string } & { age: number };
\`\`\`

## 你的任务

定义类型别名 \`Vec2 = { x: number; y: number }\`，创建 \`const v: Vec2 = { x: 3, y: 4 }\`，打印 \`v\`。`,
            starterCode: `// 定义 Vec2 类型别名
`,
            solutionCode: `type Vec2 = { x: number; y: number };\nconst v: Vec2 = { x: 3, y: 4 };\nconsole.log(v);`,
            testCases: [
              { name: "类型别名", expected: `type Vec2 = { x: number; y: number };` },
            ],
          },
          {
            id: "ts_ex3_challenge",
            chapterId: "ts_ch3",
            title: "算法挑战：泛型栈",
            sortOrder: 3,
            type: "challenge_pack",
            language: "typescript",
            xpReward: 60,
            contentMd: `# 🎯 算法挑战：泛型栈

实现一个泛型栈 \`Stack<T>\`，包含：
- \`push(item: T): void\` — 入栈
- \`pop(): T | undefined\` — 出栈并返回
- \`size(): number\` — 返回栈大小

## 你的任务

1. 定义 \`Stack<T>\` 类
2. 创建 \`const stack = new Stack<number>()\`
3. push 1、2、3，pop 一次并打印

> 💡 提示：内部用数组存储，push 用 \`array.push\`，pop 用 \`array.pop\`。`,
            starterCode: `// 实现 Stack<T> 并测试
`,
            solutionCode: `class Stack<T> {\n  private items: T[] = [];\n  push(item: T): void {\n    this.items.push(item);\n  }\n  pop(): T | undefined {\n    return this.items.pop();\n  }\n  size(): number {\n    return this.items.length;\n  }\n}\nconst stack = new Stack<number>();\nstack.push(1);\nstack.push(2);\nstack.push(3);\nconsole.log(stack.pop());`,
            testCases: [
              { name: "泛型类", expected: `class Stack<T> {` },
              { name: "push 方法", expected: `push(item: T): void {` },
              { name: "pop 方法", expected: `pop(): T | undefined {` },
            ],
          },
        ],
      },
    ],
  },
  // —— 以下课程仅用于列表展示，提供骨架章节 ——
  {
    id: "c_cpp",
    slug: "cpp",
    title: "C++",
    description: "学习 C++——高性能系统编程语言，从 iostream 输出到 STL 容器的基础实践。",
    difficulty: "intermediate",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #00599C 0%, #659AD2 100%)",
    icon: "⚙️",
    estimatedHours: 18,
    learningJourney: ["Computer Science"],
    tags: ["Intermediate"],
    learnerCount: 88000,
    chapters: [
      {
        id: "cpp_ch1",
        courseId: "c_cpp",
        title: "第 1 章：C++ 入门（中级）",
        description: "iostream、cout 输出、int 变量与 for 循环。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "cpp_ex1_1",
            chapterId: "cpp_ch1",
            title: "1.1 Hello, C++!",
            sortOrder: 1,
            type: "exercise",
            language: "cpp",
            xpReward: 20,
            contentMd: `# Hello, C++!

C++ 程序从 \`main()\` 函数开始。用 \`#include <iostream>\` 引入输入输出库，\`std::cout\` 输出文本：

\`\`\`cpp
#include <iostream>

int main() {
    std::cout << "Hello, C++!" << std::endl;
    return 0;
}
\`\`\`

## 你的任务

编写一个完整的 C++ 程序，打印 **Hello, Gopher!**`,
            starterCode: `#include <iostream>

int main() {
    // 打印 Hello, Gopher!
    return 0;
}
`,
            solutionCode: `#include <iostream>\n\nint main() {\n    std::cout << "Hello, Gopher!" << std::endl;\n    return 0;\n}`,
            testCases: [
              { name: "cout 输出", expected: `std::cout << "Hello, Gopher!"` },
            ],
          },
          {
            id: "cpp_ex1_2",
            chapterId: "cpp_ch1",
            title: "1.2 int 变量",
            sortOrder: 2,
            type: "exercise",
            language: "cpp",
            xpReward: 25,
            contentMd: `# int 变量

用 \`int\` 声明整数变量，用 \`=\` 赋值：

\`\`\`cpp
int age = 25;
int score = 90;
std::cout << age << std::endl;
\`\`\`

## 你的任务

声明 \`int city = 42\`，并用 \`std::cout\` 打印它。`,
            starterCode: `#include <iostream>

int main() {
    // 声明 int city 并打印
    return 0;
}
`,
            solutionCode: `#include <iostream>\n\nint main() {\n    int city = 42;\n    std::cout << city << std::endl;\n    return 0;\n}`,
            testCases: [
              { name: "int 声明", expected: `int city = 42;` },
            ],
          },
          {
            id: "cpp_ex1_3",
            chapterId: "cpp_ch1",
            title: "1.3 for 循环",
            sortOrder: 3,
            type: "exercise",
            language: "cpp",
            xpReward: 25,
            contentMd: `# for 循环

\`for\` 循环包含三部分：初始化、条件、递增：

\`\`\`cpp
for (int i = 0; i < 3; i++) {
    std::cout << i << std::endl;
}
\`\`\`

## 你的任务

用 for 循环打印 1 到 5（含）。`,
            starterCode: `#include <iostream>

int main() {
    // for 循环打印 1-5
    return 0;
}
`,
            solutionCode: `#include <iostream>\n\nint main() {\n    for (int i = 1; i <= 5; i++) {\n        std::cout << i << std::endl;\n    }\n    return 0;\n}`,
            testCases: [
              { name: "for 循环", expected: `for (int i = 1; i <= 5; i++) {` },
            ],
          },
        ],
      },
      {
        id: "cpp_ch2",
        courseId: "c_cpp",
        title: "第 2 章：控制流与函数（中级）",
        description: "if 判断、函数定义与 vector 容器。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "cpp_ex2_1",
            chapterId: "cpp_ch2",
            title: "2.1 if 判断",
            sortOrder: 1,
            type: "exercise",
            language: "cpp",
            xpReward: 30,
            contentMd: `# if 判断

\`if\` 根据条件决定是否执行代码块：

\`\`\`cpp
int score = 85;
if (score >= 60) {
    std::cout << "Pass" << std::endl;
}
\`\`\`

## 你的任务

给定 \`int temp = 30\`，如果 \`temp > 25\` 则打印 \`"Hot"\`。`,
            starterCode: `#include <iostream>

int main() {
    int temp = 30;
    // 如果 temp > 25 打印 Hot
    return 0;
}
`,
            solutionCode: `#include <iostream>\n\nint main() {\n    int temp = 30;\n    if (temp > 25) {\n        std::cout << "Hot" << std::endl;\n    }\n    return 0;\n}`,
            testCases: [
              { name: "if 条件", expected: `if (temp > 25) {` },
            ],
          },
          {
            id: "cpp_ex2_2",
            chapterId: "cpp_ch2",
            title: "2.2 定义函数",
            sortOrder: 2,
            type: "exercise",
            language: "cpp",
            xpReward: 30,
            contentMd: `# 定义函数

C++ 函数需要声明返回类型，参数也需要类型：

\`\`\`cpp
int add(int a, int b) {
    return a + b;
}
\`\`\`

## 你的任务

定义函数 \`int multiply(int a, int b)\` 返回 \`a * b\`，在 main 中打印 \`multiply(6, 7)\`。`,
            starterCode: `#include <iostream>

// 定义 multiply 函数

int main() {
    // 打印 multiply(6, 7)
    return 0;
}
`,
            solutionCode: `#include <iostream>\n\nint multiply(int a, int b) {\n    return a * b;\n}\n\nint main() {\n    std::cout << multiply(6, 7) << std::endl;\n    return 0;\n}`,
            testCases: [
              { name: "函数定义", expected: `int multiply(int a, int b) {` },
            ],
          },
          {
            id: "cpp_ex2_3",
            chapterId: "cpp_ch2",
            title: "2.3 vector 容器",
            sortOrder: 3,
            type: "exercise",
            language: "cpp",
            xpReward: 35,
            contentMd: `# vector 容器

\`std::vector\` 是 C++ 的动态数组，用 \`#include <vector>\` 引入：

\`\`\`cpp
std::vector<int> nums = {10, 20, 30};
std::cout << nums[0] << std::endl;  // 10
\`\`\`

## 你的任务

创建 \`std::vector<int>\` 包含 \`1, 2, 3\`，打印第一个元素。`,
            starterCode: `#include <iostream>
#include <vector>

int main() {
    // 创建 vector 并打印第一个元素
    return 0;
}
`,
            solutionCode: `#include <iostream>\n#include <vector>\n\nint main() {\n    std::vector<int> nums = {1, 2, 3};\n    std::cout << nums[0] << std::endl;\n    return 0;\n}`,
            testCases: [
              { name: "vector 声明", expected: `std::vector<int> nums = {1, 2, 3};` },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_java",
    slug: "java",
    title: "Java",
    description: "学习 Java——面向对象的跨平台编程语言，从 Hello World 到方法与数组。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #007396 0%, #E76F00 100%)",
    icon: "☕",
    estimatedHours: 16,
    learningJourney: ["Computer Science"],
    tags: ["Beginner"],
    learnerCount: 142000,
    chapters: [
      {
        id: "java_ch1",
        courseId: "c_java",
        title: "第 1 章：Java 入门（初级）",
        description: "System.out.println、int/String 变量与 for 循环。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "java_ex1_1",
            chapterId: "java_ch1",
            title: "1.1 Hello, Java!",
            sortOrder: 1,
            type: "exercise",
            language: "java",
            xpReward: 15,
            contentMd: `# Hello, Java!

Java 程序由类组成，\`main\` 是入口方法。用 \`System.out.println\` 输出：

\`\`\`java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
\`\`\`

## 你的任务

编写一个完整的 Java 程序，打印 **Hello, CodeGame!**`,
            starterCode: `public class Main {
    public static void main(String[] args) {
        // 打印 Hello, CodeGame!
    }
}
`,
            solutionCode: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello, CodeGame!");\n    }\n}`,
            testCases: [
              { name: "println 输出", expected: `System.out.println("Hello, CodeGame!");` },
            ],
          },
          {
            id: "java_ex1_2",
            chapterId: "java_ch1",
            title: "1.2 int 与 String 变量",
            sortOrder: 2,
            type: "exercise",
            language: "java",
            xpReward: 20,
            contentMd: `# int 与 String 变量

Java 是静态类型语言，声明变量时需要指定类型：

\`\`\`java
int age = 25;
String name = "Ada";
System.out.println(name);
\`\`\`

## 你的任务

声明 \`String city = "Tokyo"\`，并用 \`System.out.println\` 打印它。`,
            starterCode: `public class Main {
    public static void main(String[] args) {
        // 声明 city 并打印
    }
}
`,
            solutionCode: `public class Main {\n    public static void main(String[] args) {\n        String city = "Tokyo";\n        System.out.println(city);\n    }\n}`,
            testCases: [
              { name: "String 声明", expected: `String city = "Tokyo";` },
            ],
          },
          {
            id: "java_ex1_3",
            chapterId: "java_ch1",
            title: "1.3 for 循环",
            sortOrder: 3,
            type: "exercise",
            language: "java",
            xpReward: 20,
            contentMd: `# for 循环

Java 的 for 循环与 C 类似：

\`\`\`java
for (int i = 0; i < 3; i++) {
    System.out.println(i);
}
\`\`\`

## 你的任务

用 for 循环打印 1 到 5（含）。`,
            starterCode: `public class Main {
    public static void main(String[] args) {
        // for 循环打印 1-5
    }
}
`,
            solutionCode: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) {\n            System.out.println(i);\n        }\n    }\n}`,
            testCases: [
              { name: "for 循环", expected: `for (int i = 1; i <= 5; i++) {` },
            ],
          },
        ],
      },
      {
        id: "java_ch2",
        courseId: "c_java",
        title: "第 2 章：控制流与方法（初级）",
        description: "if/else 判断、方法定义与数组。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "java_ex2_1",
            chapterId: "java_ch2",
            title: "2.1 if/else 判断",
            sortOrder: 1,
            type: "exercise",
            language: "java",
            xpReward: 25,
            contentMd: `# if/else 判断

\`if\` 和 \`else\` 处理分支逻辑：

\`\`\`java
int score = 85;
if (score >= 60) {
    System.out.println("Pass");
} else {
    System.out.println("Fail");
}
\`\`\`

## 你的任务

给定 \`int temp = 30\`，如果 \`temp > 25\` 打印 \`"Hot"\`，否则打印 \`"Cool"\`。`,
            starterCode: `public class Main {
    public static void main(String[] args) {
        int temp = 30;
        // if/else 判断
    }
}
`,
            solutionCode: `public class Main {\n    public static void main(String[] args) {\n        int temp = 30;\n        if (temp > 25) {\n            System.out.println("Hot");\n        } else {\n            System.out.println("Cool");\n        }\n    }\n}`,
            testCases: [
              { name: "if 条件", expected: `if (temp > 25) {` },
            ],
          },
          {
            id: "java_ex2_2",
            chapterId: "java_ch2",
            title: "2.2 方法定义",
            sortOrder: 2,
            type: "exercise",
            language: "java",
            xpReward: 30,
            contentMd: `# 方法定义

Java 方法在类内部定义，需要返回类型和参数类型：

\`\`\`java
static int add(int a, int b) {
    return a + b;
}
\`\`\`

## 你的任务

定义方法 \`static int multiply(int a, int b)\` 返回 \`a * b\`，在 main 中打印 \`multiply(6, 7)\`。`,
            starterCode: `public class Main {
    // 定义 multiply 方法

    public static void main(String[] args) {
        // 打印 multiply(6, 7)
    }
}
`,
            solutionCode: `public class Main {\n    static int multiply(int a, int b) {\n        return a * b;\n    }\n\n    public static void main(String[] args) {\n        System.out.println(multiply(6, 7));\n    }\n}`,
            testCases: [
              { name: "方法定义", expected: `static int multiply(int a, int b) {` },
            ],
          },
          {
            id: "java_ex2_3",
            chapterId: "java_ch2",
            title: "2.3 数组",
            sortOrder: 3,
            type: "exercise",
            language: "java",
            xpReward: 30,
            contentMd: `# 数组

Java 数组用 \`{}\` 初始化，用索引访问：

\`\`\`java
int[] nums = {10, 20, 30};
System.out.println(nums[0]);  // 10
\`\`\`

## 你的任务

创建 \`int[]\` 数组包含 \`1, 2, 3\`，打印第二个元素。`,
            starterCode: `public class Main {
    public static void main(String[] args) {
        // 创建数组并打印第二个元素
    }
}
`,
            solutionCode: `public class Main {\n    public static void main(String[] args) {\n        int[] nums = {1, 2, 3};\n        System.out.println(nums[1]);\n    }\n}`,
            testCases: [
              { name: "数组声明", expected: `int[] nums = {1, 2, 3};` },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "c_csharp",
    slug: "csharp",
    title: "C#",
    description: "学习 C#——Microsoft 的现代面向对象语言，从控制台输出到类与方法。",
    difficulty: "beginner",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #9B4F96 0%, #239120 100%)",
    icon: "🎯",
    estimatedHours: 15,
    learningJourney: ["Game Development"],
    tags: ["Beginner"],
    learnerCount: 67000,
    chapters: [
      {
        id: "csharp_ch1",
        courseId: "c_csharp",
        title: "第 1 章：C# 入门（初级）",
        description: "Console.WriteLine、int/string 变量与 for 循环。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "csharp_ex1_1",
            chapterId: "csharp_ch1",
            title: "1.1 Hello, C#!",
            sortOrder: 1,
            type: "exercise",
            language: "java",
            xpReward: 15,
            contentMd: `# Hello, C#!

C# 程序由类和 \`Main\` 方法组成。用 \`Console.WriteLine\` 输出：

\`\`\`csharp
using System;

class Program {
    static void Main() {
        Console.WriteLine("Hello, C#!");
    }
}
\`\`\`

## 你的任务

编写一个完整的 C# 程序，打印 **Hello, CodeGame!**`,
            starterCode: `using System;

class Program {
    static void Main() {
        // 打印 Hello, CodeGame!
    }
}
`,
            solutionCode: `using System;\n\nclass Program {\n    static void Main() {\n        Console.WriteLine("Hello, CodeGame!");\n    }\n}`,
            testCases: [
              { name: "Console.WriteLine", expected: `Console.WriteLine("Hello, CodeGame!");` },
            ],
          },
          {
            id: "csharp_ex1_2",
            chapterId: "csharp_ch1",
            title: "1.2 int 与 string 变量",
            sortOrder: 2,
            type: "exercise",
            language: "java",
            xpReward: 20,
            contentMd: `# int 与 string 变量

C# 是静态类型语言，声明变量时指定类型。注意 string 是小写：

\`\`\`csharp
int age = 25;
string name = "Ada";
Console.WriteLine(name);
\`\`\`

## 你的任务

声明 \`string city = "Tokyo"\`，并用 \`Console.WriteLine\` 打印它。`,
            starterCode: `using System;

class Program {
    static void Main() {
        // 声明 city 并打印
    }
}
`,
            solutionCode: `using System;\n\nclass Program {\n    static void Main() {\n        string city = "Tokyo";\n        Console.WriteLine(city);\n    }\n}`,
            testCases: [
              { name: "string 声明", expected: `string city = "Tokyo";` },
            ],
          },
          {
            id: "csharp_ex1_3",
            chapterId: "csharp_ch1",
            title: "1.3 for 循环",
            sortOrder: 3,
            type: "exercise",
            language: "java",
            xpReward: 20,
            contentMd: `# for 循环

C# 的 for 循环语法：

\`\`\`csharp
for (int i = 0; i < 3; i++) {
    Console.WriteLine(i);
}
\`\`\`

## 你的任务

用 for 循环打印 1 到 5（含）。`,
            starterCode: `using System;

class Program {
    static void Main() {
        // for 循环打印 1-5
    }
}
`,
            solutionCode: `using System;\n\nclass Program {\n    static void Main() {\n        for (int i = 1; i <= 5; i++) {\n            Console.WriteLine(i);\n        }\n    }\n}`,
            testCases: [
              { name: "for 循环", expected: `for (int i = 1; i <= 5; i++) {` },
            ],
          },
        ],
      },
      {
        id: "csharp_ch2",
        courseId: "c_csharp",
        title: "第 2 章：控制流与方法（初级）",
        description: "if 判断、方法定义与类。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "csharp_ex2_1",
            chapterId: "csharp_ch2",
            title: "2.1 if 判断",
            sortOrder: 1,
            type: "exercise",
            language: "java",
            xpReward: 25,
            contentMd: `# if 判断

\`if\` 根据条件执行代码块：

\`\`\`csharp
int score = 85;
if (score >= 60) {
    Console.WriteLine("Pass");
}
\`\`\`

## 你的任务

给定 \`int temp = 30\`，如果 \`temp > 25\` 则打印 \`"Hot"\`。`,
            starterCode: `using System;

class Program {
    static void Main() {
        int temp = 30;
        // 如果 temp > 25 打印 Hot
    }
}
`,
            solutionCode: `using System;\n\nclass Program {\n    static void Main() {\n        int temp = 30;\n        if (temp > 25) {\n            Console.WriteLine("Hot");\n        }\n    }\n}`,
            testCases: [
              { name: "if 条件", expected: `if (temp > 25) {` },
            ],
          },
          {
            id: "csharp_ex2_2",
            chapterId: "csharp_ch2",
            title: "2.2 方法定义",
            sortOrder: 2,
            type: "exercise",
            language: "java",
            xpReward: 30,
            contentMd: `# 方法定义

C# 方法在类内部定义，需要返回类型和参数类型：

\`\`\`csharp
static int Add(int a, int b) {
    return a + b;
}
\`\`\`

## 你的任务

定义方法 \`static int Multiply(int a, int b)\` 返回 \`a * b\`，在 Main 中打印 \`Multiply(6, 7)\`。`,
            starterCode: `using System;

class Program {
    // 定义 Multiply 方法

    static void Main() {
        // 打印 Multiply(6, 7)
    }
}
`,
            solutionCode: `using System;\n\nclass Program {\n    static int Multiply(int a, int b) {\n        return a * b;\n    }\n\n    static void Main() {\n        Console.WriteLine(Multiply(6, 7));\n    }\n}`,
            testCases: [
              { name: "方法定义", expected: `static int Multiply(int a, int b) {` },
            ],
          },
          {
            id: "csharp_ex2_3",
            chapterId: "csharp_ch2",
            title: "2.3 类定义",
            sortOrder: 3,
            type: "exercise",
            language: "java",
            xpReward: 35,
            contentMd: `# 类定义

C# 是面向对象语言，用 \`class\` 定义类：

\`\`\`csharp
class Person {
    public string Name;
    public int Age;

    public Person(string name, int age) {
        Name = name;
        Age = age;
    }
}
\`\`\`

## 你的任务

定义类 \`Rect\`，包含 \`public int Width\` 和 \`public int Height\` 字段，以及构造函数 \`Rect(int w, int h)\`。在 Main 中创建 \`new Rect(4, 5)\` 并打印 Width。`,
            starterCode: `using System;

// 定义 Rect 类

class Program {
    static void Main() {
        // 创建 Rect 实例并打印 Width
    }
}
`,
            solutionCode: `using System;\n\nclass Rect {\n    public int Width;\n    public int Height;\n\n    public Rect(int w, int h) {\n        Width = w;\n        Height = h;\n    }\n}\n\nclass Program {\n    static void Main() {\n        Rect r = new Rect(4, 5);\n        Console.WriteLine(r.Width);\n    }\n}`,
            testCases: [
              { name: "类定义", expected: `class Rect {` },
              { name: "构造函数", expected: `public Rect(int w, int h) {` },
            ],
          },
        ],
      },
    ],
  },
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
  {
    id: "c_lua",
    slug: "lua",
    title: "Lua",
    description: "学习 Lua——轻量级脚本语言，游戏开发的常用选择，从 print 到 table。",
    difficulty: "intermediate",
    isNew: false,
    bannerGradient: "linear-gradient(135deg, #2C2D72 0%, #000080 100%)",
    icon: "🌙",
    estimatedHours: 6,
    learningJourney: ["Game Development"],
    tags: ["Intermediate"],
    learnerCount: 28000,
    chapters: [
      {
        id: "lua_ch1",
        courseId: "c_lua",
        title: "第 1 章：Lua 入门（中级）",
        description: "print 函数、local 变量与 for 循环。",
        sortOrder: 1,
        cutsceneUrl: "",
        exercises: [
          {
            id: "lua_ex1_1",
            chapterId: "lua_ch1",
            title: "1.1 Hello, Lua!",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 15,
            contentMd: `# Hello, Lua!

Lua 用 \`print\` 函数输出文本：

\`\`\`lua
print("Hello, Lua!")
\`\`\`

## 你的任务

打印 **Hello, CodeGame!**`,
            starterCode: `-- 打印 Hello, CodeGame!
`,
            solutionCode: `print("Hello, CodeGame!")`,
            testCases: [
              { name: "print 输出", expected: `print("Hello, CodeGame!")` },
            ],
          },
          {
            id: "lua_ex1_2",
            chapterId: "lua_ch1",
            title: "1.2 local 变量",
            sortOrder: 2,
            type: "exercise",
            language: "javascript",
            xpReward: 20,
            contentMd: `# local 变量

用 \`local\` 声明局部变量，Lua 是动态类型：

\`\`\`lua
local name = "Ada"
local age = 25
print(name)
\`\`\`

## 你的任务

声明 \`local city = "Tokyo"\`，并用 \`print\` 打印它。`,
            starterCode: `-- 声明 local city 并打印
`,
            solutionCode: `local city = "Tokyo"\nprint(city)`,
            testCases: [
              { name: "local 声明", expected: `local city = "Tokyo"` },
            ],
          },
          {
            id: "lua_ex1_3",
            chapterId: "lua_ch1",
            title: "1.3 for 循环",
            sortOrder: 3,
            type: "exercise",
            language: "javascript",
            xpReward: 20,
            contentMd: `# for 循环

Lua 的数值 for 循环：

\`\`\`lua
for i = 1, 3 do
    print(i)
end
\`\`\`

## 你的任务

用 for 循环打印 1 到 5（含）。`,
            starterCode: `-- for 循环打印 1-5
`,
            solutionCode: `for i = 1, 5 do\n    print(i)\nend`,
            testCases: [
              { name: "for 循环", expected: `for i = 1, 5 do` },
            ],
          },
        ],
      },
      {
        id: "lua_ch2",
        courseId: "c_lua",
        title: "第 2 章：控制流与函数（中级）",
        description: "if/then/end、function 定义与 table 表。",
        sortOrder: 2,
        cutsceneUrl: "",
        exercises: [
          {
            id: "lua_ex2_1",
            chapterId: "lua_ch2",
            title: "2.1 if/then/end 判断",
            sortOrder: 1,
            type: "exercise",
            language: "javascript",
            xpReward: 25,
            contentMd: `# if/then/end 判断

Lua 的 if 语句以 \`then\` 开始代码块，以 \`end\` 结束：

\`\`\`lua
local score = 85
if score >= 60 then
    print("Pass")
end
\`\`\`

## 你的任务

给定 \`local temp = 30\`，如果 \`temp > 25\` 则打印 \`"Hot"\`。`,
            starterCode: `local temp = 30
-- 如果 temp > 25 打印 Hot
`,
            solutionCode: `local temp = 30\nif temp > 25 then\n    print("Hot")\nend`,
            testCases: [
              { name: "if 条件", expected: `if temp > 25 then` },
            ],
          },
          {
            id: "lua_ex2_2",
            chapterId: "lua_ch2",
            title: "2.2 function 函数",
            sortOrder: 2,
            type: "exercise",
            language: "javascript",
            xpReward: 30,
            contentMd: `# function 函数

用 \`function\` 关键字定义函数：

\`\`\`lua
function add(a, b)
    return a + b
end

print(add(3, 4))
\`\`\`

## 你的任务

定义函数 \`multiply(a, b)\` 返回 \`a * b\`，并打印 \`multiply(6, 7)\`。`,
            starterCode: `-- 定义 multiply 并打印 multiply(6, 7)
`,
            solutionCode: `function multiply(a, b)\n    return a * b\nend\nprint(multiply(6, 7))`,
            testCases: [
              { name: "函数定义", expected: `function multiply(a, b)` },
            ],
          },
          {
            id: "lua_ex2_3",
            chapterId: "lua_ch2",
            title: "2.3 table 表",
            sortOrder: 3,
            type: "exercise",
            language: "javascript",
            xpReward: 35,
            contentMd: `# table 表

\`table\` 是 Lua 唯一的数据结构，用 \`{}\` 创建。Lua 索引从 1 开始：

\`\`\`lua
local fruits = {"apple", "banana", "cherry"}
print(fruits[1])  -- apple
\`\`\`

## 你的任务

创建 \`local colors = {"red", "green", "blue"}\`，打印第一个元素（索引为 1）。`,
            starterCode: `-- 创建 colors 表并打印第一个元素
`,
            solutionCode: `local colors = {"red", "green", "blue"}\nprint(colors[1])`,
            testCases: [
              { name: "table 创建", expected: `local colors = {"red", "green", "blue"}` },
            ],
          },
        ],
      },
    ],
  },
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
