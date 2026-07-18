import type { Language } from "@/types";

/**
 * 课程速查表数据
 *
 * 设计目标：
 * - 在课程详情页"资源"标签下展示常用语法卡片，方便学习者快速回顾
 * - 按语言分类，每条目包含代码片段与简短说明
 * - 内容精炼（每语言 6-10 条），聚焦入门最常用的语法
 */

export interface CheatItem {
  /** 语法说明 */
  label: string;
  /** 代码示例 */
  code: string;
}

export interface CheatSheet {
  /** 语言显示名 */
  title: string;
  /** 语言图标 emoji */
  emoji: string;
  /** 该语言的速查条目 */
  items: CheatItem[];
  /** 官方文档链接 */
  docsUrl: string;
}

/** 各语言的官方文档链接 */
const DOCS_URL: Record<Language, string> = {
  python: "https://docs.python.org/zh-cn/3/tutorial/",
  javascript: "https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide",
  typescript: "https://www.typescriptlang.org/zh/docs/",
  html: "https://developer.mozilla.org/zh-CN/docs/Web/HTML",
  css: "https://developer.mozilla.org/zh-CN/docs/Web/CSS",
  sql: "https://www.w3schools.com/sql/",
  cpp: "https://zh.cppreference.com/",
  java: "https://docs.oracle.com/javase/tutorial/",
  go: "https://tour.go-zh.org/",
  rust: "https://www.rust-lang.org/zh-CN/learn",
};

/** 各语言的速查表内容 */
const SHEETS: Partial<Record<Language, Omit<CheatSheet, "docsUrl">>> = {
  python: {
    title: "Python 速查表",
    emoji: "🐍",
    items: [
      { label: "打印输出", code: 'print("Hello")' },
      { label: "变量赋值", code: 'name = "Ada"' },
      { label: "条件语句", code: "if x > 0:\n    print('正数')" },
      { label: "循环", code: "for i in range(5):\n    print(i)" },
      { label: "列表", code: "nums = [1, 2, 3]\nnums.append(4)" },
      { label: "字典", code: 'd = {"a": 1, "b": 2}\nd["c"] = 3' },
      { label: "函数定义", code: "def add(a, b):\n    return a + b" },
      { label: "字符串格式化", code: 'f"Hello, {name}!"' },
    ],
  },
  javascript: {
    title: "JavaScript 速查表",
    emoji: "⚡",
    items: [
      { label: "打印输出", code: 'console.log("Hello");' },
      { label: "变量声明", code: "const name = 'Ada';\nlet count = 0;" },
      { label: "条件语句", code: "if (x > 0) {\n  console.log('正数');\n}" },
      { label: "循环", code: "for (let i = 0; i < 5; i++) {\n  console.log(i);\n}" },
      { label: "数组", code: "const nums = [1, 2, 3];\nnums.push(4);" },
      { label: "对象", code: "const obj = { a: 1, b: 2 };\nobj.c = 3;" },
      { label: "函数定义", code: "function add(a, b) {\n  return a + b;\n}" },
      { label: "箭头函数", code: "const add = (a, b) => a + b;" },
    ],
  },
  typescript: {
    title: "TypeScript 速查表",
    emoji: "📘",
    items: [
      { label: "类型注解", code: "let name: string = 'Ada';" },
      { label: "接口", code: "interface User {\n  id: number;\n  name: string;\n}" },
      { label: "类型别名", code: "type ID = number | string;" },
      { label: "泛型", code: "function id<T>(x: T): T {\n  return x;\n}" },
      { label: "联合类型", code: "let v: string | number;" },
      { label: "可选属性", code: "interface P {\n  name: string;\n  age?: number;\n}" },
    ],
  },
  html: {
    title: "HTML 速查表",
    emoji: "📄",
    items: [
      { label: "标题", code: "<h1>主标题</h1>\n<h2>次标题</h2>" },
      { label: "段落", code: "<p>这是一段文本</p>" },
      { label: "链接", code: '<a href="https://example.com">链接</a>' },
      { label: "图片", code: '<img src="cat.png" alt="一只猫">' },
      { label: "列表", code: "<ul>\n  <li>苹果</li>\n  <li>香蕉</li>\n</ul>" },
      { label: "表单输入", code: '<input type="text" placeholder="姓名">' },
      { label: "容器", code: '<div class="box">内容</div>' },
    ],
  },
  css: {
    title: "CSS 速查表",
    emoji: "🎨",
    items: [
      { label: "选择器", code: "p { color: purple; }" },
      { label: "类选择器", code: ".box { padding: 1rem; }" },
      { label: "ID 选择器", code: "#header { height: 60px; }" },
      { label: "盒模型", code: ".box {\n  margin: 10px;\n  padding: 8px;\n  border: 1px solid #ccc;\n}" },
      { label: "弹性布局", code: ".row {\n  display: flex;\n  gap: 1rem;\n  align-items: center;\n}" },
      { label: "网格布局", code: ".grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}" },
      { label: "响应式", code: "@media (max-width: 768px) {\n  .row { flex-direction: column; }\n}" },
    ],
  },
  sql: {
    title: "SQL 速查表",
    emoji: "🗄️",
    items: [
      { label: "查询", code: "SELECT name, age FROM users;" },
      { label: "条件筛选", code: "SELECT * FROM users\nWHERE age >= 18;" },
      { label: "排序", code: "SELECT * FROM users\nORDER BY age DESC;" },
      { label: "限制数量", code: "SELECT * FROM users\nLIMIT 10;" },
      { label: "插入", code: "INSERT INTO users (name, age)\nVALUES ('Ada', 30);" },
      { label: "更新", code: "UPDATE users SET age = 31\nWHERE name = 'Ada';" },
      { label: "聚合", code: "SELECT COUNT(*), AVG(age)\nFROM users;" },
    ],
  },
  cpp: {
    title: "C++ 速查表",
    emoji: "🔧",
    items: [
      { label: "打印输出", code: '#include <iostream>\nstd::cout << "Hello";' },
      { label: "变量", code: "int x = 10;\ndouble pi = 3.14;" },
      { label: "条件", code: "if (x > 0) {\n  std::cout << '正数';\n}" },
      { label: "循环", code: "for (int i = 0; i < 5; i++) {\n  std::cout << i;\n}" },
      { label: "函数", code: "int add(int a, int b) {\n  return a + b;\n}" },
      { label: "数组", code: "int nums[5] = {1, 2, 3, 4, 5};" },
    ],
  },
  java: {
    title: "Java 速查表",
    emoji: "☕",
    items: [
      { label: "打印输出", code: 'System.out.println("Hello");' },
      { label: "变量", code: "int x = 10;\nString name = \"Ada\";" },
      { label: "条件", code: "if (x > 0) {\n  System.out.println('正数');\n}" },
      { label: "循环", code: "for (int i = 0; i < 5; i++) {\n  System.out.println(i);\n}" },
      { label: "方法", code: "int add(int a, int b) {\n  return a + b;\n}" },
      { label: "数组", code: "int[] nums = {1, 2, 3};" },
    ],
  },
  go: {
    title: "Go 速查表",
    emoji: "🐹",
    items: [
      { label: "打印输出", code: 'fmt.Println("Hello")' },
      { label: "变量", code: 'name := "Ada"\nvar age int = 30' },
      { label: "条件", code: "if x > 0 {\n  fmt.Println('正数')\n}" },
      { label: "循环", code: "for i := 0; i < 5; i++ {\n  fmt.Println(i)\n}" },
      { label: "函数", code: "func add(a, b int) int {\n  return a + b\n}" },
      { label: "切片", code: "nums := []int{1, 2, 3}\nnums = append(nums, 4)" },
    ],
  },
  rust: {
    title: "Rust 速查表",
    emoji: "🦀",
    items: [
      { label: "打印输出", code: 'println!("Hello");' },
      { label: "变量", code: 'let name = "Ada";\nlet mut count = 0;' },
      { label: "条件", code: "if x > 0 {\n  println!(\"正数\");\n}" },
      { label: "循环", code: "for i in 0..5 {\n  println!(\"{}\", i);\n}" },
      { label: "函数", code: "fn add(a: i32, b: i32) -> i32 {\n  a + b\n}" },
      { label: "向量", code: "let mut v = vec![1, 2, 3];\nv.push(4);" },
    ],
  },
};

/**
 * 获取指定语言的速查表。
 * 未覆盖的语言返回 null，调用方负责回退展示。
 */
export function getCheatSheet(lang: Language): CheatSheet | null {
  const sheet = SHEETS[lang];
  if (!sheet) return null;
  return { ...sheet, docsUrl: DOCS_URL[lang] };
}

/** 获取语言的官方文档链接（即使没有速查表也能展示文档入口） */
export function getDocsUrl(lang: Language): string {
  return DOCS_URL[lang];
}
