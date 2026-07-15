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
export function buildLumiSystemPrompt(exercise: Exercise, userCode: string): string {
  return `You are Lumi, the friendly AI coding buddy on Codédex.
Current exercise: ${exercise.title}
Exercise type: ${exercise.type}
Language: ${exercise.language}

Rules:
1. Use simple, friendly language suitable for beginners.
2. NEVER give the direct answer. Guide the learner to think.
3. Give progressive hints — start subtle, get more specific if asked again.
4. If the user's code has a bug, point out WHERE and WHY, but let them fix it.
5. Keep replies under 200 words. Use Markdown.
6. Be encouraging and positive.

User's current code:
\`\`\`${exercise.language}
${userCode || "(empty)"}
\`\`\``;
}

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
    return `No worries — let's break it down together! 🌟

Looking at this exercise, you need to **${summarizeGoal(exercise)}**.

Here's a nudge:
- What ${lang === "python" ? "function" : "tool"} have we learned that displays output?
- Try writing it step by step in plain English first, then translate to ${lang}.

Show me what you've tried and I'll help you spot what's off! 💪`;
  }

  if (/(error|bug|wrong|not work|fail|报错|错)/i.test(msg)) {
    if (!userCode.trim()) {
      return `I don't see any code yet — try writing something in the editor first! Even a partial attempt helps me help you. ✨

Start with what the exercise is asking: ${summarizeGoal(exercise)}.`;
    }
    return `Let's debug together! 🐛

Looking at your code:
\`\`\`${lang}
${userCode}
\`\`\`

A few things to check:
1. Are your quotes balanced? (\`"...\`" needs a matching \`"\`)
2. Is the ${lang === "python" ? "indentation" : "syntax"} correct?
3. Does your output **exactly** match what the test expects? (Even an extra space counts!)

Tell me what output you're getting vs. what you expected, and we'll narrow it down. 🔍`;
  }

  if (/(how|what|why|explain|概念|怎么)/i.test(msg)) {
    return `Great question! 💡

${explainConcept(exercise)}

Want me to give you a more specific hint about your current code? Just ask!`;
  }

  // 默认回复
  return `I'm Lumi, your coding buddy! 🤖

Here's what I know about this exercise:
- **Goal**: ${summarizeGoal(exercise)}
- **Language**: ${lang}
- **XP reward**: ${exercise.xpReward}

Try writing your solution in the editor. If you get stuck, ask me for a **hint**, or paste an **error** and I'll help debug. You've got this! 💪`;
}

function summarizeGoal(exercise: Exercise): string {
  // 从测试用例推断目标
  const tc = exercise.testCases[0];
  if (tc) {
    if (exercise.language === "python" || exercise.language === "javascript") {
      return `produce the output \`${tc.expected.trim()}\``;
    }
    return `produce code matching \`${tc.expected.trim().slice(0, 60)}\``;
  }
  return "complete the exercise";
}

function explainConcept(exercise: Exercise): string {
  const lang = exercise.language;
  if (lang === "python") {
    return `**Python basics**:
- \`print()\` displays text on the screen
- Variables store values: \`name = "Ada"\`
- Strings go in quotes, numbers don't
- Indentation (4 spaces) matters for blocks`;
  }
  if (lang === "javascript") {
    return `**JavaScript basics**:
- \`console.log()\` prints to the console
- Use \`let\` or \`const\` to declare variables
- Strings use \`"\` or \`'\`
- Statements end with \`;\``;
  }
  if (lang === "html") {
    return `**HTML basics**:
- Tags wrap content: \`<tag>...</tag>\`
- Common tags: \`<h1>\`, \`<p>\`, \`<a>\`, \`<div>\`
- Most tags need a closing tag`;
  }
  if (lang === "css") {
    return `**CSS basics**:
- Select an element, then style it
- \`selector { property: value; }\`
- Example: \`p { color: purple; }\``;
  }
  return `This is a ${lang} exercise. Write your solution in the editor and run it!`;
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
