/**
 * 全局搜索辅助函数。
 *
 * 设计目标：
 * 1. 与数据源解耦：本文件不直接 import data/*，由调用方传入 SearchEntry[]
 *    这样 lib 可独立单测，不依赖 store / data 模块的副作用。
 * 2. 零依赖：仅用正则与字符串匹配，无需引入 fuse.js / flexSearch 等额外依赖。
 * 3. 可读性优先：评分逻辑保持线性、易解释，便于后续调优。
 */

export type SearchEntryType = "course" | "build" | "post" | "blog";

export interface SearchEntry {
  /** 条目类型，决定展示图标与分组 */
  type: SearchEntryType;
  /** 唯一 id（同类型内唯一即可，跨类型用 type+id 拼装作 key） */
  id: string;
  /** 主标题，命中权重最高 */
  title: string;
  /** 副标题/描述，命中权重次之 */
  subtitle?: string;
  /** 跳转链接 */
  href: string;
  /** 展示用 emoji 图标 */
  icon: string;
  /** 额外可搜索文本（如 tags、作者名），不展示，仅参与匹配 */
  keywords?: string;
}

/** 归一化：转小写 + 折叠连续空白。
 *  不做分词，因中文查询通常为整段输入，子串包含更符合直觉。 */
export function normalizeSearch(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** 单条目评分：
 *  整体匹配（不分词）：
 *  - 标题完全相等 100
 *  - 标题前缀命中 70
 *  - 标题包含 50
 *  分词匹配（按空格拆 token，取最大）：
 *  - 标题完全相等 60
 *  - 标题前缀命中 40
 *  - 标题包含 30
 *  - 副标题包含 15
 *  - 关键词包含 8
 *  整体匹配优先，确保用户输入完整标题时排在最前。
 *  无命中返回 0。 */
export function scoreEntry(entry: SearchEntry, query: string): number {
  const q = normalizeSearch(query);
  if (!q) return 0;
  const title = normalizeSearch(entry.title);
  const subtitle = normalizeSearch(entry.subtitle ?? "");
  const keywords = normalizeSearch(entry.keywords ?? "");

  // 整体匹配优先（不分词）
  if (title === q) return 100;
  if (title.startsWith(q)) return 70;
  if (title.includes(q)) return 50;

  // 分词匹配：每个 token 取最大命中分
  let best = 0;
  for (const token of q.split(" ")) {
    if (!token) continue;
    if (title === token) best = Math.max(best, 60);
    else if (title.startsWith(token)) best = Math.max(best, 40);
    else if (title.includes(token)) best = Math.max(best, 30);
    else if (subtitle.includes(token)) best = Math.max(best, 15);
    else if (keywords.includes(token)) best = Math.max(best, 8);
  }
  return best;
}

/** 按查询对条目过滤并排序：
 *  1. 评分 > 0 才入选
 *  2. 按分数降序
 *  3. 同分按标题字母序，保证结果稳定（避免每次重渲染顺序跳变）
 *  4. 限制 maxResults，避免一次性渲染过多 DOM */
export function searchEntries(
  entries: SearchEntry[],
  query: string,
  maxResults = 20,
): SearchEntry[] {
  const q = normalizeSearch(query);
  if (!q) return [];
  return entries
    .map((e) => ({ e, score: scoreEntry(e, q) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return a.e.title.localeCompare(b.e.title, "zh-Hans");
    })
    .slice(0, maxResults)
    .map((x) => x.e);
}
