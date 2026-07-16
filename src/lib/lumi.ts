import type { Exercise } from "@/types";

export interface LumiMessage {
  role: "user" | "assistant";
  content: string;
}

/**
 * Lumi AI 助手 —— Mock 实现
 * 不接入外部 LLM API，根据上下文给出预设的渐进式提示回复。
 * 模拟 SSE 流式输出，逐 token 推送。
 */

/** 根据用户问题与代码生成 Mock 回复 */
export function generateLumiReply(
  exercise: Exercise,
  userCode: string,
  userMessage: string,
): string {
  const msg = userMessage.toLowerCase();
  const lang = exercise.language;

  // 检测关键词并给出对应提示
  if (/(stuck|help|don't know|dont know|hint|stuck|卡|不会)/i.test(msg)) {
    return `别担心——我们一起拆解它！🌟

看一下这个练习，你需要**${summarizeGoal(exercise)}**。

给你一点提示：
- 我们学过的哪个${lang === "python" ? "函数" : "工具"}可以显示输出？
- 试着先用通俗的语言一步步写出来，再翻译成 ${lang}。

把你尝试过的代码给我看看，我帮你找出问题！💪`;
  }

  if (/(error|bug|wrong|not work|fail|报错|错)/i.test(msg)) {
    if (!userCode.trim()) {
      return `我还没看到任何代码——先在编辑器里写点什么吧！即使是部分尝试也能帮我更好地帮你。✨

从这个练习的要求开始：${summarizeGoal(exercise)}。`;
    }
    return `我们一起调试吧！🐛

看一下你的代码：
\`\`\`${lang}
${userCode}
\`\`\`

检查几点：
1. 引号是否成对？（\`"...\`" 需要配对的 \`"\`）
2. ${lang === "python" ? "缩进" : "语法"}是否正确？
3. 你的输出是否**完全**匹配测试期望？（即使多一个空格也算！）

告诉我你得到的输出和期望的输出，我们一起缩小范围。🔍`;
  }

  if (/(how|what|why|explain|概念|怎么)/i.test(msg)) {
    return `好问题！💡

${explainConcept(exercise)}

需要我就你当前的代码给出更具体的提示吗？尽管问！`;
  }

  // 默认回复
  return `我是 Lumi，你的编程伙伴！🤖

关于这个练习，我知道这些：
- **目标**：${summarizeGoal(exercise)}
- **语言**：${lang}
- **XP 奖励**：${exercise.xpReward}

试着在编辑器里写出你的解决方案。如果卡住了，向我要个**提示**，或者贴出**错误**，我帮你调试。你能行的！💪`;
}

function summarizeGoal(exercise: Exercise): string {
  // 从测试用例推断目标
  const tc = exercise.testCases[0];
  if (tc) {
    if (exercise.language === "python" || exercise.language === "javascript") {
      return `生成输出 \`${tc.expected.trim()}\``;
    }
    return `生成匹配 \`${tc.expected.trim().slice(0, 60)}\` 的代码`;
  }
  return "完成练习";
}

function explainConcept(exercise: Exercise): string {
  const lang = exercise.language;
  if (lang === "python") {
    return `**Python 基础**：
- \`print()\` 在屏幕上显示文本
- 变量存储值：\`name = "Ada"\`
- 字符串用引号括起来，数字不用
- 缩进（4 个空格）对代码块很重要`;
  }
  if (lang === "javascript") {
    return `**JavaScript 基础**：
- \`console.log()\` 打印到控制台
- 用 \`let\` 或 \`const\` 声明变量
- 字符串用 \`"\` 或 \`'\`
- 语句以 \`;\` 结尾`;
  }
  if (lang === "html") {
    return `**HTML 基础**：
- 标签包裹内容：\`<tag>...</tag>\`
- 常见标签：\`<h1>\`、\`<p>\`、\`<a>\`、\`<div>\`
- 大多数标签需要闭合标签`;
  }
  if (lang === "css") {
    return `**CSS 基础**：
- 选择一个元素，然后设置样式
- \`selector { property: value; }\`
- 示例：\`p { color: purple; }\``;
  }
  return `这是一个 ${lang} 练习。在编辑器里写出你的解决方案并运行它！`;
}

/** 模拟流式输出 —— 逐 token 回调 */
export async function streamLumiReply(
  reply: string,
  onToken: (token: string) => void,
  onDone: () => void,
) {
  // 按词与标点切分，模拟 token 流
  const tokens = reply.match(/\S+\s*/g) ?? [reply];
  for (const t of tokens) {
    onToken(t);
    // 随机延迟，模拟网络与生成
    await new Promise((r) => setTimeout(r, 30 + Math.random() * 60));
  }
  onDone();
}
