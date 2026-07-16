# CodeGame

> 最有趣且入门友好的学编程方式 —— 游戏化编程学习平台

CodeGame 是一个基于浏览器的游戏化编程学习平台，提供互动课程、浏览器内代码编辑器、XP 与徽章系统、社区作品展示与友好的 AI 助手 Lumi。零配置、零安装，打开即学。

## 核心特性

- **游戏化学习**：像素风角色、XP 升级、12+ 徽章、连续学习打卡（streak）
- **浏览器内代码执行**：Python（Pyodide WASM）、JavaScript（Web Worker 沙箱）、HTML/CSS/SQL（静态校验）
- **安全沙箱**：JS Worker 删除 fetch/XHR/WebSocket；Python 屏蔽 socket/urllib；CSP 内容安全策略
- **AI 助手 Lumi**：渐进式提示，绝不直接给答案，引导思考
- **作品工作室**：多文件项目、实时预览、一键发布、复刻（fork）
- **社区论坛**：4 个分类（综合/职业/展示/自我介绍）、点赞评论
- **离线持久化**：Zustand + localStorage，进度与草稿刷新不丢失

## 技术栈

| 层 | 技术 |
|---|---|
| 框架 | Next.js 14（App Router）+ React 18 + TypeScript strict |
| 状态 | Zustand + persist 中间件（localStorage） |
| 样式 | Tailwind CSS（自定义像素风设计 token） |
| 编辑器 | Monaco Editor（@monaco-editor/react） |
| Python 运行时 | Pyodide（WASM CPython，CDN 加载） |
| JS 沙箱 | Web Worker（删除网络 API） |
| 动画 | framer-motion + canvas-confetti |
| Markdown | react-markdown + remark-gfm |
| 测试 | Vitest + @testing-library/react |

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 打开 http://localhost:3000

# 生产构建
npm run build
npm start

# 运行测试
npm test

# 测试覆盖率
npm run test:coverage

# TypeScript 类型检查
npx tsc --noEmit
```

## 项目结构

```
src/
├── app/                        # Next.js App Router 路由
│   ├── [courseSlug]/           # 课程详情 / 章节 / 练习
│   │   ├── [chapterId]/        # 章节页（章节概览 + 练习列表）
│   │   └── CourseDetailClient  # 课程详情客户端组件
│   ├── builds/                 # 作品画廊 / 编辑器 / 详情
│   ├── community/              # 社区论坛
│   ├── blog/                   # 博客
│   ├── dashboard/              # 用户仪表盘
│   ├── settings/               # 设置
│   ├── courses/                # 课程目录
│   ├── worlds/                 # 世界（学习路径）
│   ├── u/[username]/           # 用户资料
│   ├── error.tsx               # 全局错误边界
│   └── not-found.tsx           # 全局 404
├── components/                 # 可复用组件
│   ├── editor/                 # 代码编辑器（Monaco）
│   ├── game/                   # 游戏化组件（XP/徽章/streak）
│   ├── lumi/                   # AI 助手面板
│   ├── layout/                 # 布局（Navbar/Footer/Shell）
│   ├── community/              # 社区组件
│   └── course/                 # 课程卡片
├── lib/                        # 核心库
│   ├── code-runner.ts          # 代码执行器（Python/JS/静态）
│   ├── badges.ts               # 徽章状态计算
│   ├── lumi.ts                 # Lumi AI 助手 Mock
│   ├── preview-doc.ts          # 作品预览文档（CSP 注入）
│   └── utils.ts                # 工具函数
├── stores/                     # Zustand 状态
│   └── user-store.ts           # 用户/进度/作品/帖子 store
├── data/                       # 静态数据
│   ├── courses.ts              # 25 门课程数据
│   ├── badges.ts               # 12 个徽章定义
│   ├── builds.ts               # 种子作品
│   ├── posts.ts                # 种子帖子
│   ├── blog.ts                 # 博客文章
│   └── journeys.ts             # 学习路径
└── types/                      # TypeScript 类型定义
```

## 用户操作路径

详见 [操作逻辑文档](./docs/操作逻辑文档.md)。

## 功能优化记录

详见 [功能优化报告](./docs/功能优化报告.md)。

## 安全策略

- **CSP**：next.config.mjs 配置 Content-Security-Policy，限制脚本来源
- **JS 沙箱**：Web Worker 删除 fetch/XHR/WebSocket/indexedDB/caches，阻断网络请求
- **Python 沙箱**：删除 pyodide.http，屏蔽 socket/urllib/micropip
- **超时保护**：Python 通过 sys.settrace 每 1000 次字节码检查墙钟时间；JS Worker 超时 terminate
- **作品预览**：iframe sandbox="allow-scripts"，注入 CSP 阻止外部请求

## 测试

测试框架：Vitest + jsdom + @testing-library/react

```bash
npm test              # 运行所有测试
npm run test:watch    # 监听模式
npm run test:coverage # 覆盖率报告
```

覆盖范围：
- `lib/utils.ts`：cn / formatNumber / xpForLevel / levelFromXp / timeAgo / genId
- `lib/badges.ts`：12 个徽章状态计算
- `lib/code-runner.ts`：checkTests（动态/静态语言）/ runStatic / runCode 路由
- `stores/user-store.ts`：ensureCourseInit / completeExercise / builds / posts / badges

## 许可证

MIT
