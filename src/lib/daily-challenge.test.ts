import { describe, it, expect } from "vitest";
import { getDailyChallenge, getTimeUntilNextChallenge } from "./daily-challenge";

describe("getDailyChallenge", () => {
  it("返回有效的挑战对象（含 course/exercise/dayKey）", () => {
    const challenge = getDailyChallenge();
    expect(challenge).not.toBeNull();
    if (!challenge) return;
    expect(challenge.course).toBeDefined();
    expect(challenge.exercise).toBeDefined();
    expect(challenge.dayKey).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it("同一日期多次调用返回相同结果（确定性）", () => {
    const date = new Date(Date.UTC(2026, 6, 18));
    const c1 = getDailyChallenge(date);
    const c2 = getDailyChallenge(date);
    const c3 = getDailyChallenge(date);
    expect(c1).toEqual(c2);
    expect(c2).toEqual(c3);
  });

  it("不同日期可能返回不同练习（覆盖题库分布）", () => {
    // 抽样 30 天，统计 distinct exercise id 数量
    const ids = new Set<string>();
    for (let day = 1; day <= 30; day++) {
      const date = new Date(Date.UTC(2026, 0, day));
      const c = getDailyChallenge(date);
      if (c) ids.add(c.exercise.id);
    }
    // 题库足够大时，30 天内应至少出现 5 个不同练习
    expect(ids.size).toBeGreaterThanOrEqual(5);
  });

  it("dayKey 与传入日期的 UTC 日期一致", () => {
    const date = new Date(Date.UTC(2026, 6, 18, 23, 59, 59));
    const c = getDailyChallenge(date);
    expect(c?.dayKey).toBe("2026-07-18");
  });

  it("UTC 午夜边界：同一 UTC 日内时间不同但 dayKey 相同", () => {
    const early = new Date(Date.UTC(2026, 6, 18, 0, 0, 0));
    const late = new Date(Date.UTC(2026, 6, 18, 23, 59, 59));
    const c1 = getDailyChallenge(early);
    const c2 = getDailyChallenge(late);
    expect(c1?.dayKey).toBe(c2?.dayKey);
    expect(c1?.exercise.id).toBe(c2?.exercise.id);
  });

  it("练习类型为 python 或 javascript（有代码执行能力的）", () => {
    const date = new Date(Date.UTC(2026, 6, 18));
    const c = getDailyChallenge(date);
    if (!c) return;
    expect(["python", "javascript"]).toContain(c.exercise.language);
  });

  it("练习不是 bonus_article 类型", () => {
    const date = new Date(Date.UTC(2026, 6, 18));
    const c = getDailyChallenge(date);
    if (!c) return;
    expect(c.exercise.type).not.toBe("bonus_article");
  });
});

describe("getTimeUntilNextChallenge", () => {
  it("返回非空字符串", () => {
    const result = getTimeUntilNextChallenge();
    expect(typeof result).toBe("string");
    expect(result.length).toBeGreaterThan(0);
  });

  it("UTC 午夜前 1 小时返回包含'小时'的字符串", () => {
    // UTC 23:00 → 距离下一个 UTC 午夜约 1 小时
    const date = new Date(Date.UTC(2026, 6, 18, 23, 0, 0));
    const result = getTimeUntilNextChallenge(date);
    expect(result).toContain("小时");
  });

  it("UTC 午夜前 30 分钟返回包含'分钟'的字符串（无小时）", () => {
    const date = new Date(Date.UTC(2026, 6, 18, 23, 30, 0));
    const result = getTimeUntilNextChallenge(date);
    expect(result).toContain("分钟");
    expect(result).not.toContain("小时");
  });

  it("UTC 午夜前 5 分钟仍返回分钟", () => {
    const date = new Date(Date.UTC(2026, 6, 18, 23, 55, 0));
    const result = getTimeUntilNextChallenge(date);
    expect(result).toContain("分钟");
  });
});
