import { describe, it, expect } from "vitest";
import type { Exercise } from "@/types";
import { generateLumiReply, streamLumiReply } from "./lumi";

// 构造一个最小可用 Exercise，用于测试
function makeExercise(overrides: Partial<Exercise> = {}): Exercise {
  return {
    id: "ex-test",
    chapterId: "ch-test",
    title: "测试练习",
    sortOrder: 0,
    type: "exercise",
    contentMd: "测试内容",
    starterCode: "",
    testCases: [{ name: "t1", expected: "Hello\n" }],
    xpReward: 10,
    language: "python",
    ...overrides,
  };
}

describe("generateLumiReply", () => {
  it("卡壳关键词触发提示回复", () => {
    const ex = makeExercise();
    const reply = generateLumiReply(ex, "print('hi')", "我卡住了 help");
    expect(reply).toContain("别担心");
    expect(reply).toContain("Hello");
  });

  it("help 关键词命中（英文）", () => {
    const ex = makeExercise();
    const reply = generateLumiReply(ex, "", "I'm stuck");
    expect(reply).toContain("别担心");
  });

  it("错误关键词且无代码时，提示先写代码", () => {
    const ex = makeExercise();
    const reply = generateLumiReply(ex, "   ", "报错了 wrong");
    expect(reply).toContain("我还没看到任何代码");
    expect(reply).toContain("Hello");
  });

  it("错误关键词且有代码时，给出调试建议", () => {
    const ex = makeExercise({ language: "javascript" });
    const reply = generateLumiReply(ex, "console.log('hi')", "not work fail");
    expect(reply).toContain("调试");
    expect(reply).toContain("console.log('hi')");
    // javascript 应提示"语法"
    expect(reply).toContain("语法");
  });

  it("Python 错误回复应包含缩进提示", () => {
    const ex = makeExercise({ language: "python" });
    const reply = generateLumiReply(ex, "print('x')", "报错");
    expect(reply).toContain("缩进");
  });

  it("概念问题关键词触发解释", () => {
    const ex = makeExercise({ language: "html" });
    const reply = generateLumiReply(ex, "", "how to explain 概念");
    expect(reply).toContain("好问题");
    expect(reply).toContain("HTML");
  });

  it("CSS 概念回复", () => {
    const ex = makeExercise({ language: "css" });
    const reply = generateLumiReply(ex, "", "explain 怎么用");
    expect(reply).toContain("CSS");
  });

  it("其它语言走默认概念分支", () => {
    const ex = makeExercise({ language: "sql" });
    const reply = generateLumiReply(ex, "", "explain 怎么用");
    expect(reply).toContain("sql");
  });

  it("默认回复包含目标和 XP 奖励", () => {
    const ex = makeExercise({ xpReward: 25 });
    const reply = generateLumiReply(ex, "", "随便说点什么");
    expect(reply).toContain("Lumi");
    expect(reply).toContain("Hello");
    expect(reply).toContain("25");
  });

  it("无测试用例时 summarizeGoal 兜底为'完成练习'", () => {
    const ex = makeExercise({ testCases: [] });
    const reply = generateLumiReply(ex, "", "卡住了");
    expect(reply).toContain("完成练习");
  });

  it("非 python/js 语言的测试用例目标截断为 60 字符", () => {
    const longExpected = "A".repeat(100);
    const ex = makeExercise({
      language: "html",
      testCases: [{ name: "t", expected: longExpected }],
    });
    const reply = generateLumiReply(ex, "", "卡住了");
    // 截取 60 字符后应出现在回复中
    expect(reply).toContain("A".repeat(60));
    expect(reply).not.toContain("A".repeat(61));
  });
});

describe("streamLumiReply", () => {
  it("逐 token 回调并最终调用 onDone", async () => {
    const reply = "hello world foo";
    const tokens: string[] = [];
    await new Promise<void>((resolve) => {
      streamLumiReply(
        reply,
        (t) => tokens.push(t),
        () => resolve(),
      );
    });
    // 拼接所有 token 应能还原原字符串
    expect(tokens.join("")).toBe(reply);
    expect(tokens.length).toBeGreaterThan(0);
  });

  it("空字符串依然调用 onDone", async () => {
    let done = false;
    await new Promise<void>((resolve) => {
      streamLumiReply(
        "",
        () => {},
        () => {
          done = true;
          resolve();
        },
      );
    });
    expect(done).toBe(true);
  });

  it("无空白字符的字符串作为整体单 token", async () => {
    const reply = "abcdef";
    const tokens: string[] = [];
    await new Promise<void>((resolve) => {
      streamLumiReply(
        reply,
        (t) => tokens.push(t),
        () => resolve(),
      );
    });
    // 无空白时 match(/\S+\s*/g) 返回 [reply]
    expect(tokens).toEqual([reply]);
  });
});
