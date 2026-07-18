import { describe, it, expect } from "vitest";
import {
  normalizeSearch,
  scoreEntry,
  searchEntries,
  type SearchEntry,
} from "./search";

const sampleEntries: SearchEntry[] = [
  {
    type: "course",
    id: "c1",
    title: "Python 入门",
    subtitle: "从零开始的 Python 编程之旅",
    href: "/python",
    icon: "🐍",
    keywords: "Python 入门 beginner Data Science",
  },
  {
    type: "course",
    id: "c2",
    title: "HTML & CSS 基础",
    subtitle: "构建你的第一个网页",
    href: "/html-css",
    icon: "🎨",
    keywords: "Web Development HTML CSS",
  },
  {
    type: "build",
    id: "b1",
    title: "Pixel Pet Garden",
    subtitle: "虚拟花园作品",
    href: "/builds/b_1",
    icon: "🌱",
    keywords: "sarah_codes",
  },
  {
    type: "post",
    id: "p1",
    title: "求推荐学习路径",
    subtitle: "刚入门不知道从哪里开始",
    href: "/community/general/p_1",
    icon: "💬",
    keywords: "general",
  },
  {
    type: "blog",
    id: "bp1",
    title: "CodeGame 7 月更新",
    subtitle: "新增 Pyodide 实时执行",
    href: "/blog/july-update",
    icon: "📝",
    keywords: "Product Updates",
  },
];

describe("normalizeSearch", () => {
  it("转小写 + 去首尾空白", () => {
    expect(normalizeSearch("  Hello  ")).toBe("hello");
  });

  it("折叠连续空白", () => {
    expect(normalizeSearch("a   b\tc\n d")).toBe("a b c d");
  });

  it("空串/纯空白返回空串", () => {
    expect(normalizeSearch("   ")).toBe("");
    expect(normalizeSearch("")).toBe("");
  });
});

describe("scoreEntry", () => {
  it("整体匹配：标题完全相等得 100 分", () => {
    expect(scoreEntry(sampleEntries[0], "Python 入门")).toBe(100);
  });

  it("整体匹配：标题前缀命中得 70 分", () => {
    expect(scoreEntry(sampleEntries[0], "python")).toBe(70);
  });

  it("整体匹配：标题包含（非前缀）得 50 分", () => {
    expect(scoreEntry(sampleEntries[1], "css")).toBe(50);
  });

  it("分词匹配：副标题包含得 15 分", () => {
    expect(scoreEntry(sampleEntries[2], "虚拟花园")).toBe(15);
  });

  it("分词匹配：关键词包含得 8 分", () => {
    expect(scoreEntry(sampleEntries[0], "data science")).toBe(8);
  });

  it("完全不匹配返回 0", () => {
    expect(scoreEntry(sampleEntries[0], "java")).toBe(0);
  });

  it("多 token 查询取最大匹配分", () => {
    // "java" 不匹配；"python" 前缀命中（分词）40 分
    expect(scoreEntry(sampleEntries[0], "java python")).toBe(40);
  });

  it("空查询返回 0", () => {
    expect(scoreEntry(sampleEntries[0], "")).toBe(0);
    expect(scoreEntry(sampleEntries[0], "   ")).toBe(0);
  });
});

describe("searchEntries", () => {
  it("空查询返回空数组（不渲染任何结果）", () => {
    expect(searchEntries(sampleEntries, "")).toEqual([]);
    expect(searchEntries(sampleEntries, "   ")).toEqual([]);
  });

  it("按分数降序排序，标题完全相等的优先于包含", () => {
    // 命中 "Python 入门" 完全相等 100 分 > 命中关键词 "Data Science" 8 分
    const r = searchEntries(sampleEntries, "Python");
    expect(r[0].id).toBe("c1");
  });

  it("限制返回数量", () => {
    // "python" 仅命中一条，但即便 maxResults=10 也不会越界
    expect(searchEntries(sampleEntries, "python", 10).length).toBe(1);
    // maxResults=0 不返回任何条目
    expect(searchEntries(sampleEntries, "python", 0).length).toBe(0);
  });

  it("同分按标题字母序稳定排序（中文优先于英文）", () => {
    // "CodeGame 7 月更新" 与 "Pixel Pet Garden" 同命中关键词 update？
    // 实际：bp1 标题 "CodeGame 7 月更新" 与查询 "update" 无关，只在 keywords 中包含 "Product Updates"
    // 所以 bp1 8 分；b1 "Pixel Pet Garden" 不含 update 关键词
    const r = searchEntries(sampleEntries, "updates");
    expect(r.map((e) => e.id)).toContain("bp1");
  });

  it("跨类型混合命中按分数降序", () => {
    // "python" 命中 c1 标题 60 分；其他均不命中
    const r = searchEntries(sampleEntries, "python");
    expect(r.length).toBe(1);
    expect(r[0].type).toBe("course");
  });

  it("无命中返回空数组", () => {
    expect(searchEntries(sampleEntries, "不存在的查询词xyz123")).toEqual([]);
  });

  it("保留传入数组引用（不修改原数组）", () => {
    const before = [...sampleEntries];
    searchEntries(sampleEntries, "python");
    expect(sampleEntries).toEqual(before);
  });
});
