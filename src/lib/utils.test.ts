import { describe, it, expect } from "vitest";
import {
  cn,
  formatNumber,
  xpForLevel,
  levelFromXp,
  timeAgo,
  genId,
} from "./utils";

describe("cn", () => {
  it("合并多个类名", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("处理条件 falsy 值", () => {
    expect(cn("a", false, null, undefined, "b")).toBe("a b");
  });

  it("Tailwind 冲突时后者胜出", () => {
    // twMerge 行为：相同性质的类名后者覆盖前者
    expect(cn("px-2", "px-4")).toBe("px-4");
  });

  it("支持对象写法", () => {
    expect(cn({ active: true, disabled: false })).toBe("active");
  });
});

describe("formatNumber", () => {
  it("小于 1000 直接返回字符串", () => {
    expect(formatNumber(0)).toBe("0");
    expect(formatNumber(42)).toBe("42");
    expect(formatNumber(999)).toBe("999");
  });

  it("千位转 K", () => {
    expect(formatNumber(1000)).toBe("1K");
    expect(formatNumber(1500)).toBe("1.5K");
    expect(formatNumber(9999)).toBe("10K");
  });

  it("百万位转 M", () => {
    expect(formatNumber(1_000_000)).toBe("1M");
    expect(formatNumber(1_750_000)).toBe("1.75M");
  });

  it("整数十万 / 整数百万去除多余小数", () => {
    // 200K 而非 200.0K
    expect(formatNumber(200_000)).toBe("200K");
    // 2M 而非 2.00M
    expect(formatNumber(2_000_000)).toBe("2M");
  });
});

describe("xpForLevel", () => {
  it("每级 XP 与等级成正比", () => {
    expect(xpForLevel(1)).toBe(250);
    expect(xpForLevel(2)).toBe(500);
    expect(xpForLevel(10)).toBe(2500);
  });
});

describe("levelFromXp", () => {
  it("0 XP 为等级 1", () => {
    const r = levelFromXp(0);
    expect(r.level).toBe(1);
    expect(r.levelStart).toBe(0);
    expect(r.levelEnd).toBe(250);
  });

  it("刚好达到等级 2 起点（250 XP）", () => {
    const r = levelFromXp(250);
    expect(r.level).toBe(2);
    expect(r.levelStart).toBe(250);
    expect(r.levelEnd).toBe(250 + 500);
  });

  it("跨多级累计正确", () => {
    // 等级 1: 250, 等级 2: 500, 累计 750 后进入等级 3
    const r = levelFromXp(750);
    expect(r.level).toBe(3);
    expect(r.levelStart).toBe(750);
  });

  it("等级区间中段保持当前等级", () => {
    // 等级 1 区间 [0, 250)，100 XP 仍是等级 1
    const r = levelFromXp(100);
    expect(r.level).toBe(1);
    expect(r.levelStart).toBe(0);
    expect(r.levelEnd).toBe(250);
  });

  it("高 XP 下仍能正确计算", () => {
    // 进入等级 n 的累计 XP 起点 = 250 * (n-1)*n/2
    // 等级 10 起点：250 * 9*10/2 = 11250
    const r = levelFromXp(11250);
    expect(r.level).toBe(10);
    // 等级 11 起点：250 * 10*11/2 = 13750
    expect(levelFromXp(13750).level).toBe(11);
  });
});

describe("timeAgo", () => {
  it("刚刚（秒级）", () => {
    const iso = new Date(Date.now() - 5 * 1000).toISOString();
    expect(timeAgo(iso)).toBe("5秒前");
  });

  it("分钟级", () => {
    const iso = new Date(Date.now() - 10 * 60 * 1000).toISOString();
    expect(timeAgo(iso)).toBe("10分钟前");
  });

  it("小时级", () => {
    const iso = new Date(Date.now() - 3 * 3600 * 1000).toISOString();
    expect(timeAgo(iso)).toBe("3小时前");
  });

  it("天级", () => {
    const iso = new Date(Date.now() - 5 * 86400 * 1000).toISOString();
    expect(timeAgo(iso)).toBe("5天前");
  });

  it("0 秒前边界", () => {
    const iso = new Date().toISOString();
    // 刚创建可能 0 秒前
    expect(["0秒前", "1秒前"]).toContain(timeAgo(iso));
  });

  it("未来时间（时钟偏移）统一显示为刚刚，避免负数", () => {
    // 模拟本地时钟落后于服务器：传入的时间在未来 1 小时
    const iso = new Date(Date.now() + 3600 * 1000).toISOString();
    expect(timeAgo(iso)).toBe("刚刚");
  });
});

describe("genId", () => {
  it("带前缀", () => {
    const id = genId("b");
    expect(id.startsWith("b_")).toBe(true);
  });

  it("默认前缀为 id", () => {
    const id = genId();
    expect(id.startsWith("id_")).toBe(true);
  });

  it("多次调用结果唯一", () => {
    const ids = new Set(Array.from({ length: 100 }, () => genId("x")));
    expect(ids.size).toBe(100);
  });

  it("长度合理（前缀 + 8 字符）", () => {
    const id = genId("p");
    // prefix_ + 至少 8 字符
    expect(id.length).toBeGreaterThanOrEqual(10);
  });
});
